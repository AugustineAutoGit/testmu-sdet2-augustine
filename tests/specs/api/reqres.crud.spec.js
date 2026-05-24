import { test, expect } from '@playwright/test';
import { APIActions } from '../../utils/apiactions.utils.js';

test.describe('ReqRes CRUD operations', () => {
  const apiBase = process.env.API_URL || 'https://reqres.in';

  test('Create a new user and verify response', async ({ request }) => {
    const api = new APIActions(request, apiBase);

    const createResponse = await api.post('/api/users', {
      name: 'morpheus',
      job: 'leader',
    });
    const status = await api.validateStatus(createResponse);
    expect(status).toBe(201);
    const createdBody = await api.validateJson(createResponse);
    expect(createdBody).toMatchObject({ name: 'morpheus', job: 'leader' });
    expect(createdBody.id).toBeTruthy();
    expect(createdBody.createdAt).toBeTruthy();
  });

  test('Update an existing user', async ({ request }) => {
    const api = new APIActions(request, apiBase);
    const updateResponse = await api.put('/api/users/2', {
      name: 'morpheus',
      job: 'zion resident',
    });
    const status = await api.validateStatus(updateResponse);
    expect(status).toBe(200);
    const updatedBody = await api.validateJson(updateResponse);
    expect(updatedBody).toMatchObject({ name: 'morpheus', job: 'zion resident' });
    expect(updatedBody.updatedAt).toBeTruthy();
  });

  test('Patch a user job field', async ({ request }) => {
    const api = new APIActions(request, apiBase);
    const patchResponse = await api.patch('/api/users/3', {
      job: 'rebel leader',
    });
    const status = await api.validateStatus(patchResponse);
    expect(status).toBe(200);
    const patchedBody = await api.validateJson(patchResponse);
    expect(patchedBody.job).toBe('rebel leader');
    expect(patchedBody.updatedAt).toBeTruthy();
  });

  test('Delete a user', async ({ request }) => {
    const api = new APIActions(request, apiBase);
    const deleteResponse = await api.delete('/api/users/2');
    const status = await api.validateStatus(deleteResponse);
    expect(status).toBe(204);
  });

  test('Read user list and verify response time', async ({ request }) => {
    const api = new APIActions(request, apiBase);
    const response = await api.get('/api/users?page=1');
    const status = await api.validateStatus(response);
    expect(status).toBe(200);
    const duration = api.validateResponseTime(response);
    expect(duration).toBeLessThan(2000);
    const body = await api.validateJson(response);
    expect(body.page).toBe(1);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });

  test('Get single user by ID', async ({ request }) => {
    const api = new APIActions(request, apiBase);
    const response = await api.get('/api/users/1');
    const status = await api.validateStatus(response);
    expect(status).toBe(200);
    const body = await api.validateJson(response);
    expect(body.data).toHaveProperty('id');
    expect(body.data).toHaveProperty('email');
    expect(body.data).toHaveProperty('first_name');
  });
});
