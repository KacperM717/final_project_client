import { FC, useState } from "react";
import { useFriends } from "../../contexts/friends.context";
import fetcher from "../../fetcher";
import { Friend, User } from "../../types";
import Search from "../utils/Search";
import { Avatar } from "../utils/Avatar";

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
      <div className={"create_chat_heading"}>
        <h2>Create New Chat</h2>
      </div>
      <div className={"create_chat_form"}>
        <div>
          <label htmlFor="name">Name of Chat: </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <span>Add friends: </span>
          <div style={{ display: "inline-block" }}>
            <Search onTextChange={handleFriendSearch} onTextChangeDelay={200}>
              {foundFriends.length > 0
                ? foundFriends.map((friend) => (
                    <div className={"search_user_item"} key={friend._id}>
                      <Avatar avatar={friend.avatar}>{friend.name}</Avatar>
                      <button onClick={() => handleInviteClick(friend)}>
                        Invite
                      </button>
                    </div>
                  ))
                : null}
            </Search>
          </div>
        </div>
        <div>
          <label htmlFor="closed">Disable invites 🔒: </label>
          <input
            type="checkbox"
            name="closed"
            id="closed"
            checked={closed}
            onChange={() => setClosed((old) => !old)}
          />
        </div>
        <div className={"invited_users"}>
          {invitedFriends.length > 0
            ? invitedFriends.map((friend) => (
                <Avatar avatar={friend.avatar} key={friend._id}>
                  <button onClick={() => handleDeleteClick(friend._id)}>
                    Delete
                  </button>
                </Avatar>
              ))
            : null}
        </div>
        <div>
          <button onClick={() => onChatCreation()}>Create</button>
          <p>{info}</p>
        </div>
      </div>
    </div>
  );
};
