# Test Strategy

## Current CI Setup

- The current framework CI is implemented using GitHub Actions.
- Test artifacts are published to a public GitHub Pages site.
- Execution is carried out on the `ubuntu-latest` GitHub-hosted runner.

## Identified Risks

1. **Test artifacts need to be published to private pages or a custom domain**
   - Publishing artifacts to public GitHub Pages exposes test results and artifacts publicly.
   - A private pages solution or a custom domain with restricted access should be evaluated.

2. **Execution needs to be done on a private runner or a self-hosted runner**
   - Running tests on `ubuntu-latest` GitHub-hosted runners may not meet security or compliance requirements.
   - Using a private runner or a self-hosted runner can provide better control over the environment and access.

3. **Credentials are kept in .env file for demo purpose**
   - Crednetials needs to be moved to Github secrets

## Recommended Next Steps

- Evaluate options for private GitHub Pages or an authenticated custom domain for artifact publishing.
- Investigate private or self-hosted runners to align CI execution with security requirements.
- Add visual testing coverage by introducing baseline image capture, secure storage, and comparison in the CI pipeline.
