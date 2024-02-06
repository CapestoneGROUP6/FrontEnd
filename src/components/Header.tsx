import { useGlobalContext } from "../providers/GlobalProvider";
import { logout } from "../providers/actionCreators";
import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const { loggedIn, dispatch } = useGlobalContext();
  return (
    <div
      style={{
        width: '100%',
        padding: '10px',
        background: 'black',
        color: 'white !important',
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ color: 'white'}}>Logo</div> {/* Replace 'Logo' with your logo image or text */}
      {loggedIn && <div style={{ color: 'white', cursor: 'pointer'}} onClick={() => dispatch(logout())}>Logout</div>}
      {!loggedIn && (
        <div style={{ color: 'white', marginRight: '15px'}}>
          <Link style={{ color: 'white'}} to="/login">Login</Link> &nbsp;
          <Link style={{ color: 'white'}} to="/signup">Signup</Link>
        </div>
      )}
    </div>
  );
}
