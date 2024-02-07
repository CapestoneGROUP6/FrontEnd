import React, { useState } from "react";
import {
  validateEmail,
  validateOtp,
  validatePassword,
} from "../services/validationServices";
import API from "../services/APIService";
import { useGlobalContext } from "providers/GlobalProvider";
import { useNavigate } from "react-router-dom";
import { GenericResponse, LoginSignUpResponse } from "../types";

function ForgotPassword() {
  const { dispatch } = useGlobalContext();
  const navigate = useNavigate();

  const [state, setState] = useState({
    password: "",
    confirmpassword: "",
    email: "",
    passwordError: "",
    confirmpasswordError: "",
    emailError: "",
    serverError: "",
    view: "FORGOT_PASSWORD",
    otp: "",
    otpError: "",
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

  const validateForgotForm = () => {
    const { email } = state;
    const { status: emailValid, message: emailError } = validateEmail(email);

    setState({
      ...state,
      emailError,
    });

    return emailValid;
  };

  const validateResetForm = () => {
    const { email, password, confirmpassword, otp } = state;
    const { status: emailValid, message: emailError } = validateEmail(email);
    const { status: passwordValid, message: passwordError } =
      validatePassword(password);
    const { status: otpValid, message: otpError } = validateOtp(otp);

    setState({
      ...state,
      emailError,
      passwordError,
      otpError,
      confirmpasswordError:
        password === confirmpassword ? "" : "Passwords Not Matching",
    });

    return (
      otpValid && emailValid && passwordValid && password === confirmpassword
    );
  };

  const handleForgotPasswordResponse = (data: GenericResponse) => {
    const { status, message } = data;
    if (status) {
      setState({
        ...state,
        view: "RESET_PASSWORD",
      });
    } else {
      setState({
        ...state,
        serverError: message || "Internal Server error!!!",
      });
    }
  };

  const handleResetPasswordResponse = (data: GenericResponse) => {
    const { status, message } = data;
    if (status) {
      alert(message || "Password Cahnged Successfully.");
      navigate("/login");
    } else {
      setState({
        ...state,
        serverError: message || "Internal Server error!!!",
      });
    }
  };

  const submitForgotForm = async (event: any) => {
    event.preventDefault();
    if (validateForgotForm()) {
      try {
        const { email } = state;
        const response = await API.getInstance().post("/auth/forgotpassword", {
          email,
        });
        handleForgotPasswordResponse(response.data as GenericResponse);
      } catch (error) {
        setState({
          ...state,
          serverError: "Internal Server error!!!",
        });
      }
    }
  };

  const submitResetForm = async (event: any) => {
    event.preventDefault();
    if (validateResetForm()) {
      try {
        const { email, password, otp } = state;
        const response = await API.getInstance().post("/auth/resetpassword", {
          email,
          newPassword: password,
          otp,
        });
        handleResetPasswordResponse(response.data as GenericResponse);
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
      <div>{state.serverError && <span>{state.serverError}</span>}</div>
      {state.view === "FORGOT_PASSWORD" && (
        <>
        <h2>Forgot Password</h2>
          <form onSubmit={submitForgotForm}>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                name="email"
                value={state.email}
                onChange={onChange}
              />
              {state.emailError && <span>{state.emailError}</span>}
            </div>
            <div>
              <button type="submit" disabled={!state.email}>
                Send OTP
              </button>
            </div>
          </form>
        </>
      )}
      {state.view === "RESET_PASSWORD" && (
        <>
        <h2>Reset Password</h2>
          <form onSubmit={submitResetForm}>
            <div>
              <label htmlFor="otp">Otp:</label>
              <input
                type="number"
                name="otp"
                value={state.otp}
                onChange={onChange}
                required
              />
              {state.otpError && <span>{state.otpError}</span>}
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                name="password"
                value={state.password}
                onChange={onChange}
                required
              />
              {state.passwordError && <span>{state.passwordError}</span>}
            </div>
            <div>
              <label htmlFor="confirmpassword">Confirm Password:</label>
              <input
                type="password"
                name="confirmpassword"
                value={state.confirmpassword}
                onChange={onChange}
                required
              />
              {state.confirmpasswordError && (
                <span>{state.confirmpasswordError}</span>
              )}
            </div>
            <div>
              <button
                type="submit"
                disabled={
                  !state.password || !state.otp || !state.confirmpassword
                }
              >
                Reset Password
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default ForgotPassword;
