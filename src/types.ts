export type User = {
  _id: string;
  name: string;
};

export type FriendRole = "pending" | "friend" | "blocked";

export type Friend = User & {
  role: FriendRole;
  online: boolean;
};

export type AsyncStatus = "loading" | "success" | "error";

export type AsyncAction<T> =
  | { type: "success"; payload: T | null }
  | { type: "loading" }
  | { type: "error"; payload: string };

export type Dispatch<T> = (actions: T) => void;
