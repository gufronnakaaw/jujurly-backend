import { ZodSchema } from 'zod';

export default function validate<T>(schema: ZodSchema<T>, data: any) {
  return schema.parse(data);
}
