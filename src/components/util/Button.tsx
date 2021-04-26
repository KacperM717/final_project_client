import { FC } from "react";

export const Button: FC<{ value: string; icon?: any; onClick: any }> = ({
  value,
  onClick,
}) => {
  return <button onClick={onClick}>{value}</button>;
};
