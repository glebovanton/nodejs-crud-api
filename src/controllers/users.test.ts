import request from 'supertest';
import { StatusCode } from 'status-code-enum';
import { UserMessage } from '../types';
import { server } from '../index';
import { adminUserId } from '../helpers';

describe('User API tests', () => {
  afterAll(async () => {
    await new Promise(resolve => {
      server.close(resolve);
    });
  });
  test('GET /api/users - should return all users', async () => {
    const response = await request(server).get('/api/users');

    expect(response.statusCode).toBe(StatusCode.SuccessOK);
    expect(response.headers['content-type']).toContain('application/json');
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('GET /api/users/:userId - should return user by ID', async () => {
    const userId = adminUserId;

    const response = await request(server).get(`/api/users/${userId}`);

    expect(response.statusCode).toBe(StatusCode.SuccessOK);
    expect(response.body).toHaveProperty('id', userId);
    expect(response.body).toHaveProperty('username');
  });

  test('POST /api/users - should create a new user', async () => {
    const newUser = { username: 'AG', age: 30, hobbies: ['coding'] };

    const response = await request(server)
      .post('/api/users')
      .send(newUser)
      .set('Content-Type', 'application/json');

    expect(response.statusCode).toBe(StatusCode.SuccessCreated);
    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe(newUser.username);
  });

  test('PUT /api/users/:userId - should update user', async () => {
    const userId = adminUserId;
    const updatedUser = { username: 'AG Updated', age: 35, hobbies: ['coding', 'music'] };

    const response = await request(server)
      .put(`/api/users/${userId}`)
      .send(updatedUser)
      .set('Content-Type', 'application/json');

    expect(response.statusCode).toBe(StatusCode.SuccessOK);
    expect(response.body.username).toBe(updatedUser.username);
    expect(response.body.age).toBe(updatedUser.age);
  });

  test('DELETE /api/users/:userId - should delete user', async () => {
    const response = await request(server).delete(`/api/users/${adminUserId}`);

    expect(response.statusCode).toBe(StatusCode.SuccessNoContent);
  });

  test('GET /api/users/:userId - should return not found for deleted user', async () => {
    const response = await request(server).get(`/api/users/${adminUserId}`);
    const responseBody = JSON.parse(response.text);

    expect(response.statusCode).toBe(StatusCode.ClientErrorNotFound);
    expect(responseBody.message).toBe(UserMessage.UserNotFound);
  });
});
