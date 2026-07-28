import { expect, test } from "@playwright/test";
import { installSession, loginByOtp } from "./helpers/api";
import { clickUnique, expectFooter, expectNoReplacementCharacters, fillUnique } from "./helpers/ui";

test.describe("owner web center journey", () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Owner center journey runs on desktop.");
  });

  test("loads owner dashboard and saves a draft listing", async ({ page, request }) => {
    const owner = await loginByOtp(request, "+84987654321");
    expect(owner.user.role).toBe("OWNER");
    await installSession(page, owner);

    await page.goto("/web/owner");
    await expect(page.getByRole("heading", { name: "Quản lý danh mục cho thuê", exact: true })).toBeVisible();
    await expect(page.getByText("Nhà đang quản lý", { exact: true })).toBeVisible();
    await expect(page.getByText("Pipeline khách thuê", { exact: true })).toBeVisible();
    await expectFooter(page);
    await expectNoReplacementCharacters(page);

    await page.goto("/web/post");
    await fillUnique(page.getByLabel("Tên nhà", { exact: true }), "Studio E2E gần đại học", "listing title input");
    await fillUnique(page.getByLabel("Giá thuê", { exact: true }), "6.2tr/tháng", "listing price input");
    await fillUnique(page.getByLabel("Diện tích", { exact: true }), "32m2", "listing area input");
    await fillUnique(page.getByLabel("Mô tả", { exact: true }), "Ảnh thật, có ban công, cọc một tháng.", "listing description input");
    await clickUnique(page.getByRole("button", { name: "Lưu tin nháp", exact: true }), "save draft listing");

    await expect(page).toHaveURL(/\/web\/owner$/);
    await expect(page.locator("[role='status']")).toContainText("Đã lưu tin nháp");
  });
});
