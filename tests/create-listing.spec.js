import { test, expect } from "@playwright/test";

test.describe("Create Listing", () => {
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

  test("A registered user may create a Listing with title, deadline date, media gallery and description", async ({
    page,
  }) => {
    await page.goto("/pages/create-a-listing.html");

    const title = `Test Listing ${Date.now()}`;
    const description = "This is a test listing description";
    const imageUrl = "https://picsum.photos/id/1/800/600";
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 7);
    const deadlineString = deadline.toISOString().split("T")[0];

    await page.fill("#item-name", title);
    await page.fill("#item-description", description);
    await page.fill("#item-picture", imageUrl);
    await page.fill("#listing-deadline", deadlineString);

    await page.click('button[type="submit"]');

    await page.waitForURL(/.*current-listing\.html/, { timeout: 10000 });
  });
});
