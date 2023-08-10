import ResponseError from '../../error/ResponseError';
import prisma from '../../utils/database';
import generate from '../../utils/generate';
import validate from '../../utils/validate';
import { RoomEntity } from './room.entity';
import {
  CreateRoomsBody,
  CreateVotesBody,
  DeleteRoomsBody,
  GetRoomsRawQuery,
  UpdateRoomsBody,
} from './room.types';
import {
  createRoomsValidation,
  createVotesValidation,
  deleteRoomsValidation,
  getRoomsValidation,
  updateRoomsValidation,
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
    (ROUND(COUNT(v.id) * 100 / NULLIF((SELECT COUNT(id) FROM votes WHERE room_id = ${
      room!.id
    }), 0), 2)) as percentage
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
          id: true,
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

async function votes(body: CreateVotesBody, userId: number) {
  const valid = validate(createVotesValidation, body);

  const room = await prisma.room.count({
    where: {
      AND: [
        {
          id: valid.room_id,
        },
        {
          code: valid.code,
        },
      ],
    },
  });

  if (!room) {
    throw new ResponseError(404, 'Room not found');
  }

  const candidate = await prisma.candidate.count({
    where: {
      AND: [
        {
          id: valid.candidate.id,
        },
        {
          room_id: valid.room_id,
        },
      ],
    },
  });

  if (!candidate) {
    throw new ResponseError(404, 'Candidate not found');
  }

  const votes = await prisma.vote.count({
    where: {
      AND: [
        {
          room_id: valid.room_id,
        },
        {
          user_id: userId,
        },
      ],
    },
  });

  if (votes > 0) {
    throw new ResponseError(409, 'You have already participated');
  }

  await prisma.vote.create({
    data: {
      user_id: userId,
      room_id: valid.room_id,
      candidate_id: valid.candidate.id,
    },
  });
}

async function update(body: UpdateRoomsBody, userId: number) {
  const { room_id, name, start, end, candidates } = validate(
    updateRoomsValidation,
    body
  );

  const room = await prisma.room.findFirst({
    where: {
      AND: [
        {
          id: room_id,
        },
        {
          user_id: userId,
        },
      ],
    },
  });

  if (!room) {
    throw new ResponseError(404, 'Room not found');
  }

  await prisma.room.update({
    where: {
      id: room_id,
    },
    data: {
      name,
      start,
      end,
    },
  });

  if (candidates) {
    const all = candidates.map((candidate) => {
      return prisma.candidate.upsert({
        where: {
          id: candidate.id,
          room_id,
        },
        update: {
          name: candidate.name,
        },
        create: {
          name: candidate.name,
          room_id,
        },
      });
    });

    await Promise.all(all);
  }

  const update = await prisma.room.findFirst({
    where: {
      id: room_id,
    },
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
        where: {
          room_id,
        },
      },
    },
  });

  return {
    ...update,
    candidates: update!.candidate,
  };
}

export { create, remove, getAll, getByCode, getById, votes, update };
