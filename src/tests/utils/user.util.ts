import prisma from '../../utils/database';

export async function removeUsers() {
  await prisma.user.deleteMany({
    where: {
      email: 'testing@mail.com',
    },
  });
}
