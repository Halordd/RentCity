import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { getOrCreateRequestId, RequestWithContext } from "../http/request-context";

type ReplyWithStatus = {
  header(name: string, value: string): ReplyWithStatus;
  status(statusCode: number): ReplyWithStatus;
  send(payload: unknown): void;
};

type RequestWithUrl = RequestWithContext & {
  method?: string;
  url?: string;
};

type ExceptionPayload = {
  code: string;
  message: string | string[];
  details?: unknown;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const request = http.getRequest<RequestWithUrl>();
    const reply = http.getResponse<ReplyWithStatus>();
    const statusCode = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const requestId = getOrCreateRequestId(request);
    const payload = this.normalizeException(exception, statusCode);

    if (statusCode >= 500) {
      this.logger.error(`${request.method ?? "UNKNOWN"} ${request.url ?? "unknown"} failed`, exception instanceof Error ? exception.stack : undefined);
    }

    reply
      .header("x-request-id", requestId)
      .status(statusCode)
      .send({
        error: {
          statusCode,
          code: payload.code,
          message: payload.message,
          details: payload.details,
          timestamp: new Date().toISOString(),
          path: request.url,
          requestId
        }
      });
  }

  private normalizeException(exception: unknown, statusCode: number): ExceptionPayload {
    if (!(exception instanceof HttpException)) {
      return {
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error"
      };
    }

    const response = exception.getResponse();
    if (typeof response === "string") {
      return {
        code: this.statusToCode(statusCode),
        message: response
      };
    }

    if (response && typeof response === "object") {
      const body = response as Record<string, unknown>;
      return {
        code: typeof body.error === "string" ? this.toConstantCase(body.error) : this.statusToCode(statusCode),
        message: this.normalizeMessage(body.message, exception.message),
        details: body.details
      };
    }

    return {
      code: this.statusToCode(statusCode),
      message: exception.message
    };
  }

  private normalizeMessage(message: unknown, fallback: string): string | string[] {
    if (typeof message === "string") return message;
    if (Array.isArray(message) && message.every((item) => typeof item === "string")) return message;
    return fallback;
  }

  private statusToCode(statusCode: number): string {
    return HttpStatus[statusCode] ?? "HTTP_ERROR";
  }

  private toConstantCase(value: string): string {
    return value.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "").toUpperCase() || "HTTP_ERROR";
  }
}
