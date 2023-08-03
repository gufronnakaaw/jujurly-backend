import { FastifyRequest, FastifyReply } from 'fastify';
import ResponseError from '../error/ResponseError';

export default async function AuthHandler(
  req: FastifyRequest,
  rep: FastifyReply
) {
  try {
    const { id }: { id: number } = await req.jwtVerify();

    req.user = { id };
  } catch (error) {
    throw new ResponseError(401, 'Unauthorized');
  }
}
