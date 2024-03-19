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
      <div >{state.serverError && <span className="text-danger">{state.serverError}</span>}</div>
      {state.view === "FORGOT_PASSWORD" && (
        <>
          <form style={{ width: "30%", margin: "auto", }} className="mt-5" onSubmit={submitForgotForm}>
            <h2 className="mb-4">Forgot Password</h2>
            <div className="form-group">
              <label style={{ marginTop: '15px', display: "flex", flexDirection: "column", alignItems: "flex-start", fontSize: "18px" }} htmlFor="email">Email:</label>
              <input
                type="email"
                className="form-control"
                name="email"
                style={{ marginTop: '15px' }}
                value={state.email}
                onChange={onChange}
              />
              {state.emailError && <span className="text-danger">{state.emailError}</span>}
            </div>
            <div className="form-group">
              <button type="submit" style={{ marginTop: '15px', }} className="btn btn-primary" disabled={!state.email}>
                Send OTP
              </button>
            </div>
          </form>
        </>
      )}
      {state.view === "RESET_PASSWORD" && (
        <div style={{ width: '30%', margin: '50px auto', boxShadow: "0 0 10px lightgray", borderRadius: "10px", padding: "15px" }}>
          <h2 className="mb-4">Reset Password</h2>
          <form onSubmit={submitResetForm}>
            <div className="mb-3">
              <label htmlFor="otp" className="form-label" style={{ display: "flex", marginTop: "10px", flexDirection: "column", alignItems: "flex-start", fontSize: "18px" }}>Otp:</label>
              <input
                type="number"
                className="form-control"
                name="otp"
                value={state.otp}
                onChange={onChange}
                required
              />
              {state.otpError && <span className="text-danger">{state.otpError}</span>}
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label" style={{ display: "flex", marginTop: "10px", flexDirection: "column", alignItems: "flex-start", fontSize: "18px" }}>Password:</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={state.password}
                onChange={onChange}
                required
              />
              {state.passwordError && <span className="text-danger">{state.passwordError}</span>}
            </div>
            <div className="mb-3">
              <label htmlFor="confirmpassword" className="form-label" style={{ display: "flex", marginTop: "10px", flexDirection: "column", alignItems: "flex-start", fontSize: "18px" }}>Confirm Password:</label>
              <input
                type="password"
                className="form-control"
                name="confirmpassword"
                value={state.confirmpassword}
                onChange={onChange}
                required
              />
              {state.confirmpasswordError && (
                <span className="text-danger">{state.confirmpasswordError}</span>
              )}
            </div>
            <div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!state.password || !state.otp || !state.confirmpassword}
              >
                Reset Password
              </button>
            </div>
          </form>
        </div>

      )}
    </div>
  );
}

export default ForgotPassword;
