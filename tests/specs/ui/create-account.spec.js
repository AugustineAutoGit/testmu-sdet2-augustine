import { test } from '../../fixtures/landing.fixture';
import { expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { errorMessages } from '../../data/error-messages.data';
import { CommonPage } from '../../pages/common.page';
import { invalidDetails } from '../../data/invalid-details.data';
import { validUserDetails } from '../../data/user-details.data';

test.describe('Create Account Tests', () => {
  let registerPage;
  let signupPage;
  let commonPage;
  let errorMessage;

  // @ts-ignore
  test.beforeEach(async ({ launchApp }) => {
    await launchApp.landingPage.clickUserIcon();
    registerPage = await launchApp.landingPage.clickCreateAccountButton();
    signupPage = await registerPage.clickRegisterWithEmailButton();
    commonPage = new CommonPage(signupPage.page);
  });

  test('Validate Date of Birth field', async () => {

    await test.step('Empty DOB field', async () => {
      await signupPage.clickContinueButton();
      errorMessage = await commonPage.getErrorMessage();
      await allure.step('Verify empty DOB field error message is displayed', async () => {
        expect(errorMessage).toEqual(errorMessages.emptyDOBError);
      });
    });

    await test.step('Invalid DOB', async () => {
      await signupPage.enterDOB(invalidDetails.invalidDOB);
      await signupPage.clickContinueButton();
      errorMessage = await commonPage.getErrorMessage();
      await allure.step('Verify invalid DOB error message is displayed', async () => {
        expect(errorMessage).toEqual(errorMessages.emptyDOBError);
      });
    });

    await test.step('Fututre DOB', async () => {
      await signupPage.enterDOB(invalidDetails.futureDOB);
      await signupPage.clickContinueButton();
      errorMessage = await commonPage.getErrorMessage();
      await allure.step('Verify invalid DOB error message is displayed', async () => {
        expect(errorMessage).toEqual(errorMessages.futureDOBError);
      });
    });
  });

  test('Validate User Details Form fields', async () => {
    await signupPage.enterDOB(validUserDetails.dob);
    await signupPage.clickContinueButton();

    await test.step('All fields empty', async () => {
      await signupPage.clickContinueButton();
      await allure.step('Verify empty First Name field error message is displayed', async () => {
        errorMessage = await commonPage.getErrorMessage('firstName');
        expect(errorMessage).toEqual(errorMessages.emptyFirstNameError);
      });
      await allure.step('Verify empty Last Name field error message is displayed', async () => {
        errorMessage = await commonPage.getErrorMessage('lastName');
        expect(errorMessage).toEqual(errorMessages.emptyLastNameError);
      });
      await allure.step('Verify empty Email field error message is displayed', async () => {
        errorMessage = await commonPage.getErrorMessage('email');
        expect(errorMessage).toEqual(errorMessages.emptyEmailError);
      });
      await allure.step('Verify empty Password field error message is displayed', async () => {
        errorMessage = await commonPage.getErrorMessage('password');
        expect(errorMessage).toEqual(errorMessages.passwordError);
      });
    });

    await test.step('Invalid First and Last Names', async () => {
      await signupPage.enterFirstName(invalidDetails.invalidName);
      await signupPage.enterLastName(invalidDetails.invalidName);
      await signupPage.clickContinueButton();
      await allure.step('Verify invalid First Name and Last Name fields error messages are displayed', async () => {
        errorMessage = await commonPage.getErrorMessage('firstName');
        expect(errorMessage).toEqual(errorMessages.invalidFirstNameError);
        errorMessage = await commonPage.getErrorMessage('lastName');
        expect(errorMessage).toEqual(errorMessages.invalidLastNameError);
      });
    });

    await test.step('Invalid Email', async () => {
      await signupPage.enterEmail(invalidDetails.invalidName);
      await signupPage.clickContinueButton();
      await allure.step('Verify invalid Email error messages are displayed', async () => {
        errorMessage = await commonPage.getErrorMessage('email');
        expect(errorMessage).toEqual(errorMessages.invalidEmailError);
      });
    });

    await test.step('Invalid Password', async () => {
      await signupPage.enterPassword(invalidDetails.invalidName);
      await signupPage.clickContinueButton();
      await allure.step('Verify invalid Password error messages are displayed', async () => {
        errorMessage = await commonPage.getErrorMessage('password');
        expect(errorMessage).toEqual(errorMessages.passwordError);
      });
    });
  });

});
