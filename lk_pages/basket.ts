// basket.ts
import { expect, Locator, Page } from '@playwright/test';

export class BasketPage {
    readonly page: Page;
    readonly totalPriceLocator: Locator;
    readonly promoCodeInput: Locator;
    readonly applyPromoButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.totalPriceLocator = page.locator('div.basket-order__bill-price .priceroller');
        this.promoCodeInput = page.locator('input.basket-promo-code__input[placeholder="Введите промокод"]');
        this.applyPromoButton = page.locator('.basket-promo-code__label');
    }

    async goto() {
        await this.page.goto('/');
    }

    async getTotalPrice() {
        await this.totalPriceLocator.waitFor({ state: 'visible' });
        const priceText = await this.totalPriceLocator.textContent();
        if (!priceText) {
            throw new Error('Failed to get text of total price');
        }
        return parseFloat(priceText.replace(/[^0-9.-]+/g, ""));
    }

    async applyPromoCode(promoCode: string) {
        await this.applyPromoButton.click();
        await this.promoCodeInput.fill(promoCode);
        await this.promoCodeInput.press('Enter');
    }

    async getDiscountedPrice() {
        const discountedPriceLocator = this.page.locator('div.basket-order__bill-price:not(.basket-order__bill-price--crossed) .priceroller');
        const discountedPriceText = await discountedPriceLocator.textContent();
        if (!discountedPriceText) {
            throw new Error('Failed to get text of discounted price');
        }
        return parseFloat(discountedPriceText.replace(/[^0-9.-]+/g, ""));
    }
}