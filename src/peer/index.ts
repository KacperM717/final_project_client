import Peer from "peerjs";

const constraints = {
  video: true,
  audio: true,
};

interface PeerExt extends Peer {
  whitelist?: string[];
  makeCall?: (peerId: string) => void;
  closeCall?: () => void;
  busy?: boolean;
  win?: Window;
  current?: Peer.MediaConnection;
}

export const peer: PeerExt = new Peer();
peer.busy = false;
peer.whitelist = [];
peer.closeCall = () => {
  peer.busy = false;
  peer.win?.close();
  peer.win = undefined;
  peer.current?.close();
  peer.current = undefined;
};
peer.makeCall = async (peerId: string) => {
  if (peer.busy || peer.win) return console.error("User is already busy!");
  peer.busy = true;
  try {
    peer.win = createVideoWindow(600, 400);
    const localStream = await peer.win.navigator.mediaDevices.getUserMedia(
      constraints
    );
    const call = peer.call(peerId, localStream);
    peer.current = call;
    (peer.win.document.querySelector(
      "video#caller"
    ) as HTMLVideoElement).srcObject = localStream;
    call.on("stream", (remoteStream) => {
      console.log("REMOTE STREAM", remoteStream);
      if (peer.win)
        (peer.win.document.querySelector(
          "video#callee"
        ) as HTMLVideoElement).srcObject = remoteStream;
    });
    peer.win.addEventListener(
      "unload",
      () => peer.closeCall && peer.closeCall()
    );
    call.on("close", () => {
      peer.closeCall && peer.closeCall();
    });
    call.on("error", () => {
      peer.closeCall && peer.closeCall();
    });
  } catch (error) {
    console.log(error);

    peer.closeCall && peer.closeCall();
  }
};

peer.on("error", (err) => console.error(err));

peer.on("open", async (peerId: string) => {
  peer.on("call", async (call) => {
    peer.current = call;
    try {
      peer.win = createVideoWindow(600, 400, peer.closeCall);
      const localStream = await peer.win.navigator.mediaDevices.getUserMedia(
        constraints
      );
      (peer.win.document.querySelector(
        "video#caller"
      ) as HTMLVideoElement).srcObject = localStream;

      call.answer(localStream);
      call.on("stream", (remoteStream) => {
        if (peer.win)
          (peer.win.document.querySelector(
            "video#callee"
          ) as HTMLVideoElement).srcObject = remoteStream;
      });
      call.on("close", () => {
        peer.closeCall && peer.closeCall();
      });
      call.on("error", () => {
        peer.closeCall && peer.closeCall();
      });
    } catch (error) {
      console.log(error);
      peer.closeCall && peer.closeCall();
    }
  });
});

function createVideoWindow(width: number, height: number, onClose?: any) {
  const win = window.open("", "VideoCall", `width=${width},height=${height}`);
  if (!win) throw new Error("Could not open new window");
  win.addEventListener("unload", (e) => onClose());
  win.document.write(`
    <head>
        <style>
            body{
                margin: 0;
                padding: 0;
                background: black;
            }
            #callee{
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
            }
            #caller{
                position: fixed;
                top: 20px;
                right: 20px;
                width: 30vw;
                height: 20vh;
            }
        </style>
    </head>
    <body>
        <video id="callee" autoplay="true"></video>
        <video id="caller" autoplay="true"></video>
    </body>`);

  return win;
}
