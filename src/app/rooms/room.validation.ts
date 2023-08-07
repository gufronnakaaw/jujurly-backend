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

const deleteRoomsValidation = z.object({
  room_id: z.number().positive(),
  code: z.string().min(8),
});

const getRoomsValidation = z.object({
  id: z.number().positive().optional(),
  code: z.string().max(8).optional(),
});

const createVotesValidation = z.object({
  room_id: z.number().positive(),
  code: z.string().min(8),
  candidate: z.object({
    id: z.number().positive(),
  }),
});

export {
  createRoomsValidation,
  deleteRoomsValidation,
  getRoomsValidation,
  createVotesValidation,
};
