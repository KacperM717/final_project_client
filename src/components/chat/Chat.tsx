import React, { useState } from "react";
import { useUser } from "../../user.context";

export const Chat = ({ chat }: { chat: any }) => {
  // const [chat, charDispatch] = useChat();
  const [user, userDispatch] = useUser();
  const [text, setText] = useState("");

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleSend = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Sending");
  };

  return (
    <div>
      <div>
        <p>{chat.name}</p>
      </div>
      <div>
        {chat.messages.map((msg: any) => {
          const author =
            chat.members.find((user: any) => user._id === msg.author) ??
            "Hidden";
          return (
            <p>
              <span>{author}: </span>
              {msg.text}
            </p>
          );
        })}
      </div>
      <div>
        <input type="text" value={text} onChange={handleTextChange} />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};
