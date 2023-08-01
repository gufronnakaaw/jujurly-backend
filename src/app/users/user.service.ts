import validate from '../../utils/validate';
import prisma from '../../utils/database';
import ResponseError from '../../error/ResponseError';
import type { RegisterBody } from './user.types';
import { RegisterValidation } from './user.validation';
import { UserEntity } from './user.entity';
import { hash } from '../../utils/password';

async function register(body: RegisterBody) {
  const { email, fullname, password } = validate(RegisterValidation, body);

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (user) {
    throw new ResponseError(400, 'Email already exists');
  }

  const data: UserEntity = {
    email,
    fullname,
    password: await hash(password),
  };

  const create = await prisma.user.create({
    data,
    select: {
      id: true,
    },
  });

  return {
    id: create.id,
    fullname,
  };
}

export { register };
