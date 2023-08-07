import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import AuthHandler from '../../handlers/AuthHandler';
import {
  CreateRoomsBody,
  DeleteRoomsBody,
  GetRoomsQuery,
  CreateVotesBody,
  UpdateRoomsBody,
} from './room.types';
import {
  create,
  remove,
  getAll,
  getByCode,
  getById,
  votes,
  update,
} from './room.service';
import {
  getAllSchema,
  getRoomsByCodeSchema,
  getRoomsByIdSchema,
  updateRoomsSchema,
} from './room.schema';

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
          const response = rep.serializeInput(
            {
              success: true,
              data: await getById(Number(id), userId),
            },
            getRoomsByIdSchema
          );

          return rep
            .code(200)
            .header('content-type', 'application/json')
            .send(response);
        }

        if (code) {
          const response = rep.serializeInput(
            {
              success: true,
              data: await getByCode(code),
            },
            getRoomsByCodeSchema
          );

          return rep
            .code(200)
            .header('content-type', 'application/json')
            .send(response);
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

  fastify.post(
    '/votes',
    async (
      req: FastifyRequest<{
        Body: CreateVotesBody;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const { id } = req.user as { id: number };

        await votes(req.body, id);

        return rep.code(201).send({
          success: true,
          data: {
            message: 'Vote candidate successfully',
          },
        });
      } catch (error) {
        rep.send(error);
      }
    }
  );

  fastify.patch(
    '/',
    async (
      req: FastifyRequest<{
        Body: UpdateRoomsBody;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const { id } = req.user as { id: number };

        const response = rep.serializeInput(
          {
            success: true,
            data: await update(req.body, id),
          },
          updateRoomsSchema
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
