import validate from '../../utils/validate';
import prisma from '../../utils/database';
import ResponseError from '../../error/ResponseError';
import type { LoginBody, RegisterBody } from './user.types';
import { LoginValidation, RegisterValidation } from './user.validation';
import { UserEntity } from './user.entity';
import { hash, verify } from '../../utils/password';

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

async function login(body: LoginBody) {
  const { email, password } = validate(LoginValidation, body);

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
    select: {
      id: true,
      password: true,
      fullname: true,
    },
  });

  if (!user) {
    throw new ResponseError(400, 'Email or password wrong');
  }

  if (!(await verify(password, user.password))) {
    throw new ResponseError(400, 'Email or password wrong');
  }

  return {
    id: user.id,
    fullname: user.fullname,
  };
}

export { register, login };
