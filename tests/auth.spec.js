import { test, expect } from "@playwright/test";

test.describe("User Authentication", () => {
  test("A registered user may login", async ({ page }) => {
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

    const logoutButton = page.locator("#logout-btn-desktop");
    await expect(logoutButton).toBeVisible();
  });

  test("A registered user may logout", async ({ page }) => {
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

    const logoutButton = page.locator("#logout-btn-desktop");
    await expect(logoutButton).toBeVisible();

    await logoutButton.click();

    await page.waitForTimeout(1000);

    const loginLink = page.locator("#login-link-desktop");
    await expect(loginLink).toBeVisible();
  });
});
