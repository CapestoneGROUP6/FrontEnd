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
import { handleGoogleSign } from "services/firebase";
import { Button, Grid, Paper, Typography } from "@mui/material";

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

  const googleLogin = async () => {
    const data = await handleGoogleSign()
    handleLoginResponse(data as LoginSignUpResponse);
  }

  return (
    <>
      <Grid container justifyContent='center'>
        <Grid item xs={10} md={4} >
          <Paper elevation={10} style={{padding: 20}}>
            <Grid container direction='column' justifyContent='center' spacing={2}>
              <Grid item className="d-flex justify-content-center">
                <Typography variant="h5" style={{fontWeight: 'bold'}}>Login</Typography>
              </Grid>
              {state.serverError && <span className="text-danger">
                <Grid item className="d-flex justify-content-center">
                  <Typography color={'red'}>{state.serverError}</Typography>
                </Grid>
              </span>}
              <Grid item>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={state.username}
                  onChange={onChange}
                  placeholder="Username"
                  style={{height: '3rem'}}
                />
                {state.usernameError && <span className="text-danger">{state.usernameError}</span>}
              </Grid>
              <Grid item>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={state.password}
                  onChange={onChange}
                  placeholder="Password"
                  style={{height: '3rem'}}
                />
                {state.passwordError && <span className="text-danger">{state.passwordError}</span>}
              </Grid>
              <Grid item className="d-flex justify-content-center">
                <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>Login</Button>
              </Grid>
              <Grid item className="d-flex justify-content-center">
                <img alt="Goolge LOgin" src="/google.png" style={{ width: '15rem', height: 'auto', objectFit: 'contain', cursor: 'pointer' }} onClick={googleLogin} />
              </Grid>
              <Grid item className="d-flex justify-content-center">
                Don't have an account? <Link to="/signup" className="text-decoration-none">Sign up</Link>
              </Grid>
              <Grid item className="d-flex justify-content-center">
                <Link to="/forgotpassword" className="text-decoration-none">Forgot Password</Link>{" "}
              </Grid>

            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
