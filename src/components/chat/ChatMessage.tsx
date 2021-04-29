import React, { FC } from "react";
import { Message } from "../../types";
import { Avatar } from "../utils/Avatar";

export const ChatMessage: FC<{ message: Message }> = ({ message }) => {
  const { text, createdAt, author } = message;

  const created = new Date(createdAt);
  const formatted =
    created.toDateString() === new Date().toDateString()
      ? `${created.toLocaleTimeString()}`
      : `${created.toLocaleTimeString()}, ${created.toLocaleDateString()}`;
  return (
    <>
      <div className={"chat_message_text"}>{text}</div>
      <div className={"chat_message_meta"}>
        <Avatar avatar={author.avatar} name={author.name}>
          {" "}
          <small>{formatted}</small>
        </Avatar>
      </div>
    </>
  );
};
