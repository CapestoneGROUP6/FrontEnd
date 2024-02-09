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
    <div className="container" style={{ width: '30%', margin: '50px auto', boxShadow: "0 0 10px lightgray", borderRadius: "10px", padding: "15px" }}>
      {state.serverError && <span className="text-danger">{state.serverError}</span>}
      <form className="mt-3" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="username" className="col-form-label">Username:</label>
          <div>
            <input
              type="text"
              className="form-control"
              name="username"
              value={state.username}
              onChange={onChange}
            />
            {state.usernameError && <span className="text-danger">{state.usernameError}</span>}
          </div>
        </div>
        <div className="form-group" style={{ marginTop: '15px' }}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            className="form-control"
            name="password"
            style={{ marginTop: '15px' }}
            value={state.password}
            onChange={onChange}
          />
          {state.passwordError && <span className="text-danger">{state.passwordError}</span>}
        </div>
        <div className="form-group" style={{ marginTop: '15px' }}>
          <button type="submit" className="btn btn-primary">Login</button>
        </div>
        <div className="form-group" style={{ marginTop: '15px' }}>
          <p className="text-muted">
            Don't have an account? <Link to="/signup" className="text-decoration-none">Sign up</Link>
          </p>
        </div>
        <div className="form-group" style={{ marginTop: '15px' }}>
          <p className="text-muted">
            <Link to="/forgotpassword" className="text-decoration-none">Forgot Password</Link>{" "}
          </p>
        </div>
      </form>
    </div>

  );
}
