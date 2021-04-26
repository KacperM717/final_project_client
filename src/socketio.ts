import { Manager } from "socket.io-client";
import { User } from "./types";

const WS_URI = "ws://localhost:5000";

const io = () => {
  const manager = new Manager(WS_URI, { auth: true, autoConnect: false });
  const socket = manager.socket("/");

  socket.on("friend:online", (id: string) =>
    console.log(`Your friend is now online: ${id}`)
  );

  socket.on("friend:request", (user: User) =>
    console.log(`${user.name} sent request to you`)
  );

  return socket;
};

export const socket = io();
