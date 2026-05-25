import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('https://qaplayground.com/bank');

    await page.getByPlaceholder('Enter your username').fill('admin');
    await page.locator('#password').fill('admin123');
    await page.getByTestId('login-button').click();

});


test('Skeleton loading state appears on page load then data renders', async ({page}) =>{
    await expect(page.locator('#dashboard-page-container')).toHaveAttribute('data-loading', 'false')

    const balance_card = page.locator('#total-balance-card')
    await expect (balance_card).toBeVisible()

    const active_accounts = page.locator('#accounts-count-card-header')
    await expect (active_accounts).toHaveText(/Active Accounts/)

});

function moneyToNumber(text: string): number {
    // Remove the "$" and the commas, then convert to a number
  const cleaned = text.replace('$', '').replace(/,/g, '');
  return Number(cleaned);
}

test('Total balance is equal to savings plus current account balance', async ({page}) =>{
    await page.goto('https://qaplayground.com/bank/dashboard');

      //Find the "$7,500.00" text on the page
    const totalBalanceCheck = await page.locator('#total-balance').innerText()
    const totalBalance = moneyToNumber(totalBalanceCheck)

    console.log(totalBalance)

      // Read each account balance from accounts page
    await page.goto('https://qaplayground.com/bank/accounts')

    const checkingBalanceCheck = await page.getByTestId('account-balance').first().innerText()
    console.log(checkingBalanceCheck)
    const SavingsBalanceCheck = await page.getByTestId('account-balance').nth(1).innerText()
    console.log(SavingsBalanceCheck)
      //convert them into number using moneytoNumber function
    const checkingBalance = moneyToNumber(checkingBalanceCheck)
    const savingBalanace = moneyToNumber(SavingsBalanceCheck)

    await expect (checkingBalance + savingBalanace).toBe(totalBalance);
// Claude 
// const balances = page.getByTestId('account-balance');
// const count = await balances.count();
// for (let i = 0; i < count; i++) {
//     const text = await balances.nth(i).innerText();
//     // ... assert on text
// }

// // Or get all texts at once
// const texts = await page.getByTestId('account-balance').allInnerTexts();

});



