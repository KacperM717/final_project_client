import React, { FC, useEffect, useRef, useState } from "react";
import { Game, useGame } from "../../contexts/game.context";
import { socket } from "../../sockets";
import { Dino } from "./Dino";
import { Typeringo } from "./Typeringo";

const gameDict: { [key: string]: any } = {
  dino: <Dino />,
  typeringo: <Typeringo />,
};

export const GameCarousel = () => {
  const [queue, setQueue] = useState([0, 0]);
  const [gameState, gameDispatch] = useGame();
  const { status, current, games } = gameState;

  const game = games[current];

  console.log(game);

  const handlePrev = () => {
    gameDispatch({ type: "moveCurrent", payload: -1 });
  };
  const handleNext = () => {
    gameDispatch({ type: "moveCurrent", payload: 1 });
  };
  const handleJoin = () => {
    gameDispatch({ type: "join_queue" });
    socket.emit("game:queue_join", game.name);
  };
  const handleLeave = () => {
    gameDispatch({ type: "leave_queue" });
    socket.emit("game:queue_leave", game.name);
  };

  useEffect(() => {
    socket.on("game:queue_update", (queue: any) => {
      setQueue([
        queue.filter((status: any) => status === "playing").length,
        queue.filter((status: any) => status === "looking").length,
      ]);
    });
    socket.on("game:room_join", (roomId: string) => {
      gameDispatch({ type: "start" });
    });
    return () => {
      socket.off("game:queue_update");
    };
  }, []);

  useEffect(() => {
    socket.emit("game:queue_check", game.name, (queue: any) => {
      setQueue([
        queue.filter((status: any) => status === "playing").length,
        queue.filter((status: any) => status === "looking").length,
      ]);
    });
  }, [game]);

  return (
    <>
      {status === "playing" ? (
        gameDict[game.name]
      ) : (
        <div className={"game_carousel"}>
          <div className={"left"}>
            <button disabled={status !== "none"} onClick={handlePrev}>
              &larr;
            </button>
          </div>

          <div className={"game_poster"}>
            <h1>{game.name}</h1>
            {game.description ? (
              <>
                <h4>Description: </h4>
                <p>{game.description}</p>
              </>
            ) : null}
            <p>
              <h4>Queue status: </h4>
              In Game: {queue[0]}, Looking: {queue[1]}
            </p>
            {status === "queue" ? (
              <button onClick={handleLeave}>Leave</button>
            ) : (
              <button onClick={handleJoin}>Play!</button>
            )}
          </div>
          <div className={"right"}>
            <button disabled={status !== "none"} onClick={handleNext}>
              &rarr;
            </button>
          </div>
        </div>
      )}
    </>
  );
};
