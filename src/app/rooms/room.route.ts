import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import AuthHandler from '../../handlers/AuthHandler';
import { CreateRoomsBody, DeleteRoomsBody } from './room.types';
import { create, remove } from './room.service';

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

  fastify.delete(
    '/',
    async (
      req: FastifyRequest<{
        Body: DeleteRoomsBody;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const { id } = req.user as { id: number };
        await remove(req.body, id);

        return rep.code(200).send({
          success: true,
          data: {
            message: 'Delete room successfully',
          },
        });
      } catch (error) {
        rep.send(error);
      }
    }
  );
}
