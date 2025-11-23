import { test, expect } from "@playwright/test";

test.describe("Search Listings", () => {
  test("An unregistered user may search through Listings", async ({
    page,
  }) => {
    await page.goto("/pages/all-listings.html");

    await page.waitForTimeout(2000);

    const searchInput = page.locator("#search-input");
    await expect(searchInput).toBeVisible();

    await searchInput.fill("test");

    await page.waitForTimeout(1000);

    const listingsContainer = page.locator("#listingsContainer");
    await expect(listingsContainer).toBeVisible();
  });

  test("Unregistered user sees login link instead of logout", async ({
    page,
  }) => {
    await page.goto("/pages/all-listings.html");

    const loginLink = page.locator("#login-link-desktop");
    await expect(loginLink).toBeVisible();

    const logoutButton = page.locator("#logout-btn-desktop");
    await expect(logoutButton).not.toBeVisible();
  });
});

