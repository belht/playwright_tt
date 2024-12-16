import { test, expect } from '@playwright/test';
import { allure, LabelName } from "allure-playwright";
import { BasketPage } from '@lk_pages/basket';
import { LoginPage } from '@lk_pages/login';
import { GenealogicalTreePage } from '@lk_pages/genealogical-tree';
import * as url from "node:url";

test.describe.configure({ mode: 'parallel', retries: 1});

let page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
});

test.afterEach(async ({}, testInfo) => {
  // Runs after each test and save url on failure.
  if (testInfo.status == 'failed' || testInfo.status == 'passed') {
    const page_url = page.url();
    let page_path = page_url.replace('https://basket.genotek.ru', '');
    page_path = page_path.replace(/\?.*/, '');
    allure.link({ url: page_path, name: "execution_point" });
  }
});

test.afterAll(async () => {
  await page.close();
});

test(`Checking the application of a promo code for a product`, async () => { // Изменено название теста

  test.info().annotations.push({
    type: 'As a',
    description: 'Non-authorized client'
  }, {
    type: 'I want',
    description: `to apply the promo code to the product in the cart and verify the total price`
  }, {
    type: 'So that',
    description: 'I can ensure that the discount is applied correctly and the total price is changed'
  });

  const basketPage = new BasketPage(page);

  await basketPage.goto();

  const originalPrice = await basketPage.getTotalPrice();
  expect(originalPrice).toBeGreaterThan(0);

  const promoCode = 'genotek5';
  await basketPage.applyPromoCode(promoCode);

  const discountedPrice = await basketPage.getDiscountedPrice();
  expect(discountedPrice).toBeLessThan(originalPrice);
});


