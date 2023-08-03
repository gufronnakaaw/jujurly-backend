import { z } from 'zod';
import {
  createRoomsValidation,
  deleteRoomsValidation,
} from './room.validation';

export type CreateRoomsBody = z.infer<typeof createRoomsValidation>;
export type DeleteRoomsBody = z.infer<typeof deleteRoomsValidation>;
