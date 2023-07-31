import { PrismaClient } from '@prisma/client';
import logger from './logger';

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
});

prisma.$on('error', (e) => {
  logger.error(e);
});

prisma.$on('warn', (e) => {
  logger.warn(e);
});

prisma.$on('info', ({ message, timestamp }) => {
  logger.info({
    message,
    timestamp,
  });
});

export default prisma;
