import React from "react";
import { Login, Signup } from "../../components/auth";
import "./base.css";

const Route = () => {
  return (
    <>
      <div className={"container flex row"}>
        <Login />
        <Signup />
      </div>
    </>
  );
};

export const BaseRoute = () => {
  return (
    <>
      <Route />
    </>
  );
};
