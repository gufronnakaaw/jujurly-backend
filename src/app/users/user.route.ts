import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { register } from './user.service';
import type { RegisterBody } from './user.types';

export default async function routes(fastify: FastifyInstance) {
  fastify.post(
    '/register',
    async (req: FastifyRequest<{ Body: RegisterBody }>, rep: FastifyReply) => {
      try {
        const data = await register(req.body);

        return rep.code(201).send({
          success: true,
          data: {
            token: await rep.jwtSign(data),
          },
        });
      } catch (error) {
        rep.send(error);
      }
    }
  );
}
