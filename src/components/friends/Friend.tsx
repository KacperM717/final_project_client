import React, { FC, useState } from "react";
import { User } from "../../types";

type FriendProps = {
  user: User;
};

export const Friend: FC<FriendProps> = ({ user, children }) => {
  const [toggle, setToggle] = useState(false);
  return (
    <div onClick={() => setToggle((old) => !old)}>
      <p>{user.name}</p>
      {toggle ? <div>{children}</div> : null}
    </div>
  );
};

export const FriendAccept = ({
  user,
  onAccept,
}: {
  user: User;
  onAccept: (user: User) => any;
}) => {
  const handleAccept = () => onAccept(user);
  return <button onClick={handleAccept}>Accept</button>;
};

export const FriendBlock = ({
  user,
  onBlock,
}: {
  user: User;
  onBlock: (user: User) => any;
}) => {
  const handleBlock = () => onBlock(user);
  return <button onClick={handleBlock}>Block</button>;
};

export const FriendRemove = ({
  user,
  onRemove,
}: {
  user: User;
  onRemove: (user: User) => any;
}) => {
  const handleRemove = () => onRemove(user);
  return <button onClick={handleRemove}>Remove</button>;
};

export const FriendRequest = ({
  user,
  onRequest,
}: {
  user: User;
  onRequest: (user: User) => any;
}) => {
  const handleRequest = () => onRequest(user);
  return <button onClick={handleRequest}>Add</button>;
};
