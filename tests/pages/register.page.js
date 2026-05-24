import { UIActions } from '../utils/uiactions.utils';
import { SignupPage } from './signup.page';

export class RegisterPage {
  /**
     * @param {import('@playwright/test').Page} page
     */

  constructor (page) {
    this.page = page;
    this.ui = new UIActions(page);
    this.registerWithEmailButton = page.getByText('Register with email', { exact: true });
  }

  async getRegisterPageURL () {
    const registerPageURL = this.ui.getCurrentURL();
    return registerPageURL;
  }

  async clickRegisterWithEmailButton () {
    await this.ui.click(this.registerWithEmailButton);
    const signupPage = new SignupPage(this.page);
    return signupPage;
  }

}
