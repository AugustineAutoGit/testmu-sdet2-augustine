import { UIActions } from '../utils/uiactions.utils';

export class HomePage {
  /**
     * @param {import('@playwright/test').Page} page
     */

  constructor (page) {
    this.page = page;
    this.ui = new UIActions(page);
    this.userFirstName = page.locator('.header__menus [data-js-sso-name="sso-name"]');
  }

  async getDisplayedUserFirstName () {
    const displayedUserFirstName = this.ui.getText(this.userFirstName);
    return displayedUserFirstName;
  }

}
