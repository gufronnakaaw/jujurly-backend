import { z } from 'zod';
import { RegisterValidation } from './user.validation';

export type RegisterBody = z.infer<typeof RegisterValidation>;
