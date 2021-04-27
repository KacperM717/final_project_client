import React, { useEffect } from "react";
import { UserRoute } from "./user";
import { BaseRoute } from "./base";
import { UserProvider, useUser } from "../contexts/user.context";
import { socket } from "../sockets";

const Route = () => {
  const [user] = useUser();

  return <>{user.user ? <UserRoute /> : <BaseRoute />}</>;
};

const Wrapper = () => {
  return (
    <UserProvider>
      <Route />
    </UserProvider>
  );
};

export default Wrapper;
