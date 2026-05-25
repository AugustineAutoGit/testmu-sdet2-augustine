import { test, expect } from '@playwright/test';
import { APIActions } from '../../utils/apiactions.utils.js';
import { errorMessages } from '../../data/error-messages.data.js';
import { invalidAPIUserDetails, validAPIUserDetails } from '../../data/user-details.data.js';

test.describe('ReqRes Authentication flows', () => {
  const apiBase = process.env.API_URL;

  test('Successful login with valid credentials', async ({ request }) => {
    // @ts-ignore
    const api = new APIActions(request, apiBase);
    const response = await api.post('/api/login', {
      email: validAPIUserDetails.email,
      password: validAPIUserDetails.password,
    });
    const status = await api.getStatus(response);
    expect(status).toBe(200);
    const body = await api.getJson(response);
    expect(body.token).toBeTruthy();
    expect(body.token).toMatch(/^\w+$/);
  });

  test('Failed login with missing password returns 400', async ({ request }) => {
    // @ts-ignore
    const api = new APIActions(request, apiBase);
    const response = await api.post('/api/login', {
      email: validAPIUserDetails.email,
    });
    const status = await api.getStatus(response);
    expect(status).toBe(400);
    const body = await api.getJson(response);
    expect(body.error).toBe(errorMessages.apiMissingPasswordError);
  });

  test('Failed login with invalid email returns 400', async ({ request }) => {
    // @ts-ignore
    const api = new APIActions(request, apiBase);
    const response = await api.post('/api/login', {
      email: invalidAPIUserDetails.email,
      password: invalidAPIUserDetails.password,
    });
    const status = await api.getStatus(response);
    expect(status).toBe(400);
    const body = await api.getJson(response);
    expect(body.error).toBeTruthy();
  });

  test('Successful registration with valid credentials', async ({ request }) => {
    // @ts-ignore
    const api = new APIActions(request, apiBase);
    const response = await api.post('/api/register', {
      email: validAPIUserDetails.email,
      password: validAPIUserDetails.password,
    });
    const status = await api.getStatus(response);
    expect(status).toBe(200);
    const body = await api.getJson(response);
    expect(body.id).toBeTruthy();
    expect(body.token).toBeTruthy();
  });

  test('Failed registration with missing password returns 400', async ({ request }) => {
    // @ts-ignore
    const api = new APIActions(request, apiBase);
    const response = await api.post('/api/register', {
      email: validAPIUserDetails.email,
    });
    const status = await api.getStatus(response);
    expect(status).toBe(400);
    const body = await api.getJson(response);
    expect(body.error).toBe(errorMessages.apiMissingPasswordError);
  });
});
