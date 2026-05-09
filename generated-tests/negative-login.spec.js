const { test, expect } = require('@playwright/test');

test('I see an error message when I enter the wrong password', async ({ page }) => {
    // Open the login page
    await page.goto('https://rahulshettyacademy.com/client');
    // Enter a valid-looking email
    await page.fill('[data-test="email"]', 'valid@example.com');
    // Enter the wrong password
    await page.fill('[data-test="password"]', 'wrong-password-123');
    // Click Login
    await page.click('button[value="Login"]');
    // Verify the error message is shown
    const errorMessage = await page.locator('[data-test="error-message"]');
    await expect(errorMessage).toContainText('Incorrect email or password');
});

test('The Login button is disabled when fields are empty', async ({ page }) => {
    // Open the login page
    await page.goto('https://rahulshettyacademy.com/client');
    // Click Login without typing anything
    await page.click('button[value="Login"]');
    // Verify the Login button is disabled
    const loginButton = await page.locator('button[value="Login"]');
    await expect(loginButton).toBeDisabled();
});