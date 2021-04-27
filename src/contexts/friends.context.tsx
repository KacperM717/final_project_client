import React, { useContext, useEffect, useReducer } from "react";
import fetcher from "../fetcher";
import { socket } from "../sockets";
import { AsyncStatus, Dispatch, Friend, User } from "../types";

type FriendsState = {
  data: Friend[];
  error: string;
  status: AsyncStatus;
};

type FriendAction =
  | { type: "setAll"; payload: Friend[] }
  | { type: "set"; payload: Friend }
  | { type: "setOnline"; payload: { _id: string; online: boolean } }
  | { type: "setManyOnline"; payload: { _ids: string[]; online: boolean } }
  | { type: "remove"; payload: string };

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
    case "setOnline": {
      return {
        ...state,
        data: state.data.map((friend) =>
          friend._id !== action.payload._id
            ? friend
            : { ...friend, online: action.payload.online }
        ),
      };
    }
    case "setManyOnline": {
      return {
        ...state,
        data: state.data.map((friend) =>
          action.payload._ids.includes(friend._id)
            ? { ...friend, online: action.payload.online }
            : friend
        ),
      };
    }
    case "remove": {
      return {
        ...state,
        data: [...state.data.filter((friend) => friend._id !== action.payload)],
      };
    }
  }
};

export const FriendsProvider = ({ children }: any) => {
  console.log("STATE PROVIDER FRIENDS");
  const [state, dispatch] = useReducer(friendsReducer, {
    data: [],
    error: "",
    status: "success",
  });

  // useFriendFetch
  useEffect(() => {
    (async () => {
      console.log("FRIENDS EFFECT THAT SHOULDNT EXECUTE TWICE");
      const res = await fetcher.BASE("/friend/list");
      const { body } = await res.json();
      if (!res.ok) return console.error("Error in Friends resource");
      socket.emit("friend:init", body.friends);
      dispatch({ type: "setAll", payload: body.friends });
    })();
  }, []);

  // Attach WS Listeners
  useEffect(() => {
    // THESE LISTENERS HAVE TO BE STATELESS - they have no access to fresh state (closure)
    socket.on("friend:online", (_ids: string[]) => {
      dispatch({ type: "setManyOnline", payload: { _ids, online: true } });
    });

    socket.on("friend:offline", (_id: string) => {
      dispatch({ type: "setOnline", payload: { _id, online: false } });
    });

    socket.on("friend:request", (user: User) => {
      dispatch({
        type: "set",
        payload: { ...user, role: "pending", online: false },
      });
    });

    socket.on("friend:accepted", (user: any) => {
      dispatch({ type: "set", payload: { ...user, online: true } });
    });

    socket.on("friend:blocked", (user: User) => {
      console.log("friend:blocked");
      dispatch({
        type: "set",
        payload: { ...user, role: "blocked", online: false },
      });
    });

    socket.on("friend:blocking", (_id: string) => {
      console.log("friend:blocking");
      dispatch({ type: "remove", payload: _id });
    });

    socket.on("friend:removed", (_id: string) => {
      console.log("friend:removed");
      dispatch({ type: "remove", payload: _id });
    });

    socket.on("friend:removing", (_id: string) => {
      console.log("friend:removing");
      dispatch({ type: "remove", payload: _id });
    });
    return () => {
      socket.off("friend:online");
      socket.off("friend:offline");
      socket.off("friend:request");
      socket.off("friend:accepted");
      socket.off("friend:blocked");
      socket.off("friend:blocking");
      socket.off("friend:removed");
      socket.off("friend:removing");
    };
  }, []);

  const api = {
    remove: async (friend: Friend) => {
      const { _id } = friend;
      await fetcher.POST_JSON("/friend/remove", { targetId: _id });
      // socket.emit("friend:remove", _id);
      // dispatch({
      //   type: "remove",
      //   payload: _id,
      // });
    },
    add: async (user: User) => {
      const { _id } = user;
      const res = await fetcher.POST_JSON("/friend/add", { targetId: _id });
      const { errors } = await res.json();
      if (!res.ok) return console.log(errors);
      // socket.emit("friend:add", _id);
    },
    accept: async (friend: Friend) => {
      const { _id } = friend;
      // socket.emit("friend:accept", _id);
      await fetcher.POST_JSON("/friend/accept", { targetId: _id });
      // dispatch({
      //   type: "set",
      //   payload: { ...friend, role: "friend" },
      // });
    },
    block: async (user: User | Friend) => {
      const { _id } = user;
      await fetcher.POST_JSON("/friend/block", { targetId: _id });
      // socket.emit("friend:block", _id);
      // dispatch({
      //   type: "set",
      //   payload: { ...user, role: "blocked", online: false },
      // });
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
