import { FC, useEffect } from "react";
import { socket } from ".";
import { useFriends } from "../contexts/friends.context";
import { useVideo } from "../contexts/video.context";
import { peer } from "../peer";

export const VideoSockets: FC = ({ children }) => {
  // Fetch used state
  const [friendsState, friendsDistpach] = useFriends();
  const [videoState, videoDispatch] = useVideo();
  const { data } = friendsState;

  // Init socket listeners
  useEffect(() => {
    socket.on("video:calling", (userId: string) => {
      console.log("video:calling");
      const friend = data.find(({ _id }) => _id === userId);
      if (!friend) return;
      friendsDistpach({ type: "set", payload: { ...friend, call: "pending" } });
    });
    socket.on("video:rejected", (userId: string) => {
      const friend = data.find(({ _id }) => _id === userId);
      if (!friend) return;
      friend.call = "none";
      friendsDistpach({ type: "set", payload: friend });
      videoDispatch({ type: "cancelled" });
    });
    socket.on("video:accepted", (peerId: string) => {
      videoDispatch({ type: "setPeer", payload: peerId });
      if (peer.makeCall) peer.makeCall(peerId);
    });
    socket.on("video:cancelled", (friendId: string) => {
      peer.closeCall && peer.closeCall();
      const friend = friendsState.data.filter(({ _id }) => _id === friendId)[0];
      friend.call = "none";
      friendsDistpach({ type: "set", payload: friend });
    });
    // Cancel listeners
    return () => {
      socket.off("video:calling");
      socket.off("video:rejected");
      socket.off("video:accepted");
      socket.off("video:cancelled");
    };
  }, [friendsState, videoState]);

  return <>{children}</>;
};
