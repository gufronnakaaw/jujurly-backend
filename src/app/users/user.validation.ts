import { z } from 'zod';

const RegisterValidation = z.object({
  email: z.string().email().min(1).max(255).trim(),
  fullname: z.string().min(1).max(255).trim(),
  password: z.string().min(1).max(255),
});

export { RegisterValidation };
