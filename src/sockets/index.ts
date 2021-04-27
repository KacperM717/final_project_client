import { Manager } from "socket.io-client";

const WS_URI = "ws://localhost:5000";

const io = () => {
  const manager = new Manager(WS_URI, { auth: true, autoConnect: false });
  const socket = manager.socket("/");

  return socket;
};

export const socket = io();
