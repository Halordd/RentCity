import { expect, test } from "@playwright/test";
import { installSession, loginByOtp } from "./helpers/api";
import { expectNoReplacementCharacters } from "./helpers/ui";

test.describe("admin back-office journey", () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Admin journey runs on desktop.");
  });

  test("opens every admin console section with an ADMIN session", async ({ page, request }) => {
    const admin = await loginByOtp(request, "+84900000000");
    expect(admin.user.role).toBe("ADMIN");
    await installSession(page, admin);

    await page.goto("/admin");
    await expect(page.locator(".admin-layout")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Admin Command Center", exact: true })).toBeVisible();
    await expect(page.locator(".admin-nav button")).toHaveCount(9);
    await expectNoReplacementCharacters(page);

    const sections = [
      ["/admin/listings", "Kiểm duyệt tin đăng", 1],
      ["/admin/verification", "Duyệt xác minh", 1],
      ["/admin/automation", "Quy tắc hệ thống", 0],
      ["/admin/billing", "Tài chính & đối soát", 1],
      ["/admin/disputes", "Trung tâm khiếu nại", 1],
      ["/admin/audit", "Audit logs", 1],
      ["/admin/access", "Phân quyền & bảo mật", 0],
      ["/admin/settings", "Cài đặt hệ thống", 0]
    ] as const;

    for (const [url, title, tableCount] of sections) {
      await page.goto(url);
      await expect(page.locator(".admin-layout")).toBeVisible();
      await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
      await expect(page.locator("table")).toHaveCount(tableCount);
      await expectNoReplacementCharacters(page);
    }
  });
});
