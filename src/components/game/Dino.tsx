import { useEffect, useRef, useState } from "react";
import { useGame } from "../../contexts/game.context";
import { useUser } from "../../contexts/user.context";
import { socket } from "../../sockets";
import { Avatar } from "../utils/Avatar";

export const Dino = () => {
  const [gameState, gameDispatch] = useGame();
  const [userState] = useUser();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [readyButton, setReadyButton] = useState(true);
  const [players, setPlayers] = useState<any>([]);

  const player = players.filter(
    (player: any) => player.user._id === userState.user?._id
  )[0];

  const drawPlayer = (c: CanvasRenderingContext2D, player: any) => {
    if (player.end) return;
    c.fillStyle =
      player.user._id === userState.user?._id
        ? "rgba(255,0,0,0.5)"
        : "rgba(0,0,0,0.3";
    c.beginPath();
    c.fillRect(
      player.pos.v[0],
      player.pos.v[1],
      player.size.v[0],
      player.size.v[1]
    );
  };

  const drawObstacle = (c: CanvasRenderingContext2D, obstacle: any) => {
    c.fillStyle = "rgba(0,255,0,0.5)";
    c.beginPath();
    c.fillRect(
      obstacle.pos.v[0],
      obstacle.pos.v[1],
      obstacle.size.v[0],
      obstacle.size.v[1]
    );
  };

  const initCanvas = (state: any) => {
    if (!canvasRef.current) return;
    const cnv = canvasRef.current;
    cnv.width = state.world.size.v[0];
    cnv.height = state.world.size.v[1];
    if (cnv.height > cnv.width) {
      // here height plays the role
      const aspect = cnv.width / cnv.height;
      const parentHeight = cnv.parentElement!.getBoundingClientRect().width;
      cnv.style.height = `${parentHeight}px`;
      cnv.style.width = `${parentHeight * aspect}px`;
    } else {
      // here width plays the role
      const aspect = cnv.height / cnv.width;
      const parentWidth = cnv.parentElement!.getBoundingClientRect().width;
      cnv.style.width = `${parentWidth}px`;
      cnv.style.height = `${parentWidth * aspect}px`;
    }
    // document.documentElement.style.setProperty("--asp", aspect.toString());
    // document.documentElement.style.setProperty(
    //   "--rasp",
    //   (1 / aspect).toString()
    // );

    const c = canvasRef.current?.getContext("2d");
    c?.clearRect(0, 0, cnv.width, cnv.height);
  };

  const updateCanvas = (state: any) => {
    const c = canvasRef.current?.getContext("2d");
    if (!c || !canvasRef.current) return;
    c.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    state.players.forEach((player: any) => drawPlayer(c, player));
    state.obstacles.forEach((obstacle: any) => drawObstacle(c, obstacle));
  };

  const onJump = () => socket.emit("game:dino:jump");

  useEffect(() => {
    const onEnd = () =>
      socket.emit("game:ended", gameState.games[gameState.current].name);
    socket.on("game:state_init", (state: any) => {
      initCanvas(state);
    });
    socket.on("game:state_update", (state: any) => {
      setPlayers(state.players);
      updateCanvas(state);
    });
    document.addEventListener("unload", onEnd);
    socket.emit("game:room_joined");
    return () => {
      socket.off("game:state_init");
      socket.off("game:state_update");
      document.removeEventListener("unload", onEnd);
    };
  }, []);

  useEffect(() => {
    canvasRef.current?.addEventListener("click", onJump);
    const crc = canvasRef.current;
    return () => {
      crc?.removeEventListener("click", onJump);
    };
  }, []);

  const handleReady = () => {
    socket.emit("game:ready");
    setReadyButton(false);
  };
  const handleLeave = () => {
    gameDispatch({ type: "end" });
    socket.emit("game:ended", gameState.games[gameState.current].name);
  };
  return (
    <div className={"game_wrapper"}>
      <div className={"game_menu"}>
        {readyButton ? <button onClick={handleReady}>Ready</button> : null}
        <button onClick={handleLeave}>Leave</button>
      </div>
      <div className={"game_score"}>
        {players.map((player: any) => (
          <p key={player.user._id}>
            <Avatar avatar={player.user.avatar}>{player.score}</Avatar>
          </p>
        ))}
      </div>
      {player?.end ? <h1>Game Over! Score: {player.score}</h1> : null}
      <canvas id="cnv" ref={canvasRef}></canvas>
    </div>
  );
};
