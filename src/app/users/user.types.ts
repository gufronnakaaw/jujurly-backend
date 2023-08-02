import { z } from 'zod';
import { RegisterValidation, LoginValidation } from './user.validation';

export type RegisterBody = z.infer<typeof RegisterValidation>;
export type LoginBody = z.infer<typeof LoginValidation>;
