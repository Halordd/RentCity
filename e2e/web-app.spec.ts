import { expect, test } from "@playwright/test";
import { resetClientState } from "./helpers/api";
import { clickUnique, expectChatCanScroll, expectNoBrokenImages, expectNoReplacementCharacters, expectPhoneNavClear, fillUnique } from "./helpers/ui";

test.describe("phone web_app journey", () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== "phone", "Phone web_app journey runs on phone viewport.");
  });

  test("keeps the PWA experience separate from app and covers manage/messages", async ({ page }) => {
    await resetClientState(page);

    await page.goto("/web_app");
    await expect(page.locator(".browser-bar")).toContainText("rentcity.vn/app");
    await expect(page.getByRole("heading", { name: "RentCity PWA", exact: true })).toBeVisible();
    await expectNoReplacementCharacters(page);
    await expectPhoneNavClear(page);

    await page.goto("/web_app/search");
    await expect(page.getByRole("heading", { name: "Tìm nhà trên web app", exact: true })).toBeVisible();
    await expect(page.locator(".browser-bar")).toBeVisible();
    await expectNoBrokenImages(page);

    await page.goto("/web_app/listing/studio-nguyen-van-cu");
    await expect(page.getByRole("heading", { name: "Studio Nguyen Van Cu", exact: true })).toBeVisible();
    await expectNoBrokenImages(page);

    await page.goto("/web_app/manage");
    await expect(page.getByRole("heading", { name: "Nhà đang thuê", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Thanh toán & biên nhận", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Tin nhắn chủ nhà", exact: true })).toBeVisible();
    await expectNoBrokenImages(page);

    await page.goto("/web_app/messages");
    await expect(page.getByRole("heading", { name: "Tin nhắn", exact: true })).toBeVisible();
    await expect(page.locator(".browser-bar")).toBeVisible();
    await expectPhoneNavClear(page);

    for (let index = 1; index <= 8; index += 1) {
      await fillUnique(page.getByPlaceholder("Nhập tin nhắn...", { exact: true }), `Web app scroll ${index}`, "web_app message input");
      await clickUnique(page.getByRole("button", { name: "Gửi", exact: true }), "web_app send message");
    }

    await expect(page.locator(".chat-bubble")).toHaveCount(10);
    await expectChatCanScroll(page);
    await expectPhoneNavClear(page);
  });
});
