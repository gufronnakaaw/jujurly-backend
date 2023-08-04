import { z } from 'zod';
import {
  createRoomsValidation,
  deleteRoomsValidation,
  getRoomsValidation,
} from './room.validation';

export type CreateRoomsBody = z.infer<typeof createRoomsValidation>;
export type DeleteRoomsBody = z.infer<typeof deleteRoomsValidation>;
export type GetRoomsQuery = z.infer<typeof getRoomsValidation>;
