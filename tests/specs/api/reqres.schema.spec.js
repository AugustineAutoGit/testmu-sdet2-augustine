import { test, expect } from '@playwright/test';
import { APIActions } from '../../utils/apiactions.utils.js';

test.describe('ReqRes JSON schema validation', () => {
  const apiBase = process.env.API_URL || 'https://reqres.in';

  test('User detail response matches schema', async ({ request }) => {
    const api = new APIActions(request, apiBase);
    const response = await api.get('/api/users/1');
    const status = await api.getStatus(response);
    expect(status).toBe(200);
    const body = await api.getJson(response);

    const userSchema = {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            email: { type: 'string' },
            first_name: { type: 'string' },
            last_name: { type: 'string' },
            avatar: { type: 'string' },
          },
          required: ['id', 'email', 'first_name', 'last_name', 'avatar'],
        },
        support: {
          type: 'object',
          properties: {
            url: { type: 'string' },
            text: { type: 'string' },
          },
          required: ['url', 'text'],
        },
      },
      required: ['data', 'support'],
      additionalProperties: true,
    };

    const { valid } = api.validateSchema(body, userSchema);
    expect(valid).toBeTruthy();
  });

  test('Create user response schema is valid', async ({ request }) => {
    const api = new APIActions(request, apiBase);
    const response = await api.post('/api/users', {
      name: 'john',
      job: 'engineer',
    });
    const status2 = await api.getStatus(response);
    expect(status2).toBe(201);
    const body = await api.getJson(response);

    const createSchema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        job: { type: 'string' },
        id: { type: 'string' },
        createdAt: { type: 'string' },
      },
      required: ['name', 'job', 'id', 'createdAt'],
      additionalProperties: true,
    };

    const r2 = api.validateSchema(body, createSchema);
    expect(r2.valid).toBeTruthy();
  });

  test('User list response schema is valid', async ({ request }) => {
    const api = new APIActions(request, apiBase);
    const response = await api.get('/api/users?page=1');
    const status3 = await api.getStatus(response);
    expect(status3).toBe(200);
    const body = await api.getJson(response);

    const listSchema = {
      type: 'object',
      properties: {
        page: { type: 'number' },
        per_page: { type: 'number' },
        total: { type: 'number' },
        total_pages: { type: 'number' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              email: { type: 'string' },
              first_name: { type: 'string' },
              last_name: { type: 'string' },
              avatar: { type: 'string' },
            },
            required: ['id', 'email'],
          },
        },
        support: { type: 'object' },
      },
      required: ['page', 'per_page', 'total', 'total_pages', 'data'],
      additionalProperties: true,
    };

    const r3 = api.validateSchema(body, listSchema);
    expect(r3.valid).toBeTruthy();
  });
});
