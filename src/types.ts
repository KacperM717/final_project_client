export type User = {
  _id: string;
  name: string;
  avatar: string;
};

export type Message = {
  _id: string;
  createdAt: string;
  text: string;
  author: User;
};

export type Chat = {
  _id: string;
  name: string;
  members: User[];
  messages: Message[];
  closed: boolean;
};

export type FriendRole = "pending" | "friend" | "blocked";

export type Call = "pending" | "connected" | "connecting" | "none";

export type Friend = User & {
  role: FriendRole;
  online: boolean;
  call?: Call;
};

export type AsyncStatus = "loading" | "success" | "error";

export type AsyncAction<T> =
  | { type: "success"; payload: T | null }
  | { type: "loading" }
  | { type: "error"; payload: string };

export type Dispatch<T> = (actions: T) => void;
