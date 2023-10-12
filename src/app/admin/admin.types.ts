type RoomType = {
  id: number;
  name: string;
  start: bigint;
  end: bigint;
  code: string;
  candidate?: {
    id: number;
    name: string;
  }[];
  user?: {
    fullname: string;
  };
  created_at: Date;
  owner?: string;
  candidates?:
    | {
        id: number;
        name: string;
      }[]
    | undefined;
};

type LoginBody = {
  username: string;
  password: string;
};

export { RoomType, LoginBody };
