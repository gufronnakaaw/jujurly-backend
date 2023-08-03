import { z } from 'zod';
import { createRoomsValidation } from './room.validation';

export type CreateRoomsBody = z.infer<typeof createRoomsValidation>;
