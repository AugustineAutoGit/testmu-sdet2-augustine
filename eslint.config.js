import js from '@eslint/js';
import playtwright from 'eslint-plugin-playwright';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2024,
      },
    },
    plugins: {
      playwright: playtwright,
    },
    rules: {
      // Code quality rules
      'no-unused-vars': 'error',
      'no-console': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': 'error',
      'curly': ['error', 'all'],
      'no-throw-literal': 'error',
      'prefer-template': 'error',
      'no-duplicate-imports': 'error',
      // Formatting rules
      'indent': ['error', 2],
      'linebreak-style': ['error', 'unix'],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'space-before-function-paren': 'error',
      'keyword-spacing': 'error',
      'space-infix-ops': 'error',
      'eol-last': ['error', 'always'],
      'no-trailing-spaces': 'error',
      // Playwright specific rules
      ...playtwright.configs.recommended.rules,
    },
  },
  {
    files: ['tests/**/*.spec.js', 'tests/**/*.page.js', 'tests/**/*.fixture.js', 'tests/**/*.utils.js'],
    rules: {
      'playwright/no-force-option': 'off',
      'playwright/no-unused-locators': 'off',
    },
  },
  {
    ignores: ['node_modules/', 'test-results'],
  },
];
