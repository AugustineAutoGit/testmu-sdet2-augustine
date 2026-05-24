import { UIActions } from '../utils/uiactions.utils';
import { RegisterPage } from './register.page';

export class LandingPage {
  /**
     * @param {import('@playwright/test').Page} page
     */

  constructor (page) {
    this.page = page;
    this.ui = new UIActions(page);
    this.rejectCookiesButton = page.locator('[id=onetrust-reject-all-handler]');
    this.userIcon = page.getByTitle('Display user account').last();
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.createAccountButton = page.getByRole('button', { name: 'Create Account' });
  }

  async launchApp () {
    await this.ui.launch(process.env.APP_URL);
    await this.ui.locatorHandler(this.rejectCookiesButton, this.ui.click);
  }

  async clickUserIcon () {
    await this.ui.click(this.userIcon);
  }

  async clickLoginButton () {
    await this.ui.click(this.loginButton);
  }

  async clickCreateAccountButton () {
    await this.ui.click(this.createAccountButton);
    const registerPage = new RegisterPage(this.page);
    return registerPage;
  }
}
