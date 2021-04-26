import React from "react";
import fetcher from "../../fetcher";
import { useUser } from "../../user.context";

export const Logout = () => {
  const [, userDispatch] = useUser();

  const handleLogout = async () => {
    await fetcher.BASE("/auth/logout");
    return userDispatch({ type: "set", payload: null });
  };

  return <button onClick={handleLogout}>Log Out</button>;
};
