import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import ResponseError from '../error/ResponseError';

export default function ErrorHandler(
  error: FastifyError,
  req: FastifyRequest,
  rep: FastifyReply
) {
  if (error instanceof ResponseError) {
    return rep.code(error.code).send({
      success: false,
      errors: [
        {
          message: error.message,
        },
      ],
    });
  }

  if (error instanceof ZodError) {
    const errors = error.issues.map((element) => {
      return {
        field: element.path[0],
        message: element.message,
      };
    });

    return rep.code(400).send({
      success: false,
      errors,
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return rep.code(500).send({
      success: false,
      errors: [
        {
          code: error.code,
          field: error.meta?.target,
          message: error.message,
        },
      ],
    });
  }

  return rep.code(500).send({
    success: false,
    errors: [error],
  });
}
