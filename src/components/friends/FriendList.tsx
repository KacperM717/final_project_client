import { FC, useState } from "react";
import { useFriends } from "../../contexts/friends.context";
import { Friend } from "../../types";
import { Button } from "../util/Button";

export const FriendListItem: FC<{ friend: Friend }> = ({
  friend,
  children,
}) => {
  const [menuOn, setMenuOn] = useState(false);
  const { name, online } = friend;
  return (
    <div onClick={() => setMenuOn((old) => !old)}>
      <p>
        {name} <span>{online ? "ON" : "OFF"}</span>
      </p>
      {menuOn ? <div>{children}</div> : null}
    </div>
  );
};

export const FriendList: FC = () => {
  const [friendsState, , friendsAPI] = useFriends();
  const { data } = friendsState;

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

  return (
    <div>
      <div>
        <p>Pending: </p>
        {pendingList.map((friend) => (
          <FriendListItem key={friend._id} friend={friend}>
            <Button onClick={() => handleAccept(friend)}>Accept</Button>
            <Button onClick={() => handleRemove(friend)}>Remove</Button>
            <Button onClick={() => handleBlock(friend)}>Block</Button>
          </FriendListItem>
        ))}
      </div>
      <div>
        <p>Friends: </p>
        {friendList.map((friend) => (
          <FriendListItem key={friend._id} friend={friend}>
            <Button onClick={() => handleRemove(friend)}>Remove</Button>
            <Button onClick={() => handleBlock(friend)}>Block</Button>
          </FriendListItem>
        ))}
      </div>
      <div>
        <p>Blocked: </p>
        {blockedList.map((friend) => (
          <FriendListItem key={friend._id} friend={friend}>
            <Button onClick={() => handleRemove(friend)}>Remove</Button>
          </FriendListItem>
        ))}
      </div>
    </div>
  );
};
