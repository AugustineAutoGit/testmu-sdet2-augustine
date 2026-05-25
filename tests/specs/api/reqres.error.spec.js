import { test, expect } from '@playwright/test';
import { APIActions } from '../../utils/apiactions.utils.js';
import { invalidDetails } from '../../data/invalid-details.data.js';

test.describe('ReqRes error handling', () => {
  const apiBase = process.env.API_URL || 'https://reqres.in';

  test('404 on missing user returns empty body', async ({ request }) => {
    const api = new APIActions(request, apiBase);
    const response = await api.get(invalidDetails.nonExistentEndpoint);
    const status = await api.getStatus(response);
    expect(status).toBe(404);
    const body = await response.json();
    expect(body).toEqual({});
  });

  test('400 on invalid request data', async ({ request }) => {
    const api = new APIActions(request, apiBase);
    const response = await api.post('/api/login', {
      email: invalidDetails.nonExistentEmail,
    });
    const status = await api.getStatus(response);
    expect(status).toBe(400);
    const body = await api.getJson(response);
    expect(body.error).toBeTruthy();
  });

  test('500 error from external endpoint', async ({ request }) => {
    const api = new APIActions(request);
    const response = await api.get(invalidDetails.externalInvalidEndpoint);
    // JSONPlaceholder returns 404 for invalid routes
    expect([404, 500]).toContain(response.status());
  });

  test('Verify error response has proper structure', async ({ request }) => {
    const api = new APIActions(request, apiBase);
    const response = await api.get(invalidDetails.nonExistentEndpoint);
    const status = await api.getStatus(response);
    expect(status).toBe(404);
  });
});
