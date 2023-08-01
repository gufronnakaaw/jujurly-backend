import { FastifyInstance } from 'fastify';
import ErrorHandler from '../../handlers/ErrorHandler';

export default async function routes(fastify: FastifyInstance) {
  fastify.setErrorHandler(ErrorHandler);
}
