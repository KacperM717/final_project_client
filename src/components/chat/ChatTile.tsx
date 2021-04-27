import React, { FC } from "react";

type ChatTileProps = {
  name: string;
  unread: boolean;
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
    <div onClick={handleClick}>
      <span>{name}</span>
      {unread ? <span>NEW</span> : null}
      {selected ? <span>SELECTED</span> : null}
    </div>
  );
};
