import React, { useCallback, useContext, useReducer } from "react";
import fetcher from "./fetcher";
import { AsyncStatus, Dispatch, Friend, User } from "./types";

type FriendsState = {
  data: Friend[];
  error: string;
  status: AsyncStatus;
};

type FriendAction =
  | { type: "setAll"; payload: Friend[] }
  | { type: "set"; payload: Friend }
  | { type: "remove"; payload: Friend };

type FriendAPI = {
  remove: (friend: Friend) => void;
  accept: (friend: Friend) => void;
  add: (user: User) => void;
  block: (user: Friend | User) => void;
};

type FriendsContextType =
  | [FriendsState, Dispatch<FriendAction>, FriendAPI]
  | undefined;
const FriendsContext = React.createContext<FriendsContextType>(undefined);

const friendsReducer = (state: FriendsState, action: FriendAction) => {
  switch (action.type) {
    case "setAll": {
      return {
        ...state,
        data: [...action.payload],
      };
    }
    case "set": {
      return {
        ...state,
        data: [
          ...state.data.filter((friend) => friend._id !== action.payload._id),
          action.payload,
        ],
      };
    }
    case "remove": {
      return {
        ...state,
        data: [
          ...state.data.filter((friend) => friend._id !== action.payload._id),
        ],
      };
    }
  }
};

export const FriendsProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(friendsReducer, {
    data: [],
    error: "",
    status: "success",
  });

  const api = {
    remove: async (friend: Friend) => {
      const { _id } = friend;
      const {} = await fetcher.POST_JSON("/friend/remove", { targetId: _id });
      // socket.emit("friend:remove", _id);
      dispatch({
        type: "remove",
        payload: state.data.find((friend) => friend._id === _id) as Friend,
      });
    },
    add: async (user: User) => {
      const { _id } = user;
      const res = await fetcher.POST_JSON("/friend/add", { targetId: _id });
      const { errors } = await res.json();
      if (!res.ok) return console.log(errors);
      // socket.emit("friend:add", _id);
      console.log("Friend request send to " + _id);
    },
    accept: async (friend: Friend) => {
      const { _id } = friend;
      // socket.emit("friend:accept", _id);
      await fetcher.POST_JSON("/friend/accept", { targetId: _id });
      dispatch({
        type: "set",
        payload: { ...friend, role: "friend" },
      });
    },
    block: async (user: User | Friend) => {
      const { _id } = user;
      await fetcher.POST_JSON("/friend/block", { targetId: _id });
      // socket.emit("friend:block", _id);
      dispatch({
        type: "set",
        payload: { ...user, role: "blocked", online: false },
      });
    },
  };

  return (
    <FriendsContext.Provider value={[state, dispatch, api]}>
      {children}
    </FriendsContext.Provider>
  );
};

export const useFriends = () => {
  const context = useContext(FriendsContext);
  if (context === undefined)
    throw new Error("useUser must be used inside UserProvider");
  return context;
};
