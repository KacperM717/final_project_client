import React, { useEffect, useState } from "react";
import { Logout } from "../../components/auth";
import { UserSearch } from "../../components/user/UserSearch";
import { FriendsProvider } from "../../contexts/friends.context";
import { ChatsProvider } from "../../contexts/chats.context";
import { socket } from "../../sockets";
import { useUser } from "../../contexts/user.context";
import { ChatCreate } from "../../components/chat/ChatCreate";
import { ChatList } from "../../components/chat/ChatList";
import { ChatSockets } from "../../sockets/chat.socket";
import { FriendList } from "../../components/friends/FriendList";
import { Chat } from "../../components/chat/Chat";

import "./user.css";
import { Avatar } from "../../components/utils/Avatar";
import { VideoSockets } from "../../sockets/video.socket";
import { VideoProvider } from "../../contexts/video.context";

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
      const payload = {
        _id: user.user._id,
        token: user.user.token,
        name: user.user.name,
        avatar: user.user.avatar,
      };
      socket.emit("login", payload, (res: WSRes<void>) => {
        console.log(`WS ON ${res.msg}`);
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
            <VideoProvider>
              <VideoSockets>
                <div className={"layout"}>
                  <div className={"user"}>
                    <Logout />
                    <Avatar avatar={user.user!.avatar}>
                      {user.user?.name}
                    </Avatar>
                    <UserSearch />
                  </div>
                  <div className={"game"}>
                    {/* <p>Here is a place for video call or games</p> */}
                  </div>
                  <div className={"menu"}>
                    <ChatCreate />
                  </div>
                  <div className={"chat"}>
                    <Chat />
                  </div>
                  <div className={"list"}>
                    <p className={"list_heading"}>{sidebarList}</p>
                    <div className={"list_content"}>
                      {sidebarList === "CHATS" ? <ChatList /> : <FriendList />}
                    </div>
                    <div className={"list_switcher"}>
                      <button onClick={() => setSidebarList("CHATS")}>
                        &#128172;
                      </button>
                      <button onClick={() => setSidebarList("FRIENDS")}>
                        &#129485;
                      </button>
                    </div>
                  </div>
                </div>
              </VideoSockets>
            </VideoProvider>
          </ChatSockets>
        </ChatsProvider>
      </FriendsProvider>
    </>
  );
};
