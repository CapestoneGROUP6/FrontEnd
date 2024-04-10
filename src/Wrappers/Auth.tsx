import { useGlobalContext } from "providers/GlobalProvider";
import React from "react";
import { Navigate } from "react-router-dom";

type AuthType = {
  element: React.ReactNode;
};

export default function Auth(props: AuthType) {
  const { loggedIn } = useGlobalContext();

  if (loggedIn) {
    return <>{props.element}</>;
  } else {
    return <Navigate to="/login" replace />;
  }
}
