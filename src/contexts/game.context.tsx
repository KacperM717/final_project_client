import React from "react";
import { Dispatch } from "../types";

export type GameStatus = "queue" | "playing" | "none";

export type Game = {
  id: string;
  name: string;
  avatar?: string;
  description?: string;
};

export type GameState = {
  games: Game[];
  current: number;
  status: string;
};

type GameAction =
  | { type: "set"; payload: Game[] }
  | { type: "moveCurrent"; payload: number }
  | { type: "start" }
  | { type: "join_queue" }
  | { type: "leave_queue" }
  | { type: "end" };

type GameContextType = [GameState, Dispatch<GameAction>] | undefined;

const GameContext = React.createContext<GameContextType>(undefined);

const gameReducer = (state: GameState, action: GameAction) => {
  switch (action.type) {
    case "set":
      return {
        games: action.payload,
        current: 0,
        status: "none",
      };
    case "moveCurrent": {
      const next =
        (state.games.length + state.current + action.payload) %
        state.games.length;
      return {
        ...state,
        current: next,
      };
    }
    case "join_queue": {
      return {
        ...state,
        status: "queue",
      };
    }
    case "leave_queue": {
      return {
        ...state,
        status: "none",
      };
    }
    case "start": {
      return { ...state, status: "playing" };
    }
    case "end": {
      return { ...state, status: "none" };
    }
  }
};

export const gameList: Game[] = [
  {
    id: "dino",
    name: "dino",
    description: `Internet issues? Happened to all of us (: Copy of well known Google t-rex game. \n Click to jump and try to avoid as many obstacles as you can in order to win!`,
  },
  // { id: "jelly", name: "Jelly" },
  // { id: "cars", name: "Cars" },
];

export const GameProvider = ({ children }: any) => {
  const [state, dispatch] = React.useReducer(gameReducer, {
    games: gameList,
    current: 0,
    status: "none",
  });

  return (
    <GameContext.Provider value={[state, dispatch]}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = React.useContext(GameContext);
  if (context === undefined)
    throw new Error("useGame must be used inside GameProvider");
  return context;
};
