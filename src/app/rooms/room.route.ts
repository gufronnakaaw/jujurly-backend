import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import AuthHandler from '../../handlers/AuthHandler';
import { CreateRoomsBody, DeleteRoomsBody, GetRoomsQuery } from './room.types';
import { create, remove, getAll } from './room.service';
import { getAllSchema } from './room.schema';

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

  fastify.get(
    '/',
    async (
      req: FastifyRequest<{
        Querystring: GetRoomsQuery;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const { id: userId } = req.user as { id: number };
        const { id, code } = req.query;

        if (id) {
          // soon
        }

        if (code) {
          // soon
        }

        const response = rep.serializeInput(
          {
            success: true,
            data: await getAll(userId),
          },
          getAllSchema
        );

        return rep
          .code(200)
          .header('content-type', 'application/json')
          .send(response);
      } catch (error) {
        rep.send(error);
      }
    }
  );
}
