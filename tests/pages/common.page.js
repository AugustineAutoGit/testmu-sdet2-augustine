import { UIActions } from '../utils/uiactions.utils';

export class CommonPage {
  /**
     * @param {import('@playwright/test').Page} page
     */

  constructor (page) {
    this.page = page;
    this.ui = new UIActions(page);
    this.errorMessage = page.locator('p.text-arsenal-red');
    this.fieldSpecificErrorMessage  = (fieldName) => page.locator(`[name=${fieldName}] + p.text-arsenal-red`).or(page.locator(`//*[@name="${fieldName}"]/parent::*/following-sibling::p`));
  }

  async getErrorMessage (fieldName = undefined) {
    if (fieldName) {
      const errorMessage = await this.ui.getText(this.fieldSpecificErrorMessage(fieldName));
      return errorMessage;
    } else {
      const errorMessage = await this.ui.getText(this.errorMessage);
      return errorMessage;
    }
  }

}
