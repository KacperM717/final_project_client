import { FC } from "react";

export const Button: FC<{ icon?: any; onClick: any }> = ({
  children,
  onClick,
}) => {
  return <button onClick={onClick}>{children}</button>;
};
