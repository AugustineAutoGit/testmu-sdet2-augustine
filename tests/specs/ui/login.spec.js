import { test } from '../../fixtures/landing.fixture';
import { expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { LoginPage } from '../../pages/login.page';
import { userDetails, invalidUserDetails } from '../../data/user-details.data';
import { errorMessages } from '../../data/error-messages.data';

test.describe('Login Tests', () => {
  let loginPage;

  // @ts-ignore
  test.beforeEach(async ({ launchApp }) => {
    await launchApp.landingPage.clickUserIcon();
    await launchApp.landingPage.clickLoginButton();
    loginPage = new LoginPage(launchApp.page);
  });

  test('Login with valid credentials', async () => {
    await test.step('Perform login with valid credentials', async () => {
      const homePage = await loginPage.login(process.env.USERNAME, process.env.PASSWORD);
      const displayedUserFirstName = await homePage.getDisplayedUserFirstName();
      await allure.step('Verify user is successfully logged in', async () => {
        expect(displayedUserFirstName).toBe(userDetails.firstName);
      });
    });
  });

  test('Login with invalid credentials', async () => {
    await test.step('Perform login with invalid credentials', async () => {
      await loginPage.login(invalidUserDetails.username, invalidUserDetails.password);
      const errorMessage = await loginPage.getLoginErrorMessage();
      await allure.step('Verify login error message is displayed', async () => {
        expect(errorMessage).toEqual(errorMessages.loginError);
      });
    });
  });
});
