import {
  describe,
  it,
  afterAll,
  beforeAll,
  expect,
  beforeEach,
  afterEach,
} from '@jest/globals';
import logger from '../utils/logger';
import server from '../http/server';
import { createUsers, removeUsers } from './utils/user.util';
import {
  createManyRooms,
  createRooms,
  deleteCandidates,
  deleteManyRooms,
  deleteRooms,
  deleteVotes,
  getRooms,
} from './utils/room.util';

async function doLogin(): Promise<string> {
  const fastifyServer = server();

  const response = await fastifyServer.inject({
    method: 'POST',
    url: '/api/v1/users/login',
    payload: {
      email: 'testing@mail.com',
      password: 'testing123',
    },
  });

  return response.json().data.token;
}

describe('POST /api/v1/rooms', () => {
  beforeAll(async () => {
    await createUsers();
  });

  afterAll(async () => {
    await deleteCandidates();
    await deleteRooms();
    await removeUsers();
  });

  const payload = {
    name: 'Create Room Test',
    start: 1690776168631,
    end: 1690776168631,
    candidates: [
      {
        name: 'Candidate Test 1',
      },
      {
        name: 'Candidate Test 2',
      },
    ],
  };

  it('should can create room', async () => {
    const fastifyServer = server();

    const token = await doLogin();

    const response = await fastifyServer.inject({
      method: 'POST',
      url: '/api/v1/rooms',
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload,
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('data');

    expect(response.json().success).toBeTruthy();
    expect(response.json().data).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: payload.name,
        start: payload.start,
        end: payload.end,
        code: expect.any(String),
        candidates: payload.candidates,
      })
    );
  });

  it('should unauthorized', async () => {
    const fastifyServer = server();

    const response = await fastifyServer.inject({
      method: 'POST',
      url: '/api/v1/rooms',
      payload,
    });

    expect(response.statusCode).toBe(401);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(response.json().errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.any(String),
        }),
      ])
    );
  });

  it('should cannot create rooms if request is invalid', async () => {
    const fastifyServer = server();

    const token = await doLogin();

    const response = await fastifyServer.inject({
      method: 'POST',
      url: '/api/v1/rooms',
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        name: 123,
        start: 1690776168631,
        end: 1690776168631,
        candidates: [
          {
            name: 'Candidate Test 1',
          },
        ],
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(response.json().errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.any(String),
        }),
      ])
    );
  });
});

describe('DELETE /api/v1/rooms', () => {
  beforeEach(async () => {
    await createUsers();
    await createRooms();
  });

  afterEach(async () => {
    await deleteCandidates();
    await deleteRooms();
    await removeUsers();
  });

  it('should can delete rooms', async () => {
    const fastifyServer = server();
    const room = await getRooms();

    const token = await doLogin();

    const response = await fastifyServer.inject({
      method: 'DELETE',
      url: '/api/v1/rooms',
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        room_id: room?.id,
        code: room?.code,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('data');

    expect(response.json().success).toBeTruthy();
    expect(response.json().data).toEqual(
      expect.objectContaining({
        message: expect.any(String),
      })
    );
  });

  it('should cannot delete rooms if request is invalid', async () => {
    const fastifyServer = server();
    const room = await getRooms();

    const token = await doLogin();

    const response = await fastifyServer.inject({
      method: 'DELETE',
      url: '/api/v1/rooms',
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        room_id: 'string',
        code: room?.code,
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(response.json().errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.any(String),
        }),
      ])
    );
  });

  it('should cannot delete rooms if room id not found', async () => {
    const fastifyServer = server();

    const room = await getRooms();

    const token = await doLogin();

    const response = await fastifyServer.inject({
      method: 'DELETE',
      url: '/api/v1/rooms',
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        room_id: 1,
        code: room?.code,
      },
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(response.json().errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.any(String),
        }),
      ])
    );
  });

  it('should cannot delete rooms if code not found', async () => {
    const fastifyServer = server();

    const room = await getRooms();

    const token = await doLogin();

    const response = await fastifyServer.inject({
      method: 'DELETE',
      url: '/api/v1/rooms',
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        room_id: room?.id,
        code: 'WRONGGGG',
      },
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(response.json().errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.any(String),
        }),
      ])
    );
  });

  it('should unauthorized', async () => {
    const fastifyServer = server();
    const room = await getRooms();

    const response = await fastifyServer.inject({
      method: 'DELETE',
      url: '/api/v1/rooms',
      payload: {
        room_id: room?.id,
        code: room?.code,
      },
    });

    expect(response.statusCode).toBe(401);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(response.json().errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.any(String),
        }),
      ])
    );
  });
});

describe('GET /api/v1/rooms', () => {
  beforeAll(async () => {
    await createUsers();
    await createManyRooms();
  });

  afterAll(async () => {
    await deleteManyRooms();
    await removeUsers();
  });

  it('should can get rooms', async () => {
    const fastifyServer = server();
    const token = await doLogin();

    const response = await fastifyServer.inject({
      method: 'GET',
      url: '/api/v1/rooms',
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('data');

    expect(response.json().success).toBeTruthy();
    expect(response.json().data.length).toBe(5);
    expect(response.json().data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          start: expect.any(Number),
          end: expect.any(Number),
          code: expect.any(String),
        }),
      ])
    );
  });

  it('should return empty array when the user has no rooms', async () => {
    const fastifyServer = server();
    const login = await fastifyServer.inject({
      method: 'POST',
      url: '/api/v1/users/login',
      payload: {
        email: 'unittest@mail.com',
        password: 'unittest123',
      },
    });

    const response = await fastifyServer.inject({
      method: 'GET',
      url: '/api/v1/rooms',
      headers: {
        authorization: `Bearer ${login.json().data.token}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('data');

    expect(response.json().success).toBeTruthy();
    expect(response.json().data.length).toBe(0);
  });

  it('should unauthorized', async () => {
    const fastifyServer = server();
    const response = await fastifyServer.inject({
      method: 'GET',
      url: '/api/v1/rooms',
    });

    expect(response.statusCode).toBe(401);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(response.json().errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.any(String),
        }),
      ])
    );
  });
});

describe('GET BY ID /api/v1/rooms', () => {
  beforeAll(async () => {
    await createUsers();
    await createRooms();
  });

  afterAll(async () => {
    await deleteCandidates();
    await deleteRooms();
    await removeUsers();
  });

  it('should can get rooms by id', async () => {
    const fastifyServer = server();
    const token = await doLogin();
    const room = await getRooms();

    const response = await fastifyServer.inject({
      method: 'GET',
      url: `/api/v1/rooms?id=${room?.id}`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('data');

    expect(response.json().success).toBeTruthy();
    expect(response.json().data).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        start: expect.any(Number),
        end: expect.any(Number),
        code: expect.any(String),
        candidates: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
          }),
        ]),
      })
    );
  });

  it('should cannot get rooms by id if room not found', async () => {
    const fastifyServer = server();
    const token = await doLogin();
    const room = await getRooms();

    const response = await fastifyServer.inject({
      method: 'GET',
      url: `/api/v1/rooms?id=${room!.id + 1}`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(response.json().errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.any(String),
        }),
      ])
    );
  });

  it('should unauthorized', async () => {
    const fastifyServer = server();
    const room = await getRooms();

    const response = await fastifyServer.inject({
      method: 'GET',
      url: `/api/v1/rooms?id=${room!.id}`,
    });

    expect(response.statusCode).toBe(401);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(response.json().errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.any(String),
        }),
      ])
    );
  });

  it('should cannot get rooms by id if request invalid', async () => {
    const fastifyServer = server();
    const token = await doLogin();

    const response = await fastifyServer.inject({
      method: 'GET',
      url: `/api/v1/rooms?id=wrong`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(response.json().errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.any(String),
        }),
      ])
    );
  });
});

describe('PATCH /api/v1/rooms', () => {
  beforeAll(async () => {
    await createUsers();
    await createRooms();
  });

  afterAll(async () => {
    await deleteCandidates();
    await deleteRooms();
    await removeUsers();
  });

  it('should can update rooms name', async () => {
    const fastifyServer = server();
    const token = await doLogin();
    const room = await getRooms();

    const payload = {
      room_id: room!.id,
      name: 'Update Room Test',
    };

    const response = await fastifyServer.inject({
      method: 'PATCH',
      url: `/api/v1/rooms`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('data');

    expect(response.json().success).toBeTruthy();
    expect(response.json().data).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        start: expect.any(Number),
        end: expect.any(Number),
        code: expect.any(String),
        candidates: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
          }),
        ]),
      })
    );
    expect(response.json().data.name).not.toBe(room?.name);
  });

  it('should can update rooms candidates', async () => {
    const fastifyServer = server();
    const token = await doLogin();
    const room = await getRooms();

    const candidates = room?.candidate.map((element) => {
      return {
        id: element.id,
        name: `Update ${element.name}`,
      };
    });

    const payload = {
      room_id: room!.id,
      candidates,
    };

    const response = await fastifyServer.inject({
      method: 'PATCH',
      url: `/api/v1/rooms`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('data');

    expect(response.json().success).toBeTruthy();
    expect(response.json().data).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        start: expect.any(Number),
        end: expect.any(Number),
        code: expect.any(String),
        candidates: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
          }),
        ]),
      })
    );
    expect(response.json().data.candidates).not.toEqual(room?.candidate);
  });

  it('should unauthorized', async () => {
    const fastifyServer = server();

    const response = await fastifyServer.inject({
      method: 'PATCH',
      url: `/api/v1/rooms`,
    });

    expect(response.statusCode).toBe(401);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(response.json().errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.any(String),
        }),
      ])
    );
  });

  it('should cannot update rooms if request invalid', async () => {
    const fastifyServer = server();
    const token = await doLogin();

    const response = await fastifyServer.inject({
      method: 'PATCH',
      url: `/api/v1/rooms`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        room_id: '12',
        name: 1234,
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(response.json().errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.any(String),
        }),
      ])
    );
  });

  it('should cannot update rooms if room not found', async () => {
    const fastifyServer = server();
    const token = await doLogin();
    const room = await getRooms();

    const response = await fastifyServer.inject({
      method: 'PATCH',
      url: `/api/v1/rooms`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        room_id: room!.id + 1,
        name: 'Update Test',
      },
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(response.json().errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.any(String),
        }),
      ])
    );
  });
});

describe('POST /api/v1/rooms/votes', () => {
  beforeAll(async () => {
    await createUsers();
    await createRooms();
  });

  afterAll(async () => {
    await deleteVotes();
    await deleteCandidates();
    await deleteRooms();
    await removeUsers();
  });

  it('should can votes', async () => {
    const fastifyServer = server();
    const token = await doLogin();
    const room = await getRooms();

    const payload = {
      room_id: room!.id,
      code: room!.code,
      candidate: {
        id: room!.candidate[0].id,
      },
    };

    const response = await fastifyServer.inject({
      method: 'POST',
      url: `/api/v1/rooms/votes`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload,
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('data');

    expect(response.json().success).toBeTruthy();
    expect(response.json().data).toEqual(
      expect.objectContaining({
        message: expect.any(String),
      })
    );
  });

  it('should cannot votes if user has already participated', async () => {
    const fastifyServer = server();
    const token = await doLogin();
    const room = await getRooms();

    const payload = {
      room_id: room!.id,
      code: room!.code,
      candidate: {
        id: room!.candidate[0].id,
      },
    };

    const response = await fastifyServer.inject({
      method: 'POST',
      url: `/api/v1/rooms/votes`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload,
    });

    expect(response.statusCode).toBe(409);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(response.json().errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.any(String),
        }),
      ])
    );
  });

  it('should cannot votes if room not found', async () => {
    const fastifyServer = server();
    const token = await doLogin();
    const room = await getRooms();

    const payload = {
      room_id: room!.id + 1,
      code: room!.code,
      candidate: {
        id: room!.candidate[0].id,
      },
    };

    const response = await fastifyServer.inject({
      method: 'POST',
      url: `/api/v1/rooms/votes`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload,
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(response.json().errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.any(String),
        }),
      ])
    );
  });

  it('should cannot votes if candidate not found', async () => {
    const fastifyServer = server();
    const token = await doLogin();
    const room = await getRooms();

    const payload = {
      room_id: room!.id,
      code: room!.code,
      candidate: {
        id: room!.candidate[0].id + 999,
      },
    };

    const response = await fastifyServer.inject({
      method: 'POST',
      url: `/api/v1/rooms/votes`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload,
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(response.json().errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.any(String),
        }),
      ])
    );
  });

  it('should cannot votes if request invalid', async () => {
    const fastifyServer = server();
    const token = await doLogin();
    const room = await getRooms();

    const payload = {
      room_id: 'asdhjkashdjkasd',
      code: room!.code,
    };

    const response = await fastifyServer.inject({
      method: 'POST',
      url: `/api/v1/rooms/votes`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload,
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(response.json().errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.any(String),
        }),
      ])
    );
  });

  it('should unauthorized', async () => {
    const fastifyServer = server();
    const room = await getRooms();

    const payload = {
      room_id: room!.id,
      code: room!.code,
      candidate: {
        id: room!.candidate[0].id,
      },
    };

    const response = await fastifyServer.inject({
      method: 'POST',
      url: `/api/v1/rooms/votes`,
      payload,
    });

    expect(response.statusCode).toBe(401);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(response.json().errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.any(String),
        }),
      ])
    );
  });
});

describe('GET BY CODE /api/v1/rooms', () => {
  beforeAll(async () => {
    await createUsers();
    await createRooms();
  });

  afterAll(async () => {
    await deleteVotes();
    await deleteCandidates();
    await deleteRooms();
    await removeUsers();
  });

  it('should can get rooms by code', async () => {
    const fastifyServer = server();
    const token = await doLogin();
    const room = await getRooms();

    const payload = {
      room_id: room!.id,
      code: room!.code,
      candidate: {
        id: room!.candidate[0].id,
      },
    };

    await fastifyServer.inject({
      method: 'POST',
      url: `/api/v1/rooms/votes`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload,
    });

    const response = await fastifyServer.inject({
      method: 'GET',
      url: `/api/v1/rooms?code=${room!.code}`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('data');

    // logger.info(response.json());

    expect(response.json().success).toBeTruthy();
    expect(response.json().data).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        start: expect.any(Number),
        end: expect.any(Number),
        code: expect.any(String),
        total_votes: expect.any(Number),
        candidates: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            percentage: expect.any(Number),
            vote_count: expect.any(Number),
          }),
        ]),
      })
    );

    expect(response.json().data.candidates[0].percentage).toBe(100);
  });

  it('should cannot get rooms if code not found', async () => {
    const fastifyServer = server();
    const token = await doLogin();

    const response = await fastifyServer.inject({
      method: 'GET',
      url: `/api/v1/rooms?code=WRONGGGG`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(response.json().errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.any(String),
        }),
      ])
    );
  });

  it('should cannot get rooms if voting has not started', async () => {
    const fastifyServer = server();
    const token = await doLogin();

    const createRoom = await fastifyServer.inject({
      method: 'POST',
      url: `/api/v1/rooms`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        name: 'Create Room Test Again',
        start: Date.now() + 150000000,
        end: 1690776168631,
        candidates: [
          {
            name: 'Candidate Test 1',
          },
          {
            name: 'Candidate Test 2',
          },
        ],
      },
    });

    const response = await fastifyServer.inject({
      method: 'GET',
      url: `/api/v1/rooms?code=${createRoom.json().data.code}`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(202);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(response.json().errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.any(String),
        }),
      ])
    );

    await fastifyServer.inject({
      method: 'DELETE',
      url: `/api/v1/rooms`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        room_id: createRoom.json().data.id,
        code: createRoom.json().data.code,
      },
    });
  });

  it('should cannot get rooms if code invalid', async () => {
    const fastifyServer = server();
    const token = await doLogin();

    const response = await fastifyServer.inject({
      method: 'GET',
      url: `/api/v1/rooms?code=-aakjh0912`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(response.json().errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.any(String),
        }),
      ])
    );
  });

  it('should unauthorized', async () => {
    const fastifyServer = server();
    const room = await getRooms();

    const response = await fastifyServer.inject({
      method: 'GET',
      url: `/api/v1/rooms?code=${room?.code}`,
    });

    expect(response.statusCode).toBe(401);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(response.json().errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.any(String),
        }),
      ])
    );
  });
});
