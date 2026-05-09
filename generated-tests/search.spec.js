const { test, expect } = require('@playwright/test');

test('Logged-in customer can search for ZARA COAT 3 and add it to the cart', async ({ page }) => {
  // Go to the product dashboard
  await page.goto('https://rahulshettyacademy.com/client');

  // Wait for the product cards to be visible
  await page.waitForSelector('.card-body');

  // Find the product whose title in `b` is "ZARA COAT 3" and click its "Add To Cart" button
  const product = await page.locator('text="ZARA COAT 3"');
  await product.first().locator('..').locator('button:has-text("Add To Cart")').click();

  // Click the cart icon
  await page.locator('[routerlink*="cart"]').click();

  // Assert that the cart shows "ZARA COAT 3" as one of the items
  const cartItem = await page.locator('[data-test="cart-item-name"]');
  await expect(cartItem).toContainText('ZARA COAT 3');

  // Assert that a Checkout button is visible
  const checkoutButton = await page.locator('[data-test="checkout-button"]');
  await expect(checkoutButton).toBeVisible();
});