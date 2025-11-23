import { test, expect } from "@playwright/test";

test.describe("User Profile", () => {
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

  test("A registered user may update their avatar", async ({ page }) => {
    await page.goto("/pages/profile.html");

    await page.waitForTimeout(1000);

    await page.click("#change-profile-pic-btn");

    await page.waitForTimeout(500);

    const avatarUrl = "https://picsum.photos/id/1/400/400";
    await page.fill("#avatar-url-modal", avatarUrl);
    await page.click("#save-avatar-btn");

    await page.waitForTimeout(3000);

    const avatarImage = page.locator("#avatar-image");
    await expect(avatarImage).toHaveAttribute("src", avatarUrl);
  });

  test("A registered user may view their total credit", async ({ page }) => {
    await page.goto("/pages/profile.html");

    const creditElement = page.locator("#user-credit");
    await expect(creditElement).toBeVisible();

    const creditText = await creditElement.textContent();
    expect(creditText).toMatch(/\d+/);
  });
});

