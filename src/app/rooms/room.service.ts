import prisma from '../../utils/database';
import generate from '../../utils/generate';
import validate from '../../utils/validate';
import { RoomEntity } from './room.entity';
import { CreateRoomsBody } from './room.types';
import { createRoomsValidation } from './room.validation';

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

export { create };
