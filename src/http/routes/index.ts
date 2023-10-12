import { FastifyInstance } from 'fastify';
import ErrorHandler from '../../handlers/ErrorHandler';
import UserRoutes from '../../app/users/user.route';
import RoomRoutes from '../../app/rooms/room.route';
import AdminRoutes from '../../app/admin/admin.route';

export default async function routes(fastify: FastifyInstance) {
  fastify.register(UserRoutes, { prefix: 'users' });
  fastify.register(RoomRoutes, { prefix: 'rooms' });
  fastify.register(AdminRoutes, { prefix: 'admin' });
  fastify.setErrorHandler(ErrorHandler);
}
