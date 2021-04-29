import React, { FC } from "react";

type ChatTileProps = {
  name: string;
  unread: number;
  onClick: any;
  selected: boolean;
};

export const ChatTile: FC<ChatTileProps> = ({
  name,
  unread,
  onClick,
  selected,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onClick();
  };

  return (
    <div
      onClick={handleClick}
      className={`list_item chat_list_item ${selected ? "selected" : ""}`}
    >
      <div>{name}</div>
      {unread ? <div className={"unread_dot"}>&#128308;{unread}</div> : null}
    </div>
  );
};
