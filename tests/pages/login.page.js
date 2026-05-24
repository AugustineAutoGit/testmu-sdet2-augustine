import { UIActions } from '../utils/uiactions.utils';
import { HomePage } from './home.page';

export class LoginPage {
  /**
     * @param {import('@playwright/test').Page} page
     */

  constructor (page) {
    this.page = page;
    this.ui = new UIActions(page);
    this.emailField = page.locator('#email');
    this.passwordField = page.locator('#password');
    this.loginButton = page.getByRole('button', { name: 'Sign In' });
    this.loginErrorMessage = page.locator('p.text-arsenal-red');
  }

  async login (email, password) {
    await this.ui.clearAndFill(this.emailField, email);
    await this.ui.clearAndFill(this.passwordField, password);
    await this.ui.click(this.loginButton);
    return new HomePage(this.page);
  }

  async getLoginErrorMessage () {
    const loginErrorMessage = await this.ui.getText(this.loginErrorMessage);
    return loginErrorMessage;
  }

}
