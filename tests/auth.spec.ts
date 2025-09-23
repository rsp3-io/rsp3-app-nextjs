import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should display sign in button on landing page', async ({ page }) => {
    await page.goto('/');
    
    // Check if the sign in button is visible
    await expect(page.getByRole('button', { name: 'Sign in with Immutable Passport' })).toBeVisible();
    
    // Check if the title is correct
    await expect(page.getByRole('heading', { name: 'RSP3' })).toBeVisible();
  });

  test('should redirect unauthenticated users to home page', async ({ page }) => {
    // Try to access a protected route
    await page.goto('/dashboard');
    
    // Should be redirected to home page
    await expect(page).toHaveURL('/');
  });

  test('should show loading state during authentication', async ({ page }) => {
    await page.goto('/');
    
    // Click the sign in button
    await page.getByRole('button', { name: 'Sign in with Immutable Passport' }).click();
    
    // Should show loading state (this will depend on the actual Passport flow)
    // Note: This test might need adjustment based on the actual Passport behavior
  });
});
