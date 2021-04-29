import { FC } from "react";

export type AvatarProps = {
  avatar: string;
  name?: string;
};

export const Avatar: FC<AvatarProps> = (props) => {
  const { avatar, name, children } = props;

  return (
    <div className={"avatar"}>
      <img
        src={avatar}
        width={50}
        height={50}
        alt={`${name}'s avatar`}
        title={name}
      />
      <span>{children}</span>
    </div>
  );
};
