export interface UserEntity {
  id?: number;
  email: string;
  fullname: string;
  password: string;
  created_at?: Date;
}
