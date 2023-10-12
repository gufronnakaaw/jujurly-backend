import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import ResponseError from '../error/ResponseError';
import prisma from '../utils/database';

export default async function APITokenHandler(
  req: FastifyRequest<{
    Headers: {
      api_token: string;
    };
  }>,
  rep: FastifyReply,
  done: HookHandlerDoneFunction
) {
  const { api_token } = req.headers;

  if (!api_token) {
    throw new ResponseError(401, 'Unauthorized');
  }

  const token = await prisma.token.findFirst({
    where: {
      value: api_token,
    },
  });

  if (!token) {
    throw new ResponseError(401, 'Unauthorized');
  }

  if (Date.now() > token.expired) {
    throw new ResponseError(401, 'Unauthorized');
  }

  done();
}
