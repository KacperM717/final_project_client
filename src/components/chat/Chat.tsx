import React, { useRef, useState, useEffect } from "react";
import { useChats } from "../../contexts/chats.context";
import { useUser } from "../../contexts/user.context";
import fetcher from "../../fetcher";
import { socket } from "../../sockets";
import { Avatar } from "../utils/Avatar";
import { ChatMessage } from "./ChatMessage";

export const Chat = () => {
  const [user] = useUser();
  const [chatState, chatsDispatch] = useChats();
  const [text, setText] = useState("");
  const dummyRef = useRef<HTMLDivElement>(null);

  const chat = chatState.chats.find((chat) => chat._id === chatState.selected);

  useEffect(() => {
    if (dummyRef.current) dummyRef.current.scrollIntoView();
  }, [dummyRef, chat]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleSend = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("sending", text);
    const chatId = chat?._id;
    if (!chatId || text === "") return console.log("Cannot send");
    socket.emit("chat:send", { chatId, msg: text });
    setText("");
  };

  const handleLeave = () => {
    fetcher.POST_JSON("/chat/leave", {
      chatId: chat?._id,
      userId: user.user?._id,
    });
    socket.emit("chat:leaving", chat?._id);
    chatsDispatch({ type: "deleteChat", payload: chat?._id ?? "" });
  };

  return (
    <div className={"chat_box"}>
      <div className={"chat_heading"}>
        {chat ? (
          <>
            <span>{chat?.name}</span>
            <div>
              {chat?.members.map(({ avatar, name }, i) => (
                <div
                  key={avatar}
                  title={name}
                  className={"avatar"}
                  style={{
                    position: "relative",
                    left: `${i * -20}px`,
                    transform: "scale(0.5)",
                    display: "inline-block",
                  }}
                >
                  <img src={avatar} alt={`List of members of chat`} />
                </div>
              ))}
            </div>
            <div className={"chat_menu"}>
              {chat?.closed ? (
                <span title="This chat is locked">&#128274;</span>
              ) : null}
              <span onClick={handleLeave} title="Leave this chat">
                🚪
              </span>
            </div>
          </>
        ) : null}
      </div>
      <div className={"chat_message_box"}>
        {chat?.messages.reverse().map((msg) => {
          const owner = msg.author._id === user.user?._id;
          console.log("owner", owner);
          return (
            <div
              key={msg._id}
              className={`chat_message ${owner ? "owner" : ""}`}
            >
              <ChatMessage message={msg} />
            </div>
          );
        })}
        <div className="dummy" ref={dummyRef}></div>
      </div>
      <form className={"chat_form"}>
        <input type="text" value={text} onChange={handleTextChange} />
        <button onClick={handleSend}>&rarr;</button>
      </form>
    </div>
  );
};
