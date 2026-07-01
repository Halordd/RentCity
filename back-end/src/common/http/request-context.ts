import { randomUUID } from "node:crypto";

export type HeaderValue = string | string[] | undefined;

export type RequestWithContext = {
  headers?: Record<string, HeaderValue>;
  requestId?: string;
};

function firstHeader(value: HeaderValue): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function isSafeRequestId(value: string): boolean {
  return /^[a-zA-Z0-9._:-]{1,100}$/.test(value);
}

export function getOrCreateRequestId(request: RequestWithContext): string {
  if (request.requestId) return request.requestId;

  const incoming = firstHeader(request.headers?.["x-request-id"])?.trim();
  const requestId = incoming && isSafeRequestId(incoming) ? incoming : randomUUID();
  request.requestId = requestId;

  return requestId;
}
