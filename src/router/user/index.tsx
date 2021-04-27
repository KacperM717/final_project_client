import React, { useEffect, useState } from "react";
import { Logout } from "../../components/auth";
import { UserSearch } from "../../components/user/UserSearch";
import { FriendsProvider } from "../../contexts/friends.context";
import { ChatsProvider } from "../../contexts/chats.context";
import { socket } from "../../sockets";
import { useUser } from "../../contexts/user.context";
import { ChatCreate } from "../../components/chat/ChatCreate";
import { ChatList } from "../../components/chat/ChatList";
import { Button } from "../../components/util/Button";
import { ChatSockets } from "../../sockets/chat.socket";
import { FriendList } from "../../components/friends/FriendList";
import { Chat } from "../../components/chat/Chat";

type WSRes<B> = {
  ok: boolean;
  msg: string;
  body?: B;
};

type SidebarList = "CHATS" | "FRIENDS";

export const UserRoute = () => {
  const [user] = useUser();
  const [menu, setMenu] = useState(null);
  const [sidebarList, setSidebarList] = useState<SidebarList>("CHATS");

  useEffect(() => {
    if (user.user) {
      socket.connect();
      console.log("user", user.user);
      const payload = {
        _id: user.user._id,
        token: user.user.token,
        name: user.user.name,
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
        <ChatsProvider>
          <ChatSockets>
            <div>
              <div>
                <h1>Header</h1>
                <h2>
                  TODO: Fix messages (populate author AND msg received is
                  undefined on client)
                </h2>
                <p>Welcome to GamePub, {user.user?.name}!</p>
                <UserSearch />
                <Logout />
              </div>
              <div>
                <h1>Video/Game</h1>
                <p>Here is a place for video call or games</p>
              </div>
              <div>
                <h1>Menu</h1>
                <p>
                  Contextual menu - depends on what is clicked [chat, friend,
                  call]
                </p>
              </div>
              <div>
                <h1>Chat</h1>
                <Chat />
              </div>
              <div>
                <h1>Friend/Chat List</h1>

                <div>
                  {sidebarList === "CHATS" ? (
                    <>
                      <h2>Chats</h2>
                      <ChatList />
                    </>
                  ) : (
                    <>
                      <h2>Friends</h2>
                      <FriendList />
                    </>
                  )}
                </div>
                <div>
                  <h2>Switcher</h2>
                  <Button onClick={() => setSidebarList("FRIENDS")}>
                    Friends
                  </Button>
                  <Button onClick={() => setSidebarList("CHATS")}>Chats</Button>
                </div>
              </div>
            </div>
          </ChatSockets>
        </ChatsProvider>
      </FriendsProvider>
    </>
  );
};
