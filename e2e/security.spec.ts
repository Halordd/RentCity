import { expect, test, type APIRequestContext, type APIResponse } from "@playwright/test";
import { authHeaders, backendUrl, loginByOtp, uniqueVietnamPhone, unwrapJson } from "./helpers/api";

type ApiMethod = "get" | "post" | "patch" | "delete";

type ApiCase = {
  method: ApiMethod;
  path: string;
  data?: unknown;
};

async function expectStatus(response: APIResponse, status: number): Promise<void> {
  const body = await response.text();
  expect(response.status(), body).toBe(status);
}

async function callApi(request: APIRequestContext, apiCase: ApiCase, headers?: Record<string, string>): Promise<APIResponse> {
  const url = `${backendUrl}${apiCase.path}`;
  const options = {
    headers,
    data: apiCase.data
  };

  switch (apiCase.method) {
    case "get":
      return request.get(url, { headers });
    case "post":
      return request.post(url, options);
    case "patch":
      return request.patch(url, options);
    case "delete":
      return request.delete(url, { headers });
  }
}

test.describe("backend security and permissions", () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Run API security checks once on the desktop project.");
  });

  test("rejects unauthenticated access to protected reads", async ({ request }) => {
    const protectedReads: ApiCase[] = [
      { method: "get", path: "/me" },
      { method: "get", path: "/users/me/profile" },
      { method: "get", path: "/me/app-state" },
      { method: "get", path: "/me/saved-listings" },
      { method: "get", path: "/me/bookings" },
      { method: "get", path: "/conversations" },
      { method: "get", path: "/owner/dashboard" },
      { method: "get", path: "/admin/metrics" },
      { method: "get", path: "/payments/missing-payment" },
      { method: "get", path: "/contracts/missing-contract" }
    ];

    for (const apiCase of protectedReads) {
      await expectStatus(await callApi(request, apiCase), 401);
    }
  });

  test("rejects unauthenticated access to protected writes", async ({ request }) => {
    const protectedWrites: ApiCase[] = [
      {
        method: "post",
        path: "/bookings",
        data: {
          listingId: "studio-nguyen-van-cu",
          date: "2026-07-05",
          timeSlot: "09:00 - 11:00"
        }
      },
      {
        method: "post",
        path: "/conversations",
        data: { ownerId: "owner-minh", listingId: "studio-nguyen-van-cu" }
      },
      {
        method: "post",
        path: "/payments/deposits",
        data: { listingId: "studio-nguyen-van-cu", amount: 1000000, provider: "mock" }
      },
      {
        method: "post",
        path: "/contracts",
        data: { listingId: "studio-nguyen-van-cu" }
      },
      { method: "post", path: "/me/saved-listings/studio-nguyen-van-cu" },
      {
        method: "post",
        path: "/owner/listings",
        data: { title: "Unauthorized listing" }
      },
      {
        method: "post",
        path: "/admin/listings/studio-nguyen-van-cu/review",
        data: { status: "APPROVED" }
      }
    ];

    for (const apiCase of protectedWrites) {
      await expectStatus(await callApi(request, apiCase), 401);
    }
  });

  test("rejects malformed bearer tokens before role checks", async ({ request }) => {
    const headers = { Authorization: "Bearer not-a-valid-rentcity-token" };

    await expectStatus(await request.get(`${backendUrl}/me`, { headers }), 401);
    await expectStatus(await request.get(`${backendUrl}/owner/dashboard`, { headers }), 401);
    await expectStatus(await request.get(`${backendUrl}/admin/metrics`, { headers }), 401);
  });

  test("blocks tenant sessions from owner and admin workspaces", async ({ request }) => {
    const tenant = await loginByOtp(request, uniqueVietnamPhone("+8493"));
    const headers = authHeaders(tenant);

    expect(tenant.user.role).toBe("TENANT");

    const forbidden: ApiCase[] = [
      { method: "get", path: "/owner/dashboard" },
      { method: "get", path: "/owner/listings" },
      { method: "get", path: "/owner/bookings" },
      {
        method: "post",
        path: "/owner/listings",
        data: { title: "Tenant should not create owner listing" }
      },
      { method: "get", path: "/admin/metrics" },
      { method: "get", path: "/admin/verifications" },
      { method: "get", path: "/admin/audit-logs" },
      {
        method: "post",
        path: "/admin/listings/studio-nguyen-van-cu/review",
        data: { status: "APPROVED" }
      }
    ];

    for (const apiCase of forbidden) {
      await expectStatus(await callApi(request, apiCase, headers), 403);
    }
  });

  test("blocks owner sessions from admin-only operations", async ({ request }) => {
    const owner = await loginByOtp(request, "+84987654321");
    const headers = authHeaders(owner);

    expect(owner.user.role).toBe("OWNER");

    const forbidden: ApiCase[] = [
      { method: "get", path: "/admin/metrics" },
      { method: "get", path: "/admin/verifications" },
      { method: "get", path: "/admin/listings" },
      { method: "get", path: "/admin/disputes" },
      { method: "get", path: "/admin/audit-logs" },
      { method: "post", path: "/admin/verifications/verif-owner-1/approve" },
      {
        method: "post",
        path: "/admin/listings/studio-nguyen-van-cu/review",
        data: { status: "APPROVED" }
      }
    ];

    for (const apiCase of forbidden) {
      await expectStatus(await callApi(request, apiCase, headers), 403);
    }
  });

  test("prevents one tenant from changing another tenant booking", async ({ request }) => {
    const tenantA = await loginByOtp(request, uniqueVietnamPhone("+8494"));
    const tenantB = await loginByOtp(request, uniqueVietnamPhone("+8495"));
    const tenantAHeaders = authHeaders(tenantA);
    const tenantBHeaders = authHeaders(tenantB);

    const booking = await unwrapJson<{ id: string }>(
      await request.post(`${backendUrl}/bookings`, {
        headers: tenantAHeaders,
        data: {
          listingId: "studio-nguyen-van-cu",
          date: "2026-07-06",
          timeSlot: "14:30 - 16:00",
          note: "Ownership security check"
        }
      })
    );

    await expectStatus(
      await request.patch(`${backendUrl}/bookings/${booking.id}/cancel`, { headers: tenantBHeaders }),
      403
    );
    await expectStatus(
      await request.patch(`${backendUrl}/bookings/${booking.id}/reschedule`, {
        headers: tenantBHeaders,
        data: { date: "2026-07-07", timeSlot: "09:00 - 11:00" }
      }),
      403
    );
  });

  test("prevents one tenant from reading or writing another tenant conversation", async ({ request }) => {
    const listing = await unwrapJson<{ id: string; owner: { id: string } }>(
      await request.get(`${backendUrl}/listings/studio-nguyen-van-cu`)
    );
    const tenantA = await loginByOtp(request, uniqueVietnamPhone("+8496"));
    const tenantB = await loginByOtp(request, uniqueVietnamPhone("+8497"));
    const tenantAHeaders = authHeaders(tenantA);
    const tenantBHeaders = authHeaders(tenantB);

    const conversation = await unwrapJson<{ id: string }>(
      await request.post(`${backendUrl}/conversations`, {
        headers: tenantAHeaders,
        data: { ownerId: listing.owner.id, listingId: listing.id }
      })
    );

    await expectStatus(await request.get(`${backendUrl}/conversations/${conversation.id}/messages`, { headers: tenantBHeaders }), 403);
    await expectStatus(
      await request.post(`${backendUrl}/conversations/${conversation.id}/messages`, {
        headers: tenantBHeaders,
        data: { body: "This should not be accepted" }
      }),
      403
    );
    await expectStatus(await request.patch(`${backendUrl}/conversations/${conversation.id}/read`, { headers: tenantBHeaders }), 403);
  });
});
