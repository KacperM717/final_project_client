import React, { FC } from "react";
import { useChats } from "../../contexts/chats.context";
import { ChatTile } from "./ChatTile";

export const ChatList: FC = () => {
  const [chatState, chatsDispatch] = useChats();
  const { chats, selected } = chatState;
  return (
    <div>
      <ul>
        {chats.length > 0
          ? chats.map(({ name, _id }) => (
              <li key={_id}>
                <ChatTile
                  onClick={() =>
                    chatsDispatch({ type: "selectChat", payload: _id })
                  }
                  unread={true}
                  name={name}
                  selected={_id === selected}
                />
              </li>
            ))
          : "No chats"}
      </ul>
    </div>
  );
};
