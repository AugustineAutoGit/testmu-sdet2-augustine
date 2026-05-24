import { UIActions } from '../utils/uiactions.utils';

export class SignupPage {
  /**
     * @param {import('@playwright/test').Page} page
     */

  constructor (page) {
    this.page = page;
    this.ui = new UIActions(page);
    this.dobField = page.locator('#dob');
    this.firstNameField = page.locator('[id=first-name]');
    this.lastNameField = page.locator('[id=last-name]');
    this.emailField = page.locator('#email');
    this.passwordField = page.locator('#password');
    this.continueButton = page.locator('#continue').or(page.getByText('Continue', { exact: true }));
  }

  async getSignupPageURL () {
    const signupPageURL = await this.ui.getCurrentURL();
    return signupPageURL;
  }

  async enterDOB (dob) {
    await this.ui.click(this.dobField);
    await this.ui.type(this.dobField, dob);
  }

  async enterFirstName (firstName) {
    await this.ui.clearAndFill(this.firstNameField, firstName);
  }

  async enterLastName (lastName) {
    await this.ui.clearAndFill(this.lastNameField, lastName);
  }

  async enterEmail (email) {
    await this.ui.clearAndFill(this.emailField, email);
  }

  async enterPassword (password) {
    await this.ui.clearAndFill(this.passwordField, password);
  }

  async clickContinueButton () {
    await this.ui.click(this.continueButton);
  }

}
