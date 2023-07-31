import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import APIRoutes from './routes/index';

function server() {
  const server: FastifyInstance = fastify();
  const secret: string = String(process.env.JWT_SECRET_KEY);

  server.register(cors, {
    origin: '*',
  });

  server.register(jwt, {
    secret,
    sign: {
      expiresIn: '1h',
    },
  });

  server.register(APIRoutes, {
    prefix: 'api/v1',
  });

  return server;
}

export default server;
