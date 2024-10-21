import request from 'supertest';
import { StatusCode } from 'status-code-enum';
import { UserMessage } from '../types';
import { server } from '../index';
import { adminUserId } from '../helpers';

describe('User API tests', () => {
  const userPath = '/api/users/';

  afterAll(async () => {
    await new Promise(resolve => {
      server.close(resolve);
    });
  });
  test(`GET ${userPath} - should return all users`, async () => {
    const response = await request(server).get(userPath);

    expect(response.statusCode).toBe(StatusCode.SuccessOK);
    expect(response.headers['content-type']).toContain('application/json');
    expect(Array.isArray(response.body)).toBe(true);
  });

  test(`GET ${userPath}:userId - should return user by ID`, async () => {
    const userId = adminUserId;

    const response = await request(server).get(`${userPath}${userId}`);

    expect(response.statusCode).toBe(StatusCode.SuccessOK);
    expect(response.body).toHaveProperty('id', userId);
    expect(response.body).toHaveProperty('username');
  });

  test(`POST ${userPath} - should create a new user`, async () => {
    const newUser = { username: 'AG', age: 30, hobbies: ['coding'] };

    const response = await request(server)
      .post(userPath)
      .send(newUser)
      .set('Content-Type', 'application/json');

    expect(response.statusCode).toBe(StatusCode.SuccessCreated);
    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe(newUser.username);
  });

  test(`PUT ${userPath}:userId - should update user`, async () => {
    const userId = adminUserId;
    const updatedUser = { username: 'AG Updated', age: 35, hobbies: ['coding', 'music'] };

    const response = await request(server)
      .put(`${userPath}${userId}`)
      .send(updatedUser)
      .set('Content-Type', 'application/json');

    expect(response.statusCode).toBe(StatusCode.SuccessOK);
    expect(response.body.username).toBe(updatedUser.username);
    expect(response.body.age).toBe(updatedUser.age);
  });

  test(`DELETE ${userPath}:userId - should delete user`, async () => {
    const response = await request(server).delete(`${userPath}${adminUserId}`);

    expect(response.statusCode).toBe(StatusCode.SuccessNoContent);
  });

  test(`GET ${userPath}:userId - should return not found for deleted user`, async () => {
    const response = await request(server).get(`${userPath}${adminUserId}`);
    const responseBody = JSON.parse(response.text);

    expect(response.statusCode).toBe(StatusCode.ClientErrorNotFound);
    expect(responseBody.message).toBe(UserMessage.UserNotFound);
  });
});
