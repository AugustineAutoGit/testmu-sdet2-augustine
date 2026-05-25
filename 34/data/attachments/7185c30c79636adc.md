# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api/reqres.error.spec.js >> ReqRes error handling >> Verify error response has proper structure
- Location: tests/specs/api/reqres.error.spec.js:35:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 404
Received: 401
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { APIActions } from '../../utils/apiactions.utils.js';
  3  | import { invalidDetails } from '../../data/invalid-details.data.js';
  4  | 
  5  | test.describe('ReqRes error handling', () => {
  6  |   const apiBase = process.env.API_URL || 'https://reqres.in';
  7  | 
  8  |   test('404 on missing user returns empty body', async ({ request }) => {
  9  |     const api = new APIActions(request, apiBase);
  10 |     const response = await api.get(invalidDetails.nonExistentEndpoint);
  11 |     const status = await api.getStatus(response);
  12 |     expect(status).toBe(404);
  13 |     const body = await response.json();
  14 |     expect(body).toEqual({});
  15 |   });
  16 | 
  17 |   test('400 on invalid request data', async ({ request }) => {
  18 |     const api = new APIActions(request, apiBase);
  19 |     const response = await api.post('/api/login', {
  20 |       email: invalidDetails.nonExistentEmail,
  21 |     });
  22 |     const status = await api.getStatus(response);
  23 |     expect(status).toBe(400);
  24 |     const body = await api.getJson(response);
  25 |     expect(body.error).toBeTruthy();
  26 |   });
  27 | 
  28 |   test('500 error from external endpoint', async ({ request }) => {
  29 |     const api = new APIActions(request);
  30 |     const response = await api.get(invalidDetails.externalInvalidEndpoint);
  31 |     // JSONPlaceholder returns 404 for invalid routes
  32 |     expect([404, 500]).toContain(response.status());
  33 |   });
  34 | 
  35 |   test('Verify error response has proper structure', async ({ request }) => {
  36 |     const api = new APIActions(request, apiBase);
  37 |     const response = await api.get(invalidDetails.nonExistentEndpoint);
  38 |     const status = await api.getStatus(response);
> 39 |     expect(status).toBe(404);
     |                    ^ Error: expect(received).toBe(expected) // Object.is equality
  40 |   });
  41 | });
  42 | 
```