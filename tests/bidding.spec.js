import { test, expect } from "@playwright/test";

test.describe("Bidding System", () => {
  test.beforeEach(async ({ page }) => {
    const timestamp = Date.now().toString().slice(-8);
    const name = `test${timestamp}`;
    const email = `${name}@stud.noroff.no`;
    const password = "password123";

    await page.goto("/pages/register.html");
    await page.fill("#register-name", name);
    await page.fill("#register-email", email);
    await page.fill("#register-password", password);
    await page.fill("#register-password-confirm", password);
    await page.click('button[type="submit"]');

    await page.waitForTimeout(2000);

    await page.goto("/pages/login.html");
    await page.fill("#login-email", email);
    await page.fill("#login-password", password);
    await page.click('button[type="submit"]');

    await page.waitForTimeout(2000);
  });

  test("A registered user may add a Bid to another user's Listing", async ({
    page,
  }) => {
    await page.goto("/pages/all-listings.html");

    await page.waitForTimeout(2000);

    const firstListing = page.locator('[id^="listing-"]').first();
    if (await firstListing.count() > 0) {
      await firstListing.click();

      await page.waitForTimeout(2000);

      const bidInput = page.locator("#bid-input");
      const topBidElement = page.locator("#listing-top-bid");

      if (await topBidElement.isVisible()) {
        const topBidText = await topBidElement.textContent();
        const numbers = topBidText.match(/\d+/);
        let topBid = 0;
        if (numbers && numbers[0]) {
          topBid = parseInt(numbers[0]);
        }
        const newBid = topBid + 10;

        if (await bidInput.isVisible()) {
          await bidInput.fill(newBid.toString());
          await page.click("#bid-submit");

          await page.waitForTimeout(2000);

          await expect(page.locator("#listing-top-bid")).toContainText(
            newBid.toString()
          );
        }
      }
    }
  });

  test("A registered user may view Bids made on a Listing", async ({
    page,
  }) => {
    await page.goto("/pages/all-listings.html");

    await page.waitForTimeout(2000);

    const firstListing = page.locator('[id^="listing-"]').first();
    if (await firstListing.count() > 0) {
      await firstListing.click();

      await page.waitForTimeout(2000);

      const bidCount = page.locator("#listing-bid-count");
      await expect(bidCount).toBeVisible();

      const bidCountText = await bidCount.textContent();
      expect(bidCountText).toMatch(/\d+/);
    }
  });
});

