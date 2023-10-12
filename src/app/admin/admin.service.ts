import crypto from 'crypto';
import UAParser from 'ua-parser-js';
import ResponseError from '../../error/ResponseError';
import prisma from '../../utils/database';
import validate from '../../utils/validate';
import { LoginBody, RoomType } from './admin.types';
import {
  deleteRoomsValidation,
  deleteUsersValidation,
  loginAdminValidation,
} from './admin.validation';
import { verify } from '../../utils/password';

async function getDashboard() {
  const [total_users, total_rooms, total_candidates] =
    await prisma.$transaction([
      prisma.user.count(),
      prisma.room.count(),
      prisma.candidate.count(),
    ]);

  return {
    total_users,
    total_rooms,
    total_candidates,
  };
}

function getUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      fullname: true,
      email: true,
      created_at: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  });
}

async function getRooms() {
  const rooms = await prisma.room.findMany({
    select: {
      id: true,
      name: true,
      start: true,
      end: true,
      code: true,
      candidate: {
        select: {
          id: true,
          name: true,
        },
      },
      user: {
        select: {
          fullname: true,
        },
      },
      created_at: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  const data = rooms.map((room: RoomType) => {
    room.owner = room.user!.fullname;
    room.candidates = room.candidate;

    delete room.user;
    delete room.candidate;

    return {
      ...room,
      start: Number(room.start),
      end: Number(room.end),
    };
  });

  return data;
}

function getLogs() {
  return prisma.log.findMany({
    select: {
      log_id: true,
      name: true,
      device: true,
      created_at: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  });
}

async function removeUsers(userId: number) {
  const { user_id } = validate(deleteUsersValidation, { user_id: userId });

  const user = await prisma.user.count({
    where: {
      id: user_id,
    },
  });

  if (user < 1) {
    throw new ResponseError(404, 'user not found');
  }

  const rooms = await prisma.room.findMany({
    where: {
      user_id,
    },
  });

  await Promise.all(
    rooms.map(async (room) => {
      await prisma.$transaction([
        prisma.vote.deleteMany({
          where: {
            room_id: room.id,
          },
        }),
        prisma.candidate.deleteMany({
          where: {
            room_id: room.id,
          },
        }),
      ]);
    })
  );

  await prisma.$transaction([
    prisma.vote.deleteMany({
      where: {
        user_id,
      },
    }),
    prisma.room.deleteMany({
      where: {
        user_id,
      },
    }),
    prisma.user.deleteMany({
      where: {
        id: user_id,
      },
    }),
  ]);
}

async function removeRooms(roomId: number) {
  const { room_id } = validate(deleteRoomsValidation, { room_id: roomId });

  const room = await prisma.room.findFirst({
    where: {
      id: room_id,
    },
  });

  if (!room) {
    throw new ResponseError(404, 'room not found');
  }

  await prisma.$transaction([
    prisma.vote.deleteMany({
      where: {
        room_id,
      },
    }),
    prisma.candidate.deleteMany({
      where: {
        room_id,
      },
    }),
    prisma.room.deleteMany({
      where: {
        id: room_id,
      },
    }),
  ]);
}

async function login(body: LoginBody, userAgent: string | undefined) {
  const { username, password } = validate(loginAdminValidation, body);

  const admin = await prisma.admin.findFirst({
    where: {
      username,
    },
  });

  if (!admin) {
    throw new ResponseError(400, 'username or password wrong');
  }

  if (!(await verify(password, admin.password))) {
    throw new ResponseError(400, 'username or password wrong');
  }

  const parser = new UAParser(userAgent);

  const device = parser.getOS().name
    ? `${parser.getOS().name} ${parser.getOS().version}`
    : 'unknown';

  const api_token = crypto.randomUUID().replace(/-/g, '');

  await prisma.$transaction([
    prisma.token.create({
      data: {
        value: api_token,
        expired: Date.now() + 1000 * 60 * 60,
      },
    }),
    prisma.log.create({
      data: {
        device,
        name: admin.fullname,
        log_id: crypto.randomUUID().replace(/-/g, '').slice(0, 10),
      },
    }),
  ]);

  return {
    email: admin.email,
    fullname: admin.fullname,
    api_token,
  };
}

export {
  getDashboard,
  getUsers,
  getRooms,
  getLogs,
  removeUsers,
  removeRooms,
  login,
};
