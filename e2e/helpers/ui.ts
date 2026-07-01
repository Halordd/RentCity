import { expect, type Locator, type Page } from "@playwright/test";

export async function clickUnique(locator: Locator, label: string): Promise<void> {
  await expect(locator, label).toHaveCount(1);
  await locator.click();
}

export async function fillUnique(locator: Locator, value: string, label: string): Promise<void> {
  await expect(locator, label).toHaveCount(1);
  await locator.fill(value);
}

export async function expectNoBrokenImages(page: Page): Promise<void> {
  await expect
    .poll(
      () =>
        page.evaluate(() =>
          Array.from(document.images)
            .filter((image) => !image.complete || image.naturalWidth === 0 || image.naturalHeight === 0)
            .map((image) => ({ alt: image.alt, src: image.currentSrc || image.src }))
        ),
      { timeout: 10_000 }
    )
    .toEqual([]);
}

export async function expectNoReplacementCharacters(page: Page): Promise<void> {
  const text = await page.locator("body").innerText();
  expect(text).not.toContain("�");
}

export async function expectFooter(page: Page): Promise<void> {
  await expect(page.locator("footer")).toHaveCount(1);
}

export async function expectNoModeSwitcher(page: Page): Promise<void> {
  const text = await page.locator("body").innerText();
  expect(text).not.toContain("Web\nApp\nWeb app");
}

export async function expectPhoneNavClear(page: Page): Promise<void> {
  const metrics = await page.evaluate(() => {
    const composer = document.querySelector(".chat-composer");
    const bottomNav = document.querySelector(".bottom-nav");
    const rect = (element: Element | null) => {
      if (!element) return null;
      const box = element.getBoundingClientRect();
      return { top: box.top, bottom: box.bottom, height: box.height };
    };

    return {
      composer: rect(composer),
      bottomNav: rect(bottomNav)
    };
  });

  expect(metrics.bottomNav).not.toBeNull();
  if (metrics.composer && metrics.bottomNav) {
    expect(metrics.composer.bottom).toBeLessThanOrEqual(metrics.bottomNav.top);
  }
}

export async function expectChatCanScroll(page: Page): Promise<void> {
  const metrics = await page.evaluate(() => {
    const chat = document.querySelector(".chat-list");
    if (!chat) return null;
    return {
      clientHeight: chat.clientHeight,
      scrollHeight: chat.scrollHeight,
      scrollTop: chat.scrollTop,
      overflowY: getComputedStyle(chat).overflowY
    };
  });

  expect(metrics).not.toBeNull();
  expect(metrics?.scrollHeight).toBeGreaterThan(metrics?.clientHeight || 0);
  expect(["auto", "scroll"]).toContain(metrics?.overflowY);
}
