// login.ts
import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly getEmailInput: Locator;
  readonly getPasswordInput: Locator;
  readonly getSubmitButton: Locator;
  
  constructor(page: Page) {
    this.page = page;
    this.getEmailInput = page.getByPlaceholder('Email or username');
    this.getPasswordInput = page.getByPlaceholder('Password');
    this.getSubmitButton = page.getByRole('button', { name: 'Log in' });
  }
  
  async goto() {
    await this.page.goto('https://dev-lk.genotek.ru/login');
  }
  
  async toLogin() {
    await this.getSubmitButton.click();
	  await this.page.waitForURL(/.*dashboard/);
  }
}
module.exports = { LoginPage };