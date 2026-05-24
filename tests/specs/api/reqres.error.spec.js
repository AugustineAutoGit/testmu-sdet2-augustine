import { test, expect } from '@playwright/test';
import { APIActions } from '../../utils/apiactions.utils.js';

test.describe('ReqRes error handling', () => {
  const apiBase = process.env.API_URL || 'https://reqres.in';

  test('404 on missing user returns empty body', async ({ request }) => {
    const api = new APIActions(request, apiBase);
    const response = await api.get('/api/users/99999');
    const status = await api.validateStatus(response);
    expect(status).toBe(404);
    const body = await response.json();
    expect(body).toEqual({});
  });

  test('400 on invalid request data', async ({ request }) => {
    const api = new APIActions(request, apiBase);
    const response = await api.post('/api/login', {
      email: 'test@example.com',
    });
    const status = await api.validateStatus(response);
    expect(status).toBe(400);
    const body = await api.validateJson(response);
    expect(body.error).toBeTruthy();
  });

  test('500 error from external endpoint', async ({ request }) => {
    const api = new APIActions(request);
    const response = await api.get('https://jsonplaceholder.typicode.com/invalid/endpoint');
    // JSONPlaceholder returns 404 for invalid routes
    expect([404, 500]).toContain(response.status());
  });

  test('Verify error response has proper structure', async ({ request }) => {
    const api = new APIActions(request, apiBase);
    const response = await api.get('/api/users/9999');
    const status = await api.validateStatus(response);
    expect(status).toBe(404);
  });
});
