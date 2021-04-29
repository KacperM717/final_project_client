import React, { useState } from "react";
import fetcher from "../../fetcher";

export const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [info, setInfo] = useState("");

  const handleSignup = async () => {
    const payload = {
      name,
      email,
      password,
    };
    const res = await fetcher.POST_JSON("/auth/signup", payload);
    const { msg, body, errors } = await res.json();
    if (!res.ok) return setInfo(errors.map((er: any) => er.msg).join(". "));
    setInfo(msg);
  };

  return (
    <div className={"container-form"}>
      <h2>Create Account</h2>
      <label htmlFor="name">Name: </label>
      <input
        type="text"
        id="name"
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <label htmlFor="email">Email address: </label>
      <input
        type="text"
        id="email"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <label htmlFor="password">Password: </label>
      <input
        type="password"
        id="password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <button onClick={handleSignup}>Create Account</button>
      <p className={"info"}>{info}</p>
    </div>
  );
};
