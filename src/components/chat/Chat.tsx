import React, { useState } from "react";
import { useChats } from "../../contexts/chats.context";
import { socket } from "../../sockets";

export const Chat = () => {
  const [chatState] = useChats();
  const [text, setText] = useState("");

  const chat = chatState.chats.find((chat) => chat._id === chatState.selected);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleSend = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("sending", text);
    const chatId = chat?._id;
    if (!chatId || text === "") return console.log("Cannot send");
    socket.emit("chat:send", { chatId, msg: text });
  };

  return (
    <>
      {chat ? (
        <div>
          <div>
            <p>{chat?.name}</p>
          </div>
          <div>
            {chat?.messages.map((msg) => (
              <p key={msg._id}>
                {msg.text}{" "}
                <small>
                  {msg.author.name} at {msg.createdAt}
                </small>
              </p>
            ))}
          </div>
          <div>
            <input type="text" value={text} onChange={handleTextChange} />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      ) : (
        "No chat chosen"
      )}
    </>
  );
};
