# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api/reqres.crud.spec.js >> ReqRes CRUD operations >> Delete a user
- Location: tests/specs/api/reqres.crud.spec.js:48:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 204
Received: 401
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { APIActions } from '../../utils/apiactions.utils.js';
  3  | import { validAPIUserDetails } from '../../data/user-details.data.js';
  4  | 
  5  | test.describe('ReqRes CRUD operations', () => {
  6  |   const apiBase = process.env.API_URL || 'https://reqres.in';
  7  | 
  8  |   test('Create a new user and verify response', async ({ request }) => {
  9  |     const api = new APIActions(request, apiBase);
  10 | 
  11 |     const createResponse = await api.post('/api/users', {
  12 |       name: validAPIUserDetails.name,
  13 |       job: validAPIUserDetails.job,
  14 |     });
  15 |     const status = await api.getStatus(createResponse);
  16 |     expect(status).toBe(201);
  17 |     const createdBody = await api.getJson(createResponse);
  18 |     expect(createdBody).toMatchObject({ name: validAPIUserDetails.name, job: validAPIUserDetails.job });
  19 |     expect(createdBody.id).toBeTruthy();
  20 |     expect(createdBody.createdAt).toBeTruthy();
  21 |   });
  22 | 
  23 |   test('Update an existing user', async ({ request }) => {
  24 |     const api = new APIActions(request, apiBase);
  25 |     const updateResponse = await api.put('/api/users/2', {
  26 |       name: validAPIUserDetails.name,
  27 |       job: validAPIUserDetails.newJob,
  28 |     });
  29 |     const status = await api.getStatus(updateResponse);
  30 |     expect(status).toBe(200);
  31 |     const updatedBody = await api.getJson(updateResponse);
  32 |     expect(updatedBody).toMatchObject({ name: validAPIUserDetails.name, job: validAPIUserDetails.newJob });
  33 |     expect(updatedBody.updatedAt).toBeTruthy();
  34 |   });
  35 | 
  36 |   test('Patch a user job field', async ({ request }) => {
  37 |     const api = new APIActions(request, apiBase);
  38 |     const patchResponse = await api.patch('/api/users/3', {
  39 |       job: validAPIUserDetails.job,
  40 |     });
  41 |     const status = await api.getStatus(patchResponse);
  42 |     expect(status).toBe(200);
  43 |     const patchedBody = await api.getJson(patchResponse);
  44 |     expect(patchedBody.job).toBe(validAPIUserDetails.job);
  45 |     expect(patchedBody.updatedAt).toBeTruthy();
  46 |   });
  47 | 
  48 |   test('Delete a user', async ({ request }) => {
  49 |     const api = new APIActions(request, apiBase);
  50 |     const deleteResponse = await api.delete('/api/users/2');
  51 |     const status = await api.getStatus(deleteResponse);
> 52 |     expect(status).toBe(204);
     |                    ^ Error: expect(received).toBe(expected) // Object.is equality
  53 |   });
  54 | 
  55 |   test('Read user list and verify response time', async ({ request }) => {
  56 |     const api = new APIActions(request, apiBase);
  57 |     const response = await api.get('/api/users?page=1');
  58 |     const status = await api.getStatus(response);
  59 |     expect(status).toBe(200);
  60 |     const duration = api.getResponseTime(response);
  61 |     expect(duration).toBeLessThan(2000);
  62 |     const body = await api.getJson(response);
  63 |     expect(body.page).toBe(1);
  64 |     expect(Array.isArray(body.data)).toBe(true);
  65 |     expect(body.data.length).toBeGreaterThan(0);
  66 |   });
  67 | 
  68 |   test('Get single user by ID', async ({ request }) => {
  69 |     const api = new APIActions(request, apiBase);
  70 |     const response = await api.get('/api/users/1');
  71 |     const status = await api.getStatus(response);
  72 |     expect(status).toBe(200);
  73 |     const body = await api.getJson(response);
  74 |     expect(body.data).toHaveProperty('id');
  75 |     expect(body.data).toHaveProperty('email');
  76 |     expect(body.data).toHaveProperty('first_name');
  77 |   });
  78 | });
  79 | 
```