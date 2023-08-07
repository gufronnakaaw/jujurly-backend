import { z } from 'zod';
import {
  createRoomsValidation,
  deleteRoomsValidation,
  getRoomsValidation,
  createVotesValidation,
} from './room.validation';

export type CreateRoomsBody = z.infer<typeof createRoomsValidation>;
export type DeleteRoomsBody = z.infer<typeof deleteRoomsValidation>;
export type GetRoomsQuery = z.infer<typeof getRoomsValidation>;

export type GetRoomsRawQuery = {
  id: string;
  name: string;
  vote_count: number;
  percentage: number;
};

export type CreateVotesBody = z.infer<typeof createVotesValidation>;
