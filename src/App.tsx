import { Route, Routes } from "react-router-dom";
import "./App.css";
import React from "react";
import RootWrapper from "./components/RootWrapper";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import { GlobalContextProvider } from "./providers/GlobalProvider";
import NonAuth from "./Wrappers/NonAuth";

function App() {
  return (
    <div className="App">
      <GlobalContextProvider>
        <RootWrapper>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<NonAuth element={<Login />} />} />
            <Route path="/signup" element={<NonAuth element={<Signup />} />} />
            <Route
              path="/forgotpassword"
              element={<NonAuth element={<ForgotPassword />} />}
            />
          </Routes>
          <Footer />
        </RootWrapper>
      </GlobalContextProvider>
    </div>
  );
}

export default App;
