import { test, expect } from "@playwright/test";

test.describe("User Registration", () => {
  test("A user with a stud.noroff.no email may register", async ({ page }) => {
    await page.goto("/pages/register.html");

    const timestamp = Date.now().toString().slice(-8);
    const name = `test${timestamp}`;
    const email = `${name}@stud.noroff.no`;
    const password = "password123";

    await page.fill("#register-name", name);
    await page.fill("#register-email", email);
    await page.fill("#register-password", password);
    await page.fill("#register-password-confirm", password);

    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*login\.html/);
  });

  test("Registration fails with non-stud.noroff.no email", async ({ page }) => {
    await page.goto("/pages/register.html");

    const timestamp = Date.now().toString().slice(-8);
    const name = `test${timestamp}`;
    const email = `${name}@gmail.com`;
    const password = "password123";

    await page.fill("#register-name", name);
    await page.fill("#register-email", email);
    await page.fill("#register-password", password);
    await page.fill("#register-password-confirm", password);

    await page.click('button[type="submit"]');

    const errorMessage = page.locator("#register-error-message");
    await expect(errorMessage).toBeVisible();
  });
});
