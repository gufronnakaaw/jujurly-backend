import { z } from 'zod';

const deleteUsersValidation = z.object({
  user_id: z.number().positive(),
});

const deleteRoomsValidation = z.object({
  room_id: z.number().positive(),
});

const loginAdminValidation = z.object({
  username: z.string().trim().nonempty(),
  password: z.string().trim().nonempty(),
});

export { deleteUsersValidation, deleteRoomsValidation, loginAdminValidation };
