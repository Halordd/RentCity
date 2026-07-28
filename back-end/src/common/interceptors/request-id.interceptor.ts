import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { getOrCreateRequestId, RequestWithContext } from "../http/request-context";

type ReplyWithHeader = {
  header(name: string, value: string): void;
};

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<RequestWithContext>();
    const reply = context.switchToHttp().getResponse<ReplyWithHeader>();
    const requestId = getOrCreateRequestId(request);

    reply.header("x-request-id", requestId);
    return next.handle();
  }
}
