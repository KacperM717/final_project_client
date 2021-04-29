import React, { useContext, useReducer, useEffect, useCallback } from "react";
import fetcher from "../fetcher";
import { AsyncStatus, User } from "../types";

export type AuthUser = User & { token: string };

type UserState = {
  user: AuthUser | null;
  error: string;
  status: AsyncStatus;
};

type UserAction =
  | { type: "set"; payload: AuthUser | null }
  | { type: "loading" }
  | { type: "error"; payload: string };
type UserDispatch = (actions: UserAction) => void;

type UserContextT = [UserState, UserDispatch] | undefined;

const UserContext = React.createContext<UserContextT>(undefined);

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case "set": {
      return {
        user: action.payload ? { ...action.payload } : null,
        status: "success",
        error: "",
      };
    }
    case "loading": {
      return { ...state, status: "loading" };
    }
    case "error": {
      return { error: action.payload, status: "error", user: null };
    }
    default:
      return { ...state };
  }
};

export const UserProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(userReducer, {
    user: null,
    error: "",
    status: "success",
  });

  const initUserContext = useCallback(async () => {
    dispatch({ type: "loading" });
    const res = await fetcher.BASE("/auth/token");
    const data = await res.json();
    if (!res.ok) return dispatch({ type: "set", payload: null });
    dispatch({ type: "set", payload: data.body });
    console.log(data.body);
  }, []);

  useEffect(() => {
    initUserContext();
  }, [initUserContext]);

  return (
    <UserContext.Provider value={[state, dispatch]}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined)
    throw new Error("useUser must be used inside UserProvider");
  return context;
};
