import React, { FC } from "react";
import { useChats } from "../../contexts/chats.context";
import { ChatTile } from "./ChatTile";

export const ChatList: FC = () => {
  const [chatState, chatsDispatch] = useChats();
  const { chats, selected, unread } = chatState;
  console.log(unread, selected);
  return (
    <div>
      {chats.length > 0
        ? chats.map(({ name, _id }) => {
            const notSeen =
              selected === _id
                ? 0
                : unread.reduce((sum, id) => (sum += id === _id ? 1 : 0), 0);
            return (
              <ChatTile
                key={_id}
                onClick={() =>
                  chatsDispatch({
                    type: "selectChat",
                    payload: _id !== selected ? _id : "",
                  })
                }
                unread={notSeen}
                name={name}
                selected={_id === selected}
              />
            );
          })
        : "No chats"}
    </div>
  );
};
