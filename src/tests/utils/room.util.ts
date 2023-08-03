import prisma from '../../utils/database';
import generate from '../../utils/generate';
import { getUsers } from './user.util';

export async function deleteRooms() {
  const user = await getUsers();

  await prisma.room.deleteMany({
    where: {
      user_id: user?.id,
    },
  });
}

export async function getRooms() {
  const user = await getUsers();

  return prisma.room.findFirst({
    where: {
      user_id: user?.id,
    },
  });
}

export async function deleteCandidates() {
  const room = await getRooms();

  await prisma.candidate.deleteMany({
    where: {
      room_id: room?.id,
    },
  });
}

export async function createRooms() {
  const user = await getUsers();

  await prisma.room.create({
    data: {
      name: 'Create Room Test',
      start: 1690776168631,
      end: 1690776168631,
      code: generate(8),
      user_id: user!.id,
      candidate: {
        createMany: {
          data: [
            {
              name: 'Candidate Test 1',
            },
            {
              name: 'Candidate Test 2',
            },
          ],
        },
      },
    },
  });
}
