import { z } from 'zod';

const createRoomsValidation = z.object({
  name: z.string().min(1),
  start: z.number().positive(),
  end: z.number().positive(),
  candidates: z
    .array(
      z.object({
        name: z.string(),
      })
    )
    .min(2),
});

export { createRoomsValidation };
