import { Socket } from "socket.io-client";
import fetcher from "../../fetcher";

function setupCanvas(parent: HTMLElement) {
  parent.innerHTML = `
        <canvas id="cnv"></canvas>
<script>
    console.log('it works');
    const cnv = document.querySelector('#cnv');
    const c = cnv.getContext('2d');
</script>
    `;
}

export function Dino(
  socket: typeof Socket,
  players: any[],
  parent: HTMLElement | null,
  ...options: any
) {
  const state: { players: any[] } = {
    players: [],
  };

  (async () => {
    if (!parent) throw new Error("Parent not provided");
    const res = await fetcher.BASE("/games/dino.html");
    console.log(res);
    const w = await res.text();
    console.log("TEXT: ", w);
    setupCanvas(parent);
    state.players = players;
    console.log(parent);
  })();

  return {
    // Here api for interacting
    state,
  };
}
