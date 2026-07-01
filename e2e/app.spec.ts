import { expect, test } from "@playwright/test";
import { resetClientState } from "./helpers/api";
import { clickUnique, expectChatCanScroll, expectNoBrokenImages, expectNoReplacementCharacters, expectPhoneNavClear, fillUnique } from "./helpers/ui";

test.describe("native-style mobile app journey", () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== "phone", "Mobile app journey runs on phone viewport.");
  });

  test("renders search, listing, bookings, payments, and stable chat scrolling", async ({ page }) => {
    await resetClientState(page);

    await page.goto("/app");
    await expect(page.getByRole("heading", { name: "Tìm nhà quanh bạn", exact: true })).toBeVisible();
    await expect(page.locator(".browser-bar")).toHaveCount(0);
    await expectNoBrokenImages(page);
    await expectNoReplacementCharacters(page);
    await expectPhoneNavClear(page);

    await page.goto("/app/search");
    await expect(page.getByRole("heading", { name: "Kết quả phù hợp", exact: true })).toBeVisible();
    await expectNoBrokenImages(page);

    await page.goto("/app/listing/studio-nguyen-van-cu");
    await expect(page.getByRole("heading", { name: "Studio Nguyen Van Cu", exact: true })).toBeVisible();
    await expectNoBrokenImages(page);

    await page.goto("/app/bookings");
    await expect(page.getByRole("heading", { name: "Lịch xem", exact: true })).toBeVisible();
    await expectPhoneNavClear(page);

    await page.goto("/app/payments");
    await expect(page.getByRole("heading", { name: "Cọc & hợp đồng", exact: true })).toBeVisible();
    await expectPhoneNavClear(page);

    await page.goto("/app/messages");
    await expect(page.getByRole("heading", { name: "Tin nhắn", exact: true })).toBeVisible();
    await expectPhoneNavClear(page);

    for (let index = 1; index <= 8; index += 1) {
      await fillUnique(page.getByPlaceholder("Nhập tin nhắn...", { exact: true }), `Tin test scroll ${index}`, "app message input");
      await clickUnique(page.getByRole("button", { name: "Gửi", exact: true }), "app send message");
    }

    await expect(page.locator(".chat-bubble")).toHaveCount(10);
    await expectChatCanScroll(page);
    await expectPhoneNavClear(page);
  });
});
