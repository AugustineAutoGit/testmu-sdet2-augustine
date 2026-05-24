import { test as launch } from '../fixtures/landing.fixture';
import { LoginPage } from '../pages/login.page';

export const test = launch.extend({
  // @ts-ignore
  login: async ({ launchApp }, use) => {
    await launchApp.landingPage.clickUserIcon();
    await launchApp.landingPage.clickLoginButton();
    const loginPage = new LoginPage(launchApp.page);
    await loginPage.login(process.env.USERNAME, process.env.PASSWORD);
    await use(loginPage);
  },
});
