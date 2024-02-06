import React, { useState } from "react";
import {
  validatePassword,
  validateUserName,
} from "../services/validationServices";
import API from "../services/APIService";
import { useGlobalContext } from "providers/GlobalProvider";
import { login } from "../providers/actionCreators";
import { LoginSignUpResponse } from "../types";
import { Link } from "react-router-dom";

export default function Login() {
  const { dispatch } = useGlobalContext();
  const [state, setState] = useState({
    username: "",
    password: "",
    usernameError: "",
    passwordError: "",
    serverError: "",
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name + "Error"]: "",
      [name]: value,
      serverError: "",
    });
  };

  const validateForm = () => {
    const { username, password } = state;
    const { status: userNameValid, message: usernameError } =
      validateUserName(username);
    const { status: passwordValid, message: passwordError } =
      validatePassword(password);

    setState({
      ...state,
      usernameError,
      passwordError,
    });
    return userNameValid && passwordValid;
  };

  const handleLoginResponse = (data: LoginSignUpResponse) => {
    const { status, token, message } = data;
    if (status) {
      localStorage.setItem("token", token);
      dispatch(login(token));
    } else {
      setState({
        ...state,
        serverError: message || "Internal Server error!!!",
      });
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const { username, password } = state;
        const response = await API.getInstance().post("/auth/login", {
          userName: username,
          password,
        });
        handleLoginResponse(response.data as LoginSignUpResponse);
      } catch (error) {
        setState({
          ...state,
          serverError: "Internal Server error!!!",
        });
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {state.serverError && <span>{state.serverError}</span>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            name="username"
            value={state.username}
            onChange={onChange}
          />
          {state.usernameError && <span>{state.usernameError}</span>}
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            value={state.password}
            onChange={onChange}
          />
          {state.passwordError && <span>{state.passwordError}</span>}
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
        <div>
          <Link to="/signup">
            Dont Have an Account?
          </Link>{" "}
        </div>
        <div>
          <Link to="/forgotpassword">
            Forgot Password
          </Link>{" "}
          &nbsp;
        </div>
      </form>
    </div>
  );
}
