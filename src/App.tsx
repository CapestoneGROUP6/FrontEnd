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
import AddProduct from "pages/AddProduct";
import Auth from "Wrappers/Auth";
import ProductsList from "pages/BooksList";
import NewHeader from "components/NewHeader";
import AddEditProfile from "pages/AddEditProfile";
import UserCart from "pages/UserCart";
import ProductDetails from "pages/ProductDetails";
import CheckoutPage from "pages/CheckoutPage";
import UserOrders from "pages/UserOrders";

function App() {
  return (
    <div className="App">
      <GlobalContextProvider>
        <RootWrapper>
          <NewHeader />
          <div style={{minHeight:"80vh", padding:"15px",  marginTop: '5rem'}}>
          <Routes>
            <Route path="/" element={<Auth element={<Home/>} />} />
            <Route path="/login" element={<NonAuth element={<Login />} />} />
            <Route path="/signup" element={<NonAuth element={<Signup />} />} />
            <Route
              path="/forgotpassword"
              element={<NonAuth element={<ForgotPassword />} />}
            />
            <Route
              path="/addproduct"
              element={<Auth element={<AddProduct />} />}
            />
             <Route
              path="/cart"
              element={<Auth element={<UserCart />} />}
            />
            <Route
              path="/products"
              element={<Auth element={<ProductsList />} />}
            />
            <Route
              path="/checkout"
              element={<Auth element={<CheckoutPage />} />}
            />
            <Route
              path="/productdetails/:id"
              element={<Auth element={<ProductDetails />} />}
            />
            <Route
              path="/profile"
              element={<Auth element={<AddEditProfile />} />}
            />
            <Route
              path="/orders"
              element={<Auth element={<UserOrders />} />}
            />
          </Routes>
          </div>
          <Footer />
        </RootWrapper>
      </GlobalContextProvider>
    </div>
  );
}

export default App;
