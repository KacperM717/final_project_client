import React, { useState } from "react";
import fetcher from "../../fetcher";
import { useUser } from "../../user.context";

export const Login = () => {
  const [, userDispatch] = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [info, setInfo] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    const payload = {
      email,
      password,
    };
    const res = await fetcher.POST_JSON("/auth/login", payload);
    const { msg, body, errors } = await res.json();
    if (!res.ok)
      return setInfo(errors.map((error: any) => error.msg).join(". "));
    setInfo(msg);
    userDispatch({ type: "set", payload: body });
  };

  return (
    <div>
      <label htmlFor="email">
        Email address: <span>{}</span>
      </label>
      <input
        type="text"
        id="email"
        value={email}
        onChange={handleEmailChange}
      />
      <label htmlFor="password">
        Password: <span>{}</span>
      </label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={handlePasswordChange}
      />
      <button onClick={handleLogin}>Log In</button>
      <p>{info}</p>
    </div>
  );
};
