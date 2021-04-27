import React, { FC, useEffect } from "react";
import { socket } from ".";
import { useChats } from "../contexts/chats.context";
import fetcher from "../fetcher";
import { Message, User } from "../types";

export const ChatSockets: FC = ({ children }) => {
  const [state, dispatch] = useChats();

  useEffect(() => {
    socket.on("chat:add", async (chatId: string) => {
      console.log("on:chat:add");
      const res = await fetcher.BASE(`/chat/${chatId}`);
      const { msg, body, errors } = await res.json();
      if (!res.ok) return console.log(errors.toString());
      socket.emit("chat:added", body);
      dispatch({ type: "addChat", payload: body });
      console.log(msg);
    });
    socket.on(
      "chat:user_left",
      ({ chatId, userId }: { chatId: string; userId: string }) => {
        console.log("User", userId, " left chat ", chatId);
        dispatch({ type: "deleteMember", payload: { chatId, userId } });
      }
    );
    socket.on(
      "chat:user_joined",
      ({ chatId, user }: { chatId: string; user: User }) => {
        console.log(`User ${user.name} added to chat ${chatId}`);
        dispatch({ type: "addMember", payload: { chatId, member: user } });
      }
    );
    socket.on(
      "chat:receive",
      ({ chatId, message }: { chatId: string; message: Message }) => {
        console.log("Message received", chatId, message);
        dispatch({ type: "addMessage", payload: { chatId, message } });
      }
    );

    return () => {
      socket.off("chat:add");
      socket.off("chat:user_left");
      socket.off("chat:user_joined");
      socket.off("chat:receive");
    };
  }, [state, dispatch]);

  return <>{children}</>;
};
