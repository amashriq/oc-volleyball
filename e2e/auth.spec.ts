import { test, expect } from "@playwright/test";

test.describe("Auth guard (proxy.ts)", () => {
  test("redirects unauthenticated user from /admin to /admin/login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("redirects unauthenticated user from /admin/events/new to /admin/login", async ({ page }) => {
    await page.goto("/admin/events/new");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("login page is publicly accessible", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
