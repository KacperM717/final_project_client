import { FC, useState } from "react";
import { useChats } from "../../contexts/chats.context";
import { useFriends } from "../../contexts/friends.context";
import fetcher from "../../fetcher";
import { Friend } from "../../types";
import { Avatar } from "../utils/Avatar";

export const FriendListItem: FC<{ friend: Friend }> = ({
  friend,
  children,
}) => {
  const [menuOn, setMenuOn] = useState(false);
  const { avatar, name, online } = friend;
  return (
    <div
      className={"list_item friend_list_item"}
      onClick={() => setMenuOn((old) => !old)}
    >
      <Avatar avatar={avatar}>
        {name}
        {online ? <>&#128994;</> : null}
      </Avatar>
      {menuOn ? <div>{children}</div> : null}
    </div>
  );
};

export const FriendList: FC = () => {
  const [friendsState, , friendsAPI] = useFriends();
  const [chatState] = useChats();
  const { data } = friendsState;
  const { chats, selected } = chatState;
  const chat = selected && chats.find((chat) => chat._id === selected);

  // Filter friendlist by roles
  const pendingList = data.filter(({ role }) => role === "pending");
  const friendList = data.filter(({ role }) => role === "friend");
  const blockedList = data.filter(({ role }) => role === "blocked");

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

  const handleAddToChat = async (userId: string) => {
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
          <FriendListItem key={friend._id} friend={friend}>
            <button
              onClick={() => handleAccept(friend)}
              title={"Accept friend"}
            >
              ✅
            </button>
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
          const canInvite =
            chat &&
            !chat.closed &&
            !chat.members.some((member) => member._id === friend._id);
          return (
            <FriendListItem key={friend._id} friend={friend}>
              {friend.online ? (
                <button
                  onClick={() => console.log("Init call")}
                  title="Call Friend"
                >
                  📞
                </button>
              ) : null}
              {canInvite ? (
                <button
                  onClick={() => handleAddToChat(friend._id)}
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
          <FriendListItem key={friend._id} friend={friend}>
            <button
              onClick={() => handleRemove(friend)}
              title={"Remove from friends"}
            >
              🦶
            </button>
          </FriendListItem>
        ))}
      </div>
    </div>
  );
};
