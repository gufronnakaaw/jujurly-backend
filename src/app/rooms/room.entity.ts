export interface RoomEntity {
  id?: number;
  name: string;
  start: number;
  end: number;
  code: string;
  user_id: number;
  created_at?: Date;
}
