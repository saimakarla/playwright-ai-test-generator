const { test, expect } = require('@playwright/test');

test('Registered customer logs in with email and password to access their dashboard', async ({ page }) => {
  // Open the login page
  await page.goto('https://rahulshettyacademy.com/client');

  // Type the email "test_user@example.com" into the email field
  await page.fill('#userEmail', 'test_user@example.com');

  // Type the password "Pass1234!" into the password field
  await page.fill('#userPassword', 'Pass1234!');

  // Click the Login button
  await page.click('input[value="Login"]');

  // Assert that the URL changes to include /dashboard
  await expect(page).toHaveURL(/.*\/dashboard/);

  // Assert that the page heading "Products" is visible
  await expect(page.locator('h1')).toHaveText('Products');
});