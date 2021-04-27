import { FC, useState } from "react";
import { useFriends } from "../../contexts/friends.context";
import fetcher from "../../fetcher";
import { Friend, User } from "../../types";
import Search from "../util/Search";
import { Button } from "../util/Button";

const ChatUserTile: FC<{ user: User }> = ({ user, children }) => {
  return (
    <div>
      <p>{user.name}</p>
      <div>{children}</div>
    </div>
  );
};

export const ChatCreate = () => {
  const [name, setName] = useState("");
  const [closed, setClosed] = useState(false);
  const [friends, friendsDispatch, friendsAPI] = useFriends();
  const [foundFriends, setFoundFriends] = useState<Friend[]>([]);
  const [invitedFriends, setInvitedFriends] = useState<Friend[]>([]);
  const [info, setInfo] = useState("");

  const onChatCreation = async () => {
    const payload = {
      name,
      closed,
      members: invitedFriends.map((f) => f._id),
    };
    const res = await fetcher.POST_JSON("/chat/create", payload);
    const { msg, body, errors } = await res.json();
    if (!res.ok) return setInfo(errors.toString());
    setInfo(msg);
    console.log(body);
  };

  const handleFriendSearch = (name: string) => {
    const re = new RegExp(`.*${name}.*`, "i");
    setFoundFriends(friends.data.filter(({ name }) => re.test(name)));
  };

  const handleInviteClick = (friend: Friend) => {
    if (invitedFriends.some((f) => f._id === friend._id)) return;
    setInvitedFriends([...invitedFriends, friend]);
  };

  const handleDeleteClick = (_id: string) => {
    setInvitedFriends(invitedFriends.filter((f) => f._id !== _id));
  };

  return (
    <div>
      <h4>Create Chat</h4>
      <div>
        <label htmlFor="name">Name of Chat: </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="closed">Closed chat: </label>
        <input
          type="checkbox"
          name="closed"
          id="closed"
          checked={closed}
          onChange={() => setClosed((old) => !old)}
        />
        <p>Add friends: </p>
        <div>
          <Search onTextChange={handleFriendSearch} onTextChangeDelay={200} />
          <ul>
            {foundFriends.length > 0
              ? foundFriends.map((friend) => (
                  <li key={friend._id}>
                    {friend.name}{" "}
                    <Button onClick={() => handleInviteClick(friend)}>
                      Invite
                    </Button>
                  </li>
                ))
              : null}
          </ul>
        </div>
      </div>
      <div>
        {invitedFriends.length > 0
          ? invitedFriends.map((friend) => (
              <ChatUserTile user={friend} key={friend._id}>
                <Button onClick={() => handleDeleteClick(friend._id)}>
                  Delete
                </Button>
              </ChatUserTile>
            ))
          : null}
      </div>
      <Button onClick={() => onChatCreation()}>Create</Button>
      <p>{info}</p>
    </div>
  );
};
