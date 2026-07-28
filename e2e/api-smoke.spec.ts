import { expect, test } from "@playwright/test";
import { authHeaders, backendUrl, loginByOtp, uniqueVietnamPhone, unwrapJson } from "./helpers/api";

test.describe("backend contract smoke", () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Run API smoke once on the desktop project.");
  });

  test("supports tenant, owner, and admin core flows", async ({ request }) => {
    const ready = await request.get(`${backendUrl}/health/ready`);
    await expect(ready).toBeOK();

    const image = await request.get(`${backendUrl}/uploads/listings/studio-nguyen-van-cu.jpg`);
    await expect(image).toBeOK();
    expect(image.headers()["cross-origin-resource-policy"]).toBe("cross-origin");

    const listings = await unwrapJson<{ items: Array<{ id: string; owner?: { id: string } }> }>(
      await request.get(`${backendUrl}/listings`)
    );
    expect(listings.items.length).toBeGreaterThan(0);

    const detail = await unwrapJson<{ id: string; owner: { id: string } }>(
      await request.get(`${backendUrl}/listings/studio-nguyen-van-cu`)
    );
    expect(detail.owner.id).toBeTruthy();

    const tenant = await loginByOtp(request, uniqueVietnamPhone());
    const tenantHeaders = authHeaders(tenant);
    expect(tenant.user.role).toBe("TENANT");

    const savedResponse = await request.post(`${backendUrl}/me/saved-listings/studio-nguyen-van-cu`, { headers: tenantHeaders });
    await expect(savedResponse).toBeOK();

    const booking = await unwrapJson<{ id: string; status: string }>(
      await request.post(`${backendUrl}/bookings`, {
        headers: tenantHeaders,
        data: {
          listingId: "studio-nguyen-van-cu",
          date: "2026-07-04",
          timeSlot: "14:30 - 16:00",
          note: "E2E contract smoke"
        }
      })
    );
    expect(booking.status).toBe("PENDING_OWNER");

    const conversation = await unwrapJson<{ id: string }>(
      await request.post(`${backendUrl}/conversations`, {
        headers: tenantHeaders,
        data: { ownerId: detail.owner.id, listingId: detail.id }
      })
    );
    const messageResponse = await request.post(`${backendUrl}/conversations/${conversation.id}/messages`, {
      headers: tenantHeaders,
      data: { body: "Can I view this listing tomorrow?" }
    });
    await expect(messageResponse).toBeOK();

    const owner = await loginByOtp(request, "+84987654321");
    expect(owner.user.role).toBe("OWNER");
    const ownerDashboard = await unwrapJson<{ metrics: { managedListings: number } }>(
      await request.get(`${backendUrl}/owner/dashboard`, { headers: authHeaders(owner) })
    );
    expect(ownerDashboard.metrics.managedListings).toBeGreaterThan(0);

    const admin = await loginByOtp(request, "+84900000000");
    expect(admin.user.role).toBe("ADMIN");
    const verifications = await unwrapJson<{ items: unknown[] }>(
      await request.get(`${backendUrl}/admin/verifications`, { headers: authHeaders(admin) })
    );
    expect(verifications.items.length).toBeGreaterThan(0);
  });
});
