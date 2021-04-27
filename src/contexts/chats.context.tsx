import React, { useContext, useEffect } from "react";
import fetcher from "../fetcher";
import { socket } from "../sockets";
import { Chat, Dispatch, Message, User } from "../types";

type ChatState = {
  chats: Chat[];
  selected: string | null;
};

type ChatAction =
  | { type: "set"; payload: Chat[] }
  | { type: "addChat"; payload: Chat }
  | { type: "addMessage"; payload: { chatId: string; message: Message } }
  | { type: "addMember"; payload: { chatId: string; member: User } }
  | { type: "deleteMember"; payload: { chatId: string; userId: string } }
  | { type: "deleteChat"; payload: string }
  | { type: "selectChat"; payload: string };

type ChatContextType = [ChatState, Dispatch<ChatAction>] | undefined;

const chatReducer = (state: ChatState, action: ChatAction) => {
  switch (action.type) {
    case "set":
      return { chats: action.payload, selected: null };
    case "addChat":
      return {
        ...state,
        chats: [...state.chats, action.payload],
      };
    case "deleteChat":
      return {
        ...state,
        chats: state.chats.filter((chat) => chat._id !== action.payload),
      };
    case "addMember":
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat._id === action.payload.chatId
            ? { ...chat, members: [...chat.members, action.payload.member] }
            : chat
        ),
      };
    case "deleteMember":
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat._id === action.payload.chatId
            ? {
                ...chat,
                members: chat.members.filter(
                  (member) => member._id !== action.payload.userId
                ),
              }
            : chat
        ),
      };
    case "selectChat":
      return {
        ...state,
        selected: action.payload,
      };
    case "addMessage": {
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat._id === action.payload.chatId
            ? {
                ...chat,
                messages: [...chat.messages, action.payload.message],
              }
            : chat
        ),
      };
    }
  }
};

const ChatContext = React.createContext<ChatContextType>(undefined);
export const ChatsProvider = ({ children }: any) => {
  const [state, dispatch] = React.useReducer(chatReducer, {
    chats: [],
    selected: null,
  });
  useEffect(() => {
    (async () => {
      console.log("CHATS EFFECT THAT SHOULDNT EXECUTE TWICE");
      const res = await fetcher.BASE("/chat/");
      const { msg, body, errors } = await res.json();
      if (!res.ok) return console.log(errors);
      dispatch({ type: "set", payload: body });
      socket.emit("chat:init", body);
    })();
  }, []);

  return (
    <ChatContext.Provider value={[state, dispatch]}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChats = () => {
  const context = useContext(ChatContext);
  if (context === undefined)
    throw new Error("useUser must be used inside UserProvider");
  return context;
};
