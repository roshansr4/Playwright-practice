import {test, expect} from '@playwright/test'

test('Successful login with admin credentials', async ({ page }) => {
    await page.goto('https://qaplayground.com/bank');

    const input_username = page.getByPlaceholder('Enter your username');
    await input_username.fill('admin')

    const input_password = page.locator('#password')
    await input_password.fill('admin123')

    const click_btn = page.getByTestId('login-button')
    await click_btn.click()

    await expect (page.locator('#nav-dashboard')).toHaveText(/Dashboard/)
});

test('Failed login shows error alert for invalid credentials', async ({ page}) => {
     await page.goto('https://qaplayground.com/bank');

    const input_username = page.getByPlaceholder('Enter your username');
    await input_username.fill('admin')

    const input_password = page.locator('#password')
    await input_password.fill('admin12')

    const click_btn = page.getByTestId('login-button')
    await click_btn.click()

    await expect(page.getByText(/Invalid username or password/)).toBeVisible()
});

test('Toggle password visibility hides and reveals password text', async ({ page}) => {
    await page.goto('https://qaplayground.com/bank');

    const input_username = page.getByPlaceholder('Enter your username');
    await input_username.fill('admin')

    const input_password = page.locator('#password')
    await input_password.fill('admin123')

    await expect (input_password).toHaveAttribute('type', 'password')

    const password_toggle = page.getByTestId('toggle-password-btn')
    await password_toggle.click()

    await expect (input_password).toHaveAttribute('type', 'text')

});

