import { config } from 'dotenv';
import logger from './utils/logger';
import server from './http/server';

config();

async function app() {
  const port: number = Number(process.env.PORT);
  const fastifyServer = server();

  try {
    await fastifyServer.listen({ port });
    logger.info(`server is running at http://localhost:${port}`);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}

app();
