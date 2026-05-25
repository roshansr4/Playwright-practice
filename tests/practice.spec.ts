import { test, expect } from '@playwright/test';

test (' has title ', async ({ page }) => {
    await page.goto('https://bookmundi.com/');

    await expect(page).toHaveTitle( /Bookmundi/)
});

test ('search result', async ({ page }) => {
    await page.goto('https://bookmundi.com/');

    await page.getByPlaceholder('Where would you like to go?').fill('Nepal');

    //await page.locator('span').filter({ hasText: 'Search' })
    await page.getByRole('button', {name: 'Search'}).first().click();

    //await expect(page.getByText(/Search results for/)).toBeVisible();
    await expect(page.getByRole('heading', {name:'Search results for'})).toBeVisible();
});

test ('open everest base camp trek-7884', async ({ page, context }) => {
    await page.goto('https://bookmundi.com/');

    await page.getByPlaceholder('Where would you like to go?').fill('Nepal');

    //await page.locator('span').filter({ hasText: 'Search' })
    await page.getByRole('button', {name: 'Search'}).first().click();

    const pagePromise = context.waitForEvent('page'); //Because the product page opens in a new tab
    await page.locator('a[href$="/trip/everest-base-camp-trek-7884"]').first().click();
    const newPage = await pagePromise;

    await expect(newPage).toHaveTitle(/Everest Base Camp Trek/);
});

test('Go to checkout page', async ({ page, context }) => {
  await page.goto('https://bookmundi.com/');

  await page.getByPlaceholder('Where would you like to go?').fill('Nepal');
  await page.getByRole('button', { name: 'Search' }).first().click();

  // Start waiting for the new tab BEFORE the click that opens it
  const pagePromise = context.waitForEvent('page');
  await page.locator('a[href$="/trip/everest-base-camp-trek-7884"]').first().click();
  const productPage = await pagePromise;

  const checkAvailabilityBtn = productPage.getByRole('button', { name: 'Check Availability' });
  await checkAvailabilityBtn.scrollIntoViewIfNeeded(); //Because chromium is throwing timeout error, we first make sure the element is visible
  await checkAvailabilityBtn.click();

  await productPage.locator('.text-body-base-bold.transition-colors').first().click()
  await productPage.locator('#book-now-action-button').first().click()

  await expect(productPage).toHaveURL(/checkout/);
});



