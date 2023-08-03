import prisma from '../../utils/database';
import generate from '../../utils/generate';
import validate from '../../utils/validate';
import { CreateRoomsBody } from './room.types';
import { createRoomsValidation } from './room.validation';

async function create(body: CreateRoomsBody, userId: number) {
  const { name, start, end, candidates } = validate(
    createRoomsValidation,
    body
  );

  const room = await prisma.room.create({
    data: {
      name,
      start,
      end,
      user_id: userId,
      code: generate(8),
      candidate: {
        createMany: {
          data: candidates,
        },
      },
    },
    select: {
      id: true,
      code: true,
    },
  });

  return {
    id: room.id,
    name,
    start,
    end,
    code: room.code,
    candidates,
  };
}

export { create };
