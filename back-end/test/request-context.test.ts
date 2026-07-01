import assert from "node:assert/strict";
import test from "node:test";
import { getOrCreateRequestId, RequestWithContext } from "../src/common/http/request-context";

test("request context reuses safe incoming request ids", () => {
  const request: RequestWithContext = {
    headers: {
      "x-request-id": "rentcity-test-123"
    }
  };

  assert.equal(getOrCreateRequestId(request), "rentcity-test-123");
  assert.equal(request.requestId, "rentcity-test-123");
});

test("request context replaces unsafe incoming request ids", () => {
  const request: RequestWithContext = {
    headers: {
      "x-request-id": "../bad id"
    }
  };
  const requestId = getOrCreateRequestId(request);

  assert.notEqual(requestId, "../bad id");
  assert.match(requestId, /^[a-zA-Z0-9._:-]{1,100}$/);
});
