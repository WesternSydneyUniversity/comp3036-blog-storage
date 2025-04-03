import { expect, test } from "@playwright/test";

test.describe("Blog Storage Exercise", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
  });

  test("Cookies: Invalid login sends message", async ({ page }) => {
    await expect(page.getByText("Cookie Session: Unauthorised")).toBeVisible();

    // invalid password
    await page.getByLabel("Password:").fill("456");
    await page.getByLabel("User").fill("Tomas");
    await page.getByText("Login (Sets Cookie)").click();

    await expect(
      page.getByText("Cookie Session: Invalid username or password")
    ).toBeVisible();
  });

  test("Cookies: Login sets and verifies session then logs out", async ({
    page,
  }) => {
    await expect(page.getByText("Cookie Session: Unauthorised")).toBeVisible();

    await page.getByLabel("User").fill("Tomas");
    await page.getByLabel("Password:").fill("123");
    await page.getByText("Login (Sets Cookie)").click();
    await expect(
      page.getByText("Cookie Session: Admin access granted to Tomas")
    ).toBeVisible();

    // reload
    await page.reload();
    await expect(
      page.getByText("Cookie Session: Admin access granted to Tomas")
    ).toBeVisible();

    // logout
    await page.getByText("Logout (Remove Cookie)").click();
    await expect(page.getByText("Cookie Session: Unauthorised")).toBeVisible();
  });

  test("Cookies: Login and check for invalid cookie", async ({ page }) => {
    await expect(page.getByText("Cookie Session: Unauthorised")).toBeVisible();

    await page.evaluate(() => (document.cookie = "session_id=wrong"));
    await page.reload();
    await expect(
      page.getByText("Cookie Session: Invalid Session")
    ).toBeVisible();
  });

  // JWT

  test("JWT: Invalid password", async ({ page }) => {
    await expect(page.getByText("JWT Session: Unauthorised")).toBeVisible();

    await page.getByLabel("User").fill("Tomas");
    await page.getByLabel("Password:").fill("456");

    await page.getByText("Login (JWT)").click();

    await expect(
      page.getByText("JWT Session: Invalid username or password")
    ).toBeVisible();
  });

  test("JWT: Login sets and verifies session then logs out", async ({
    page,
  }) => {
    await page.getByLabel("User").fill("Tomas");
    await page.getByLabel("Password:").fill("123");

    await expect(page.getByText("JWT Session: Unauthorised")).toBeVisible();
    await page.getByText("Login (JWT)").click();
    await expect(
      page.getByText("JWT Session: Admin access granted to Tomas")
    ).toBeVisible();

    await page.reload();
    await expect(
      page.getByText("JWT Session: Admin access granted to Tomas")
    ).toBeVisible();

    await page.getByText("Logout (JWT)").click();
    await expect(page.getByText("JWT Session: Unauthorised")).toBeVisible();
  });

  test("JWT: Token Security", async ({ page }) => {
    await page.evaluate(() => localStorage.setItem("sessionToken", "xxxxx"));
    await page.reload();
    await expect(page.getByText("JWT Session: Invalid Token")).toBeVisible();
  });

  test("JWT: Login expired session and reissue", async ({ page }) => {
    await expect(page.getByText("JWT Session: Unauthorised")).toBeVisible();

    await page.getByLabel("User").fill("Tomas");
    await page.getByLabel("Password:").fill("123");

    await page.getByText("Login (JWT)").click();
    await expect(
      page.getByText("JWT Session: Admin access granted to Tomas")
    ).toBeVisible();
    const token1 = await page.evaluate(() =>
      localStorage.getItem("sessionToken")
    );
    await page.reload();
    const token2 = await page.evaluate(() =>
      localStorage.getItem("sessionToken")
    );

    // tokens are thesame
    expect(token1).toBe(token2);

    await page.waitForTimeout(3000);
    await page.reload();

    await expect(page.getByText("JWT Session: Token Reissued")).toBeVisible();

    const token3 = await page.evaluate(() =>
      localStorage.getItem("sessionToken")
    );
    // tokens are different
    expect(token1).not.toBe(token3);
  });

  test("Local Storage: Saves and displays prefs", async ({ page }) => {
    await expect(page.getByText("Current: tag:tech")).toBeVisible();
    await page.evaluate(() => localStorage.setItem("prefs", "tag:news"));
    await page.reload();
    await expect(page.getByText("Current: tag:news")).toBeVisible();
  });

  test("Session Storage: Saves and displays draft", async ({ page }) => {
    await expect(page.getByText("Draft: My temp draft...")).toBeVisible();
    await page.evaluate(() => sessionStorage.clear());
    await page.reload();
    await expect(page.getByText("Draft: My temp draft...")).toBeVisible(); // Resets per tab
  });

  test("IndexedDB: Saves and loads drafts", async ({ page }) => {
    const button = await page.getByText("Save Draft");
    await expect(page.locator("li")).toHaveCount(1);
    await button.click();
    await expect(page.locator("li")).toHaveCount(2);
    const drafts = await page.locator("li").allTextContents();
    expect(drafts[0]).toMatch(/New draft \d+/);
  });
});
