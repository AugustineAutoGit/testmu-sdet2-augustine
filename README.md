# ** 🎭 Playwright JavaScript Automation**

This repository contains Playwright end-to-end tests for the application. The goal of this README is to let another engineer pick up the project and extend it without needing additional handoff.

**Contents**
- **Overview:** What this project tests and its high-level architecture
- **Quick Start:** Setup and first run commands
- **How to Run:** Common commands, filtering tests, headed/headless, and debugging
- **Repository Layout:** Where to find pages, tests, fixtures, utils, and config
- **Design Decisions:** Patterns and trade-offs used
- **CI Example:** GitHub Actions snippet to run tests in CI
- **Troubleshooting & Debugging:** Common issues and how to investigate
- **Next Steps:** What I'd build next with more time

**Overview**

This test suite is built with Playwright (JavaScript). Tests exercise the application through the browser UI and/or through API. Key goals:
- Reliable, readable tests using a Page Object Model (POM)
- Fast local developer feedback loop
- CI-friendly runners with artifacts (screenshots, traces, videos)

High-level architecture:
- `tests/` – top-level entry point and grouped specs.
- `tests/specs/` – test folder that contains the real tests to be executed.
- `tests/pages/` – Page Object Model classes exposing actions/elements.
- `tests/fixtures/` – application based custom fixtures.
- `tests/config/` – environment config details to handel multiple environments.
- `tests/data/` – test data files.
- `utils/` – helpers and reusable utilities (API helpers, selectors, waits).
- `playwright.config.js` – Playwright configuration for timeouts, projects, reporters, and global fixtures.

**Quick Start (developer)**

1. Clone the repo and install dependencies:

```bash
git clone <repo-url>
cd <repo-root>
npm install
```

2. Install browsers used by Playwright:

```bash
npx playwright install
```

3. Run the full test suite (headless):

```bash
npx playwright test
```

4. Run a single test file:

```bash
npx playwright test tests/example.spec.js
```

**How to Run (details & useful options)**

- Run with a headed browser (useful for debugging):

```bash
npx playwright test --headed
```

- Run with trace, video and screenshots (configure in `playwright.config.js` or pass flags):

```bash
npx playwright test --trace on --workers=1
```

- Run a single test or a test by title:

```bash
npx playwright test -g "sample test name"
```

- Debug mode (opens Playwright Inspector):

```bash
npx playwright test --debug
```

- Show Allure report after test run:

```bash
npx allure serve test-results
```

**Repository Layout**

- `package.json` — npm scripts for common commands (run, test, lint, format).
- `playwright.config.js` — configuration for timeouts, retries, projects (chrome/firefox/webkit), and reporters.
- `tests/` — test files (e.g., `example.spec.js`).
- `pages/` — Page Object Model classes, e.g., `LoginPage.js`, `DashboardPage.js`.
- `fixtures/` — test fixtures (test data, custom fixtures used by Playwright test.extend).
- `utils/` — helpers: API clients, data generators, selectors, common waits.
- `config/` — environment configuration (base URLs, credentials used only for local/dev with secrets handled outside the repo).

Example mapping (in this repo):

- Tests: `tests/` and `specs/`
- Page objects: `pages/`
- Test utilities: `utils/`

**Design Decisions**

- Page Object Model (POM):
  - Rationale: isolates selectors and page actions from tests, increases readability and reusability.
  - Implementation: each class exposes high-level methods like `login(email, password)` and returns page-level results.

- Fixtures & Test Data:
  - Use Playwright fixtures (`test.extend`) to provide reusable setup/teardown (signed-in state, API tokens).
  - Keep sensitive credentials out of the repository — use environment variables or a secrets manager in CI.

- Test Organization:
  - Use `describe` to group related flows and `beforeEach` in the test files only for lightweight setup.
  - A `describe` can contain 1 more `test` methods

- Timeouts & Retries:
  - Conservative timeouts in `playwright.config.js` to reduce flakiness.
  - Retries are enabled in CI only (e.g., `retries: 2`) to keep local feedback deterministic while allowing CI to recover transient failures.

- Reporting & Artifacts:
  - Allure report with screenshots/traces/videos on failure.

Trade-offs:
- Using POM can add boilerplate but improves maintainability for a growing test suite.
- Tests interact with UI; for faster and more deterministic checks consider adding API/unit tests alongside E2E.

**CI Example (GitHub Actions)**

Below is a minimal workflow snippet; place this in `.github/workflows/playwright.yml`.

```yaml
name: Playwright Tests
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
jobs:
  test:
    name: Run Playwright Tests
    runs-on: ubuntu-latest
    env:
      USERNAME: ${{ secrets.USERNAME }}
      PASSWORD: ${{ secrets.PASSWORD }}

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: lts/*

    - name: Install dependencies
      run: npm ci

    - name: Install Playwright Browsers
      run: npx playwright install --with-deps

    - name: Run Playwright tests
      run: npx playwright test

    - name: Run Allure Action
      uses: allure-framework/allure-report@v0
      with:
        report-directory: "./test-results"
        github-token: ${{ secrets.GITHUB_TOKEN }}

```

**Troubleshooting & Debugging**

- If a selector fails: open the page in headed mode and use Playwright inspector:

```bash
npx playwright test --headed --debug
```

- Capture and inspect trace for a failing test:

```bash
npx playwright test --trace on
npx playwright show-trace trace.zip
```

- If CI flakes: increase retries in CI only and capture artifacts (screenshots + traces) for failure investigation.

- Network/API dependency: prefer stubbing network calls for deterministic behavior when possible using `page.route` or Playwright network mocking.

**Contributing / Adding New Tests**

1. Add page object under `pages/` if interacting with a new page.
2. Add test(s) to `specs/` that import the page object and use fixtures.
3. Run locally, ensure tests pass in headless and headed modes.
4. Follow naming convention: `*.spec.js` and describe behavior in human-readable sentences.

Example test structure:

```js
// tests/login.spec.js
const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');

test('user can log in', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('user@example.com', 'password');
  await expect(page).toHaveURL('/dashboard');
});
```

**What I'd build next (with more time)**

- Visual regression testing (Percy or Playwright snapshot comparison) for UIs that must not regress.
- Parallelized CI matrix across browsers and screen sizes, optimized via test-groups to reduce total runtime.
- Test flakiness dashboard and automated quarantine for repeatedly failing tests.
- Test data management: dedicated test user provisioning API or fixtures that provision and clean up test data.
- Component-level tests (Playwright for component/visual testing) and contract tests for APIs.
- Add TypeScript for stronger typing in Page Objects and tests.

**Secrets & Environment**

- Never commit secrets or passwords. Use environment variables locally (e.g., `.env` handled in `.gitignore`) and a secure secrets store in CI.
- Example env vars used by tests:
  - `BASE_URL` — application base URL
  - `TEST_USER_EMAIL`, `TEST_USER_PASSWORD` — (only for local/dev with throwaway accounts)

**Useful npm scripts** (add to `package.json` if missing):

```json
"scripts": {
  "test": "npx playwright test",
  "test:headed": "npx playwright test --headed",
  "test:report": "npx playwright show-report",
  "test:trace": "npx playwright test --trace on"
}
```

**Contact**

If something is unclear or you need access to secrets for CI, open a ticket in the team board and assign to me; include the failing test and relevant artifacts (trace, screenshots) and I will prioritize follow-up.

-- End of README --