import { expect, test } from "@playwright/test";
import { resetClientState, uniqueVietnamPhone } from "./helpers/api";
import { clickUnique, expectFooter, expectNoBrokenImages, expectNoModeSwitcher, expectNoReplacementCharacters, fillUnique } from "./helpers/ui";

test.describe("web tenant journey", () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Web tenant journey runs on desktop.");
  });

  test("searches, authenticates with OTP, and books a viewing", async ({ page }) => {
    await resetClientState(page);

    await page.goto("/web");
    await expect(page.getByRole("heading", { name: "RentCity", exact: true })).toBeVisible();
    await expectNoModeSwitcher(page);
    await expectFooter(page);
    await expectNoBrokenImages(page);
    await expectNoReplacementCharacters(page);

    await clickUnique(page.getByRole("button", { name: "Tìm nhà", exact: true }), "home search submit");
    await expect(page).toHaveURL(/\/web\/search$/);
    await expect(page.getByRole("heading", { name: "Chọn nhà đúng nhu cầu", exact: true })).toBeVisible();
    await expectNoBrokenImages(page);

    const studioCard = page.locator(".listing-card").filter({ hasText: "Studio Nguyen Van Cu" });
    await clickUnique(studioCard.getByRole("button", { name: "Chi tiết", exact: true }), "studio detail button");
    await expect(page).toHaveURL(/\/web\/listing\/studio-nguyen-van-cu$/);
    await expect(page.getByRole("heading", { name: "Studio Nguyen Van Cu", exact: true })).toBeVisible();
    await expectNoBrokenImages(page);

    await page.goto("/web/account");
    await fillUnique(page.getByLabel("Số điện thoại", { exact: true }), uniqueVietnamPhone(), "tenant phone input");
    await clickUnique(page.getByRole("button", { name: "Gửi mã OTP", exact: true }), "send tenant OTP");
    await expect(page.locator("[role='status']")).toContainText("OTP dev:");
    const toast = await page.locator("[role='status']").innerText();
    const match = toast.match(/OTP dev:\s*(\d{6})/);
    expect(match?.[1], "OTP dev code should be visible in non-production mode").toBeTruthy();

    await fillUnique(page.getByPlaceholder("Nhập mã OTP", { exact: true }), match?.[1] || "", "tenant OTP input");
    await clickUnique(page.getByRole("button", { name: "Xác minh", exact: true }), "verify tenant OTP");
    await expect(page.locator("[role='status']")).toContainText("Đăng nhập thành công.");
    await expect(page.getByText("TENANT", { exact: false })).toBeVisible();

    await page.goto("/web/booking/studio-nguyen-van-cu");
    await clickUnique(page.getByRole("button", { name: "Xác nhận đặt lịch", exact: true }), "confirm booking");
    await expect(page).toHaveURL(/\/web\/payments$/);
    await expect(page.getByRole("heading", { name: "Cọc và hợp đồng", exact: true })).toBeVisible();
    await expectFooter(page);
  });
});
