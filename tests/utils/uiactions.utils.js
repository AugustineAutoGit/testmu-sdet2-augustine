export class UIActions {
  /**
     * @param {import('@playwright/test').Page} page
     * @typedef {import ('@playwright/test').Locator} Locator
     */
  constructor (page) {
    this.page = page;
  }

  // @ts-ignore
  async launch (url) {
    await this.page.goto(url);
  }

  getCurrentURL () {
    const currentURL = this.page.url();
    return currentURL;
  }

  /**
     * Clear the input field and fill the text in the same.
     * @param {Locator} locator
     * @param {string} text
     * @param {object} options
     */
  async clearAndFill (locator, text, options = { timeout: 30000 }) {
    await locator.clear(options);
    await locator.fill(text, options);
  }

  /**
     * Click on the element.
     * @param {Locator} locator
     * @param {object} options
     */
  async click (locator, options = { timeout: 30000 }) {
    try { // 1st attempt: Standard scroll if needed and click
      // @ts-ignore
      await locator.waitFor({ state: options.state || 'visible', timeout: options.timeout });
      // @ts-ignore
      await locator.scrollIntoViewIfNeeded({ timeout: options.timeout });
      await locator.click(options);
    } catch {
      try { // 2nd attempt: Click on the centre of the element using bound box x and y coordinates
        // @ts-ignore
        await locator.waitFor({ state: options.state || 'visible', timeout: options.timeout });
        const boundingBox = await locator.boundingBox();
        await locator.click({
          position: {
            // @ts-ignore
            x: boundingBox.width / 2,
            // @ts-ignore
            y: boundingBox.height / 2,
          },
          ...options,
        });
      } catch {
        try {// 3rd attempt: Scroll using JavaScript and click
          await locator.evaluate((element) => {
            element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
          });
          await locator.click(options);
        } catch {
          try {// 4th attempt: Force click
            await locator.click({ ...options, force: true });
          } catch {
            try {// 5th attempt: Click using JavaScript
              await locator.evaluate((element) => element.click());
            } catch (error) {
              throw new Error('Failed to click on the element after 5 different attempts', { cause: error });
            }
          }
        }
      }
    }

  }
  /**
     * Type text with delay between keystrokes to simulate real user typing.
     * @param {Locator} locator
     * @param {string} text
     * @param {object} options
     */
  async type (locator, text, options = { delay: 100,timeout: 30000 }) {
    // @ts-ignore
    await locator.waitFor({ state: options.state || 'visible', timeout: options.timeout });
    // @ts-ignore
    await locator.pressSequentially(text, { delay: options.delay, timeout: options.timeout });
  }

  /**
   * Check if the element is visible.
   * @param {Locator} locator
   * @returns {Promise<boolean>}
   */
  async isVisible (locator) {
    const isVisible = await locator.isVisible();
    return isVisible;
  }

  /**
   * Get the text content of the element.
   * @param {Locator} locator
   * @param {object} options
   * @returns {Promise<string | null>}
   */
  async getText (locator, options = { timeout: 30000 }) {
    // @ts-ignore
    await locator.waitFor({ state: options.state || 'visible', timeout: options.timeout });
    const text = await locator.textContent(options);
    return text;
  }

  // @ts-ignore
  async locatorHandler (locator, handlemethod) {
    this.page.addLocatorHandler(locator, await handlemethod);
  }
}
