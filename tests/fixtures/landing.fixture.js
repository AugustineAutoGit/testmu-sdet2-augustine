import { test as base } from '@playwright/test';
import { LandingPage } from '../pages/landing.page';
export const test = base.extend({
  // @ts-ignore
  launchApp: async ({ page }, use) => {
    const landingPage = new LandingPage(page);
    await landingPage.launchApp();
    await use( { page, landingPage } );
  },
});
