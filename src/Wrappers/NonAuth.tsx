import { useGlobalContext } from "providers/GlobalProvider";
import React from "react";
import { Navigate } from "react-router-dom";

type NonAuthType = {
  element: React.ReactNode;
};

export default function NonAuth(props: NonAuthType) {
  const { loggedIn } = useGlobalContext();

  if (!loggedIn) {
    return <>{props.element}</>;
  } else {
    return <Navigate to="/" replace />;
  }
}
