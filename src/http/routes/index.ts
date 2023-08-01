import { FastifyInstance } from 'fastify';
import ErrorHandler from '../../handlers/ErrorHandler';
import UserRoutes from '../../app/users/user.route';

export default async function routes(fastify: FastifyInstance) {
  fastify.register(UserRoutes, { prefix: 'users' });
  fastify.setErrorHandler(ErrorHandler);
}
