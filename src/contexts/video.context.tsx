import React, { useContext, useReducer } from "react";
import { Dispatch, User } from "../types";

type VideoState = {
  user: User | null;
  peer: string | null;
  status: "calling" | "pending" | "none" | "cancelled";
};

type VideoAction =
  | { type: "setPeer"; payload: string }
  | { type: "call"; payload: User }
  | { type: "reset" }
  | { type: "pending"; payload: User }
  | { type: "cancelled" };

type VideoContextType = [VideoState, Dispatch<VideoAction>] | undefined;

const VideoContext = React.createContext<VideoContextType>(undefined);

const videoReducer = (state: VideoState, action: VideoAction): VideoState => {
  switch (action.type) {
    case "call":
      return {
        ...state,
        status: "calling",
        user: action.payload,
      };
    case "setPeer":
      return {
        ...state,
        peer: action.payload,
        status: "calling",
      };
    case "reset":
      return {
        user: null,
        peer: null,
        status: "none",
      };
    case "pending":
      return {
        user: action.payload,
        peer: null,
        status: "pending",
      };
    case "cancelled":
      return {
        ...state,
        peer: null,
        status: "cancelled",
      };
  }
};

export const VideoProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(videoReducer, {
    user: null,
    peer: null,
    status: "none",
  });

  return (
    <VideoContext.Provider value={[state, dispatch]}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (context === undefined)
    throw new Error("useUser must be used inside UserProvider");
  return context;
};
