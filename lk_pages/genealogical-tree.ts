// login.ts
import { expect, Locator, Page } from '@playwright/test';

export class GenealogicalTreePage {
  readonly page: Page;
  readonly getGenotekLogo: Locator;
  
  constructor(page: Page) {
    this.page = page;
    this.getGenotekLogo = page.getByRole('img', { name: 'genotek' });
  }
  
  async goto() {
    await this.page.goto('https://dev-lk.genotek.ru/genealogical-tree');
    await this.page.waitForURL(/.*genealogical-tree/);
    await this.page.waitForLoadState('domcontentloaded');
  }
}
module.exports = { GenealogicalTreePage };