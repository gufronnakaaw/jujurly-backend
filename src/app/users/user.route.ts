import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { register, login } from './user.service';
import type { RegisterBody, LoginBody } from './user.types';

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

  fastify.post(
    '/login',
    async (req: FastifyRequest<{ Body: LoginBody }>, rep: FastifyReply) => {
      try {
        const data = await login(req.body);

        return rep.code(200).send({
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
