import React from "react";
import { Dispatch } from "../types";

type Game = {
  id: string;
  name: string;
  avatar?: string;
};

type GameState = {
  games: Game[];
  current: number;
};

type GameAction =
  | { type: "set"; payload: Game[] }
  | { type: "moveCurrent"; payload: number };

type GameContextType = [GameState, Dispatch<GameAction>] | undefined;

const GameContext = React.createContext<GameContextType>(undefined);

const gameReducer = (state: GameState, action: GameAction) => {
  switch (action.type) {
    case "set":
      return {
        games: action.payload,
        current: 0,
      };
    case "moveCurrent": {
      const next = state.current + action.payload;
      return {
        ...state,
        current: next,
      };
    }
  }
};

export const GameProvider = ({ children }: any) => {
  const [state, dispatch] = React.useReducer(gameReducer, {
    games: [],
    current: 0,
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
