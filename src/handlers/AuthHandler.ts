import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import ResponseError from '../error/ResponseError';

export default async function AuthHandler(
  req: FastifyRequest,
  rep: FastifyReply,
  done: HookHandlerDoneFunction
) {
  try {
    const { id }: { id: number } = await req.jwtVerify();

    req.user = { id };

    done();
  } catch (error) {
    throw new ResponseError(401, 'Unauthorized');
  }
}
