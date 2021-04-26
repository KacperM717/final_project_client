import React from "react";
import { Login, Signup } from "../../components/auth";

const Route = () => {
  return (
    <div>
      <Login />
      <Signup />
    </div>
  );
};

export const BaseRoute = () => {
  return (
    <>
      <Route />
    </>
  );
};
