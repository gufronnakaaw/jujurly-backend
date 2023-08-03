import { FastifyInstance } from 'fastify';
import ErrorHandler from '../../handlers/ErrorHandler';
import UserRoutes from '../../app/users/user.route';
import RoomRoutes from '../../app/rooms/room.route';

export default async function routes(fastify: FastifyInstance) {
  fastify.register(UserRoutes, { prefix: 'users' });
  fastify.register(RoomRoutes, { prefix: 'rooms' });
  fastify.setErrorHandler(ErrorHandler);
}
