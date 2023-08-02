import { describe, it, afterAll, beforeAll, expect } from '@jest/globals';
import logger from '../utils/logger';
import server from '../http/server';
import { createUsers, removeUsers } from './utils/user.util';

describe('POST /api/v1/users/register', () => {
  beforeAll(async () => {
    await removeUsers();
  });

  afterAll(async () => {
    await removeUsers();
  });

  it('should can register users', async () => {
    const fastifyServer = server();

    const response = await fastifyServer.inject({
      method: 'POST',
      url: '/api/v1/users/register',
      payload: {
        email: 'testing@mail.com',
        fullname: 'Testing',
        password: 'testing123',
      },
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('data');

    expect(response.json().success).toBeTruthy();
    expect(response.json().data).toEqual(
      expect.objectContaining({
        token: expect.any(String),
      })
    );
  });

  it('should cannot register users if email is already exists', async () => {
    const fastifyServer = server();

    const response = await fastifyServer.inject({
      method: 'POST',
      url: '/api/v1/users/register',
      payload: {
        email: 'testing@mail.com',
        fullname: 'Testing',
        password: 'testing123',
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(response.json().errors).toBeDefined();

    expect(response.json().errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: expect.any(String) }),
      ])
    );
  });

  it('should cannot register users if request is invalid', async () => {
    const fastifyServer = server();

    const response = await fastifyServer.inject({
      method: 'POST',
      url: '/api/v1/users/register',
      payload: {
        email: 'test@mail.com',
        fullname: '',
        password: '',
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(response.json().errors).toBeDefined();

    expect(response.json().errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: expect.any(String),
          message: expect.any(String),
        }),
      ])
    );
  });
});

describe('POST /api/v1/users/login', () => {
  beforeAll(async () => {
    await createUsers();
  });

  afterAll(async () => {
    await removeUsers();
  });

  it('should can login users', async () => {
    const fastifyServer = server();

    const response = await fastifyServer.inject({
      method: 'POST',
      url: '/api/v1/users/login',
      payload: {
        email: 'testing@mail.com',
        password: 'testing123',
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('data');

    expect(response.json().success).toBeTruthy();
    expect(response.json().data).toEqual(
      expect.objectContaining({
        token: expect.any(String),
      })
    );
  });

  it('should cannot login users (wrong email)', async () => {
    const fastifyServer = server();

    const response = await fastifyServer.inject({
      method: 'POST',
      url: '/api/v1/users/login',
      payload: {
        email: 'wrong@mail.com',
        password: 'testing123',
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(response.json().errors).toBeDefined();

    expect(response.json().errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: expect.any(String) }),
      ])
    );
  });

  it('should cannot login users (wrong password)', async () => {
    const fastifyServer = server();

    const response = await fastifyServer.inject({
      method: 'POST',
      url: '/api/v1/users/login',
      payload: {
        email: 'testing@mail.com',
        password: 'wrongpassword',
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(response.json().errors).toBeDefined();

    expect(response.json().errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: expect.any(String) }),
      ])
    );
  });

  it('should cannot login users if request is invalid', async () => {
    const fastifyServer = server();

    const response = await fastifyServer.inject({
      method: 'POST',
      url: '/api/v1/users/login',
      payload: {
        email: 'invalid request',
        password: 'ajshdjkashdjk',
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(response.json().errors).toBeDefined();

    expect(response.json().errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: expect.any(String),
          message: expect.any(String),
        }),
      ])
    );
  });
});
