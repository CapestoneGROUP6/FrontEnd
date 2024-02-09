import React, { useState } from "react";
import {
  validateEmail,
  validatePassword,
  validateUserName,
} from "../services/validationServices";
import API from "../services/APIService";
import { useGlobalContext } from "providers/GlobalProvider";
import { login } from "../providers/actionCreators";
import { LoginSignUpResponse } from "../types";
import { Link } from "react-router-dom";

export default function Signup() {
  const { dispatch } = useGlobalContext();
  const [state, setState] = useState({
    username: "",
    password: "",
    email: "",
    usernameError: "",
    passwordError: "",
    emailError: "",
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
    const { username, password, email } = state;
    const { status: userNameValid, message: usernameError } =
      validateUserName(username);
    const { status: passwordValid, message: passwordError } =
      validatePassword(password);
    const { status: emailValid, message: emailError } = validateEmail(email);

    setState({
      ...state,
      usernameError,
      passwordError,
      emailError,
    });
    return userNameValid && passwordValid && emailValid;
  };

  const handleSignUpResponse = (data: LoginSignUpResponse) => {
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
        const { username, password, email } = state;
        const response = await API.getInstance().post("/auth/signup", {
          userName: username,
          password,
          email,
        });
        handleSignUpResponse(response.data as LoginSignUpResponse);
      } catch (error) {
        setState({
          ...state,
          serverError: "Internal Server error!!!",
        });
      }
    }
  };
  

  return (
    <div className="container" style={{ width: '30%', margin: '50px auto', boxShadow: "0 0 10px lightgray", borderRadius: "10px" , padding:"15px"}}>
      <h2>Signup</h2>
      {state.serverError && <span className="text-danger">{state.serverError}</span>}
      <form className="mt-3" onSubmit={handleSubmit}>
        <div className="form-group">
          <label style={{ marginTop:"10px",}} htmlFor="username">Username:</label>
          <input
            type="text"
            className="form-control"
            name="username"
            style={{ marginTop:"10px",}}
            value={state.username}
            onChange={onChange}
          />
          {state.usernameError && <span className="text-danger">{state.usernameError}</span>}
        </div>
        <div className="form-group">
          <label  style={{ marginTop:"10px",}} htmlFor="password">Password:</label>
          <input
            type="password"
            className="form-control"
            name="password"
            style={{ marginTop:"10px",}}
            value={state.password}
            onChange={onChange}
          />
          {state.passwordError && <span className="text-danger">{state.passwordError}</span>}
        </div>
        <div className="form-group">
          <label style={{ marginTop:"10px",}} htmlFor="email">Email:</label>
          <input
            type="email"
            className="form-control"
            name="email"
            style={{ marginTop:"10px",}}
            value={state.email}
            onChange={onChange}
          />
          {state.emailError && <span className="text-danger">{state.emailError}</span>}
        </div>
        <div className="form-group" style={{ marginTop:"10px",}}>
          <button type="submit" className="btn btn-primary">SignUp</button>
        </div>
        <div className="form-group">
          <p className="text-muted">
            Already have an account? <Link to="/login" className="text-decoration-none">Login</Link>
          </p>
        </div>
      </form>
    </div>

  );
}
