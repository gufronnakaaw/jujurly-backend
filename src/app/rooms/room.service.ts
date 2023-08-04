import ResponseError from '../../error/ResponseError';
import prisma from '../../utils/database';
import generate from '../../utils/generate';
import validate from '../../utils/validate';
import { RoomEntity } from './room.entity';
import { CreateRoomsBody, DeleteRoomsBody } from './room.types';
import {
  createRoomsValidation,
  deleteRoomsValidation,
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

export { create, remove, getAll };
