import React, { useEffect, useState } from "react";
import { useGame } from "../../contexts/game.context";
import { socket } from "../../sockets";
import { User } from "../../types";
import { Avatar } from "../utils/Avatar";

export const Typeringo = () => {
  const [message, setMessage] = useState("");
  const [game, gameDispatch] = useGame();
  const [state, setState] = useState<{
    message: string;
    players: any[];
  } | null>(null);
  const [winner, setWinner] = useState<User | null>(null);
  const [time, setTime] = useState(0);
  const [gameReady, setGameReady] = useState(false);

  useEffect(() => {
    socket.on(
      "game:typeringo:tick",
      (state: { message: string; players: any[] }) => {
        setState(state);
        setMessage("");
        setWinner(null);
      }
    );
    socket.on(
      "game:typeringo:user_message",
      (playerId: string, message: string) => {
        setState((old) => {
          if (!state) return null;
          return {
            message: old!.message,
            players: old!.players.map((player) =>
              player.user._id === playerId ? { ...player, message } : player
            ),
          };
        });
      }
    );
    socket.on("game:typeringo:winner", (player: User, time: number) => {
      setWinner(player);
      setTime(time);
    });
    socket.on("game:typeringo:end", (roomId: string) => {
      gameDispatch({ type: "end" });
    });
    return () => {
      socket.off("game:typeringo:tick");
      socket.off("game:typeringo:user_message");
      socket.off("game:typeringo:winner");
      socket.off("game:typeringo:end");
    };
  }, []);

  const handleReady = () => {
    socket.emit("game:ready");
    setGameReady(true);
  };

  const handleLeave = () => {
    socket.emit("game:leave");
    socket.emit("game:ended", game.games[game.current].id);
    gameDispatch({ type: "end" });
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    console.log("sseidng messagae");
    socket.emit("game:typeringo:message", e.target.value);
  };

  return (
    <div className={"game_wrapper"}>
      <div className={"game_menu"}>
        {!gameReady ? <button onClick={handleReady}>Ready</button> : null}
        <button onClick={handleLeave}>Leave</button>
      </div>
      <div className={"game_score"}>
        {state?.players.map((player: any) => (
          <p key={player.user._id}>
            <Avatar avatar={player.user.avatar}>
              {player.message} - {player.score}
            </Avatar>
          </p>
        ))}
      </div>
      {winner ? (
        <Avatar avatar={winner.avatar}>
          <h3>
            {winner.name} won in {(time / 1000).toFixed(3)}s !
          </h3>
        </Avatar>
      ) : (
        <h3>{state?.message}</h3>
      )}
      <input
        type="text"
        value={message}
        onChange={handleMessageChange}
        disabled={winner ? true : false}
      />
    </div>
  );
};
