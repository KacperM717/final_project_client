import { useState } from "react";
import fetcher from "../../fetcher";
import { useFriends } from "../../contexts/friends.context";
import { User } from "../../types";
import Search from "../util/Search";
import { Button } from "../util/Button";

type UserSearchListProps = {
  users: User[];
};

type UserSearchItemProps = {
  user: User;
};

const UserSearchList = ({ users }: UserSearchListProps) => {
  return (
    <div>
      <ul>
        {users.map((user) => (
          <UserSearchItem key={user._id} user={user} />
        ))}
      </ul>
    </div>
  );
};

const UserSearchItem = ({ user }: UserSearchItemProps) => {
  const [, , friendsAPI] = useFriends();
  const { name } = user;

  const handleAdd = () => {
    friendsAPI.add(user);
  };

  const handleBlock = () => {
    friendsAPI.block(user);
  };

  return (
    <li>
      <p>
        {name}
        <Button onClick={handleAdd}>Add</Button>
        <Button onClick={handleBlock}>Block</Button>
      </p>
    </li>
  );
};

export const UserSearch = () => {
  const [friends] = useFriends();
  const [users, setUsers] = useState<User[]>([]);
  const [msg, setMsg] = useState("");

  const handleSearch = async (query: string) => {
    if (query.length === 0) {
      setUsers([]);
      return setMsg("");
    }
    const res = await fetcher.BASE(`/users?name=${query}`);
    const { msg, body, errors } = await res.json();
    if (!res.ok) return setMsg(errors[0].msg);
    const friendsIds = friends.data.map(({ _id }) => _id);
    const users: User[] = body;
    const filteredUsers = users.filter(({ _id }) => !friendsIds.includes(_id));
    setUsers(filteredUsers);
    const usersCount = filteredUsers.length;
    const info =
      usersCount > 0
        ? `Found ${usersCount} users`
        : `No user was found. Maybe you are already friends?`;
    setMsg(info);
  };

  return (
    <div>
      <Search onSearch={handleSearch} onTextChange={handleSearch} />
      <p>{msg}</p>
      {users.length > 0 ? <UserSearchList users={users} /> : null}
    </div>
  );
};
