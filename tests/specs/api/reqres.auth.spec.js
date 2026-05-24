import { test, expect } from '@playwright/test';
import { APIActions } from '../../utils/apiactions.utils.js';

test.describe('ReqRes Authentication flows', () => {
  const apiBase = process.env.API_URL;

  test('Successful login with valid credentials', async ({ request }) => {
    const api = new APIActions(request, apiBase);
    const response = await api.post('/api/login', {
      email: 'eve.holt@reqres.in',
      password: 'cityslicka',
    });
    const status = await api.validateStatus(response);
    expect(status).toBe(200);
    const body = await api.validateJson(response);
    expect(body.token).toBeTruthy();
    expect(body.token).toMatch(/^\w+$/);
  });

  test('Failed login with missing password returns 400', async ({ request }) => {
    const api = new APIActions(request, apiBase);
    const response = await api.post('/api/login', {
      email: 'eve.holt@reqres.in',
    });
    const status = await api.validateStatus(response);
    expect(status).toBe(400);
    const body = await api.validateJson(response);
    expect(body.error).toBe('Missing password');
  });

  test('Failed login with invalid email returns 400', async ({ request }) => {
    const api = new APIActions(request, apiBase);
    const response = await api.post('/api/login', {
      email: 'invalid@test.com',
      password: 'password123',
    });
    const status = await api.validateStatus(response);
    expect(status).toBe(400);
    const body = await api.validateJson(response);
    expect(body.error).toBeTruthy();
  });

  test('Successful registration with valid credentials', async ({ request }) => {
    const api = new APIActions(request, apiBase);
    const response = await api.post('/api/register', {
      email: 'eve.holt@reqres.in',
      password: 'pistol',
    });
    const status = await api.validateStatus(response);
    expect(status).toBe(200);
    const body = await api.validateJson(response);
    expect(body.id).toBeTruthy();
    expect(body.token).toBeTruthy();
  });

  test('Failed registration with missing password returns 400', async ({ request }) => {
    const api = new APIActions(request, apiBase);
    const response = await api.post('/api/register', {
      email: 'sydney@fife',
    });
    const status = await api.validateStatus(response);
    expect(status).toBe(400);
    const body = await api.validateJson(response);
    expect(body.error).toBe('Missing password');
  });
});
