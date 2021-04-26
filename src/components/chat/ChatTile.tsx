import React from "react";

type ChatTileProps = {
  _id: string;
  name: string;
  unread: boolean;
  onClick: any;
};

export const ChatTile = ({ _id, name, unread, onClick }: ChatTileProps) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onClick(_id);
  };

  return (
    <div onClick={handleClick}>
      <span>{name}</span>
      {unread ? <span>NEW</span> : null}
    </div>
  );
};
