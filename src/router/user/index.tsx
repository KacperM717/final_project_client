import React, { useEffect, useState } from "react";
import { Logout } from "../../components/auth";
import { Friends } from "../../components/friends";
import { UserSearch } from "../../components/user/UserSearch";
import { FriendsProvider } from "../../friends.context";
import { socket } from "../../socketio";
import { useUser } from "../../user.context";

type WSRes<B> = {
  ok: boolean;
  msg: string;
  body?: B;
};

export const UserRoute = () => {
  const [user] = useUser();

  useEffect(() => {
    if (user.user) {
      socket.connect();
      console.log("user", user.user);
      const payload = {
        _id: user.user._id,
        token: user.user.token,
      };
      socket.emit("login", payload, (res: WSRes<void>) => {
        console.log(res.msg);
      });
    }
    return () => {
      console.log("WS OFF");
      socket.emit("logout");
    };
  }, [user.user]);

  return (
    <>
      <FriendsProvider>
        <div>
          <h1>Friends</h1>
          <UserSearch />
          <Friends />
        </div>
        <div>
          <h1>Chats</h1>
        </div>
        <div>
          <h1>User</h1>
          <Logout />
        </div>
      </FriendsProvider>
    </>
  );
};
