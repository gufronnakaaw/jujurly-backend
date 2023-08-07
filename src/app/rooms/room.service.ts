import ResponseError from '../../error/ResponseError';
import prisma from '../../utils/database';
import generate from '../../utils/generate';
import validate from '../../utils/validate';
import { RoomEntity } from './room.entity';
import {
  CreateRoomsBody,
  DeleteRoomsBody,
  GetRoomsRawQuery,
} from './room.types';
import {
  createRoomsValidation,
  deleteRoomsValidation,
  getRoomsValidation,
} from './room.validation';

async function create(body: CreateRoomsBody, userId: number) {
  const { name, start, end, candidates } = validate(
    createRoomsValidation,
    body
  );

  const room: RoomEntity = {
    name,
    start,
    end,
    user_id: userId,
    code: generate(8),
  };

  const create = await prisma.room.create({
    data: {
      ...room,
      candidate: {
        createMany: {
          data: candidates,
        },
      },
    },
    select: {
      id: true,
    },
  });

  return {
    id: create.id,
    name,
    start,
    end,
    code: room.code,
    candidates,
  };
}

async function remove(body: DeleteRoomsBody, userId: number) {
  const { room_id, code } = validate(deleteRoomsValidation, body);

  const room = await prisma.room.findFirst({
    where: {
      AND: [{ id: room_id }, { code }, { user_id: userId }],
    },
  });

  if (!room) {
    throw new ResponseError(404, 'Room not found');
  }

  await prisma.$transaction([
    prisma.candidate.deleteMany({
      where: {
        room_id,
      },
    }),

    prisma.room.deleteMany({
      where: {
        AND: [
          {
            id: room_id,
          },
          {
            code,
          },
          {
            user_id: userId,
          },
        ],
      },
    }),
  ]);
}

async function getAll(userId: number) {
  return prisma.room.findMany({
    where: {
      user_id: userId,
    },
    select: {
      id: true,
      name: true,
      start: true,
      end: true,
      code: true,
    },
  });
}

async function getByCode(code: string) {
  const valid = validate(getRoomsValidation, { code });

  const room = await prisma.room.findFirst({
    where: {
      code: valid.code,
    },
    select: {
      id: true,
      name: true,
      start: true,
      end: true,
      code: true,
    },
  });

  if (!room) {
    throw new ResponseError(404, 'Room not found');
  }

  if (Date.now() < room!.start) {
    throw new ResponseError(202, 'Voting has not started');
  }

  const [votes, total_votes]: any[] = await prisma.$transaction([
    prisma.$queryRaw`SELECT c.id, c.name, COUNT(v.id) AS vote_count,
    (ROUND(COUNT(v.id) * 100 / (SELECT COUNT(id) FROM votes WHERE room_id = ${
      room!.id
    }), 2)) as percentage
        FROM candidates c
        LEFT JOIN votes v ON c.id = v.candidate_id
      WHERE c.room_id = ${room!.id}
    GROUP BY c.id, c.name;`,

    prisma.vote.count({
      where: {
        room_id: room!.id,
      },
    }),
  ]);

  const candidates = votes.map(
    ({ id, name, vote_count, percentage }: GetRoomsRawQuery) => {
      return {
        id,
        name,
        percentage: !percentage ? 0 : percentage,
        vote_count: Number(vote_count),
      };
    }
  );

  return {
    ...room,
    total_votes,
    candidates,
  };
}

async function getById(id: number, userId: number) {
  const valid = validate(getRoomsValidation, { id });

  const room = await prisma.room.findFirst({
    where: {
      AND: [
        {
          id: valid.id,
        },
        {
          user_id: userId,
        },
      ],
    },
    select: {
      id: true,
      name: true,
      start: true,
      end: true,
      code: true,
      candidate: {
        select: {
          name: true,
        },
        where: {
          room_id: valid.id,
        },
      },
    },
  });

  if (!room) {
    throw new ResponseError(404, 'Room not found');
  }

  return {
    ...room,
    candidates: room.candidate,
  };
}

export { create, remove, getAll, getByCode, getById };
