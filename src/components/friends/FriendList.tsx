import { FC, useState } from "react";
import { useChats } from "../../contexts/chats.context";
import { useFriends } from "../../contexts/friends.context";
import { useVideo } from "../../contexts/video.context";
import fetcher from "../../fetcher";
import { peer } from "../../peer";
import { socket } from "../../sockets";
import { Friend } from "../../types";
import { Avatar } from "../utils/Avatar";

export const FriendListItem: FC<{ friend: Friend; mainAction?: any }> = ({
  mainAction,
  friend,
  children,
}) => {
  const [menuOn, setMenuOn] = useState(false);
  const { avatar, name, online } = friend;
  return (
    <div className={"list_item friend_list_item"}>
      <div onClick={() => setMenuOn((old) => !old)}>
        <Avatar avatar={avatar}>
          {name}
          {online ? <>&#128994;</> : null}
          {mainAction}
        </Avatar>
      </div>
      {menuOn ? <div>{children}</div> : null}
    </div>
  );
};

export const FriendList: FC = () => {
  const [friendsState, friendsDistpach, friendsAPI] = useFriends();
  const [chatState] = useChats();
  const [videoState, videoDispatch] = useVideo();
  const { data } = friendsState;
  const { chats, selected } = chatState;
  const chat = selected && chats.find((chat) => chat._id === selected);

  // Filter friendlist by roles
  const pendingList = data.filter(({ role }) => role === "pending");
  const friendList = data.filter(({ role }) => role === "friend");
  const blockedList = data.filter(({ role }) => role === "blocked");

  console.log(friendList);

  const callIcons = {
    pending: "🔔",
    none: "📞",
    connecting: "🤝",
    connected: "🛑",
  };

  // Handlers for actions
  const handleRemove = async (friend: Friend) => {
    await friendsAPI.remove(friend);
  };
  const handleBlock = async (friend: Friend) => {
    await friendsAPI.block(friend);
  };
  const handleAccept = async (friend: Friend) => {
    await friendsAPI.accept(friend);
  };

  const handleCall = (friend: Friend) => {
    switch (friend.call) {
      case "pending": {
        friend.call = "connected";
        socket.emit("video:accept", friend._id, peer.id);
        friendsDistpach({ type: "set", payload: friend });
        break;
      }
      case "connecting": {
        socket.emit("video:reject", friend._id);
        friend.call = "none";
        friendsDistpach({ type: "set", payload: friend });
        break;
      }
      case "connected": {
        friend.call = "none";
        socket.emit("video:cancel", friend._id);
        friendsDistpach({ type: "set", payload: friend });
        peer.closeCall && peer.closeCall();
        break;
      }
      case "none":
      default:
        socket.emit("video:call", friend._id);
        friend.call = "connecting";
        friendsDistpach({ type: "set", payload: friend });
        videoDispatch({ type: "call", payload: friend });
        break;
    }
  };
  const handleCallReject = (friend: Friend) => {
    socket.emit("video:reject", friend._id);
    friend.call = "none";
    friendsDistpach({ type: "set", payload: friend });
  };

  const handleAddToChat = async (chatId: string, userId: string) => {
    await fetcher.POST_JSON("/chat/add", {
      chatId: chatState.selected,
      userId,
    });
  };

  return (
    <div>
      <div className={"friend_list_sub"}>
        <p>Pending </p>
        {pendingList.map((friend) => (
          <FriendListItem
            key={friend._id}
            friend={friend}
            mainAction={
              <button
                onClick={() => handleAccept(friend)}
                title={"Accept friend"}
              >
                ✅
              </button>
            }
          >
            <button
              onClick={() => handleRemove(friend)}
              title={"Remove from friends"}
            >
              🦶
            </button>
            <button onClick={() => handleBlock(friend)} title="Block user">
              ❗
            </button>
          </FriendListItem>
        ))}
      </div>
      <div className={"friend_list_sub"}>
        <p>Friends </p>
        {friendList.map((friend) => {
          const callAction = friend.online && (
            <button onClick={() => handleCall(friend)} title="Call Friend">
              {callIcons[friend.call ?? "none"]}
            </button>
          );
          const canInvite =
            friend.online &&
            chat &&
            !chat.closed &&
            !chat.members.some((member) => member._id === friend._id);
          return (
            <FriendListItem
              key={friend._id}
              friend={friend}
              mainAction={callAction}
            >
              {friend.call === "pending" ? (
                <button onClick={() => handleCallReject(friend)}>🛑</button>
              ) : null}
              {canInvite ? (
                <button
                  onClick={() =>
                    handleAddToChat(selected as string, friend._id)
                  }
                  title="Add to Current Chat"
                >
                  ✋
                </button>
              ) : null}
              <button
                onClick={() => handleRemove(friend)}
                title="Remove from friends"
              >
                🦶
              </button>
              <button onClick={() => handleBlock(friend)} title="Block user">
                ❗
              </button>
            </FriendListItem>
          );
        })}
      </div>
      <div className={"friend_list_sub"}>
        <p>Blocked</p>
        {blockedList.map((friend) => (
          <FriendListItem
            key={friend._id}
            friend={friend}
            mainAction={
              <button
                onClick={() => handleRemove(friend)}
                title={"Remove from friends"}
              >
                🦶
              </button>
            }
          />
        ))}
      </div>
    </div>
  );
};
