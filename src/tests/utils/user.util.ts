import prisma from '../../utils/database';
import { hash } from '../../utils/password';

export async function removeUsers() {
  await prisma.user.deleteMany({
    where: {
      email: 'testing@mail.com',
    },
  });
}

export async function createUsers() {
  await prisma.user.create({
    data: {
      email: 'testing@mail.com',
      fullname: 'Testing',
      password: await hash('testing123'),
    },
  });
}
