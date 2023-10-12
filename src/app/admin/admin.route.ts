import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  getDashboard,
  getUsers,
  getRooms,
  getLogs,
  removeUsers,
  removeRooms,
  login,
} from './admin.service';
import APITokenHandler from '../../handlers/APITokenHandler';
import { LoginBody } from './admin.types';

export default async function routes(fastify: FastifyInstance) {
  fastify.post(
    '/login',
    async (
      req: FastifyRequest<{
        Body: LoginBody;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = await login(req.body, req.headers['user-agent']);

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

  fastify.get(
    '/dashboard',
    {
      preHandler: APITokenHandler,
    },
    async (req: FastifyRequest, rep: FastifyReply) => {
      try {
        const dashboard = await getDashboard();

        rep.code(200).send({
          success: true,
          data: dashboard,
        });
      } catch (error) {
        rep.send(error);
      }
    }
  );

  fastify.get(
    '/users',
    {
      preHandler: APITokenHandler,
    },
    async (req: FastifyRequest, rep: FastifyReply) => {
      try {
        const users = await getUsers();

        rep.code(200).send({
          success: true,
          data: users,
        });
      } catch (error) {
        rep.send(error);
      }
    }
  );

  fastify.delete(
    '/users',
    {
      preHandler: APITokenHandler,
    },
    async (req: FastifyRequest, rep: FastifyReply) => {
      try {
        const { user_id } = req.body as { user_id: number };

        await removeUsers(user_id);

        rep.code(200).send({
          success: true,
          message: 'delete user successfully',
        });
      } catch (error) {
        rep.send(error);
      }
    }
  );

  fastify.get(
    '/rooms',
    {
      preHandler: APITokenHandler,
    },
    async (req: FastifyRequest, rep: FastifyReply) => {
      try {
        const rooms = await getRooms();

        rep.code(200).send({
          success: true,
          data: rooms,
        });
      } catch (error) {
        rep.send(error);
      }
    }
  );

  fastify.delete(
    '/rooms',
    {
      preHandler: APITokenHandler,
    },
    async (req: FastifyRequest, rep: FastifyReply) => {
      try {
        const { room_id } = req.body as { room_id: number };

        await removeRooms(room_id);

        rep.code(200).send({
          success: true,
          message: 'delete rooms successfully',
        });
      } catch (error) {
        rep.send(error);
      }
    }
  );

  fastify.get(
    '/logs',
    {
      preHandler: APITokenHandler,
    },
    async (req: FastifyRequest, rep: FastifyReply) => {
      try {
        const logs = await getLogs();

        rep.code(200).send({
          success: true,
          data: logs,
        });
      } catch (error) {
        rep.send(error);
      }
    }
  );
}
