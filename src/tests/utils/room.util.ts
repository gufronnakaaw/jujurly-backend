import prisma from '../../utils/database';
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
