import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import AuthHandler from '../../handlers/AuthHandler';
import { CreateRoomsBody } from './room.types';
import { create } from './room.service';

export default async function routes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', AuthHandler);

  fastify.post(
    '/',
    async (
      req: FastifyRequest<{
        Body: CreateRoomsBody;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const { id } = req.user as { id: number };

        const data = await create(req.body, id);
        return rep.code(201).send({
          success: true,
          data,
        });
      } catch (error) {
        rep.send(error);
      }
    }
  );
}
