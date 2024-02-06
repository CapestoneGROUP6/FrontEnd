import React, { useEffect, useState } from "react";
import API from "../services/APIService";
import { useGlobalContext } from "../providers/GlobalProvider";
import { User } from "../types";
import { saveUser } from "../providers/actionCreators";

export default function RootWrapper(props: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const { dispatch, token } = useGlobalContext();

  useEffect(() => {
    const getUserDetailsBasedOnToken = async () => {
      try {
        const response = await API.getInstance().get("/user/profile");
        if (response.status === 200 && response?.data?.status) {
          const user = response.data.user as User;
          dispatch(saveUser(user));
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    try {
      const tokenValue = token || localStorage.token;
      if (tokenValue) {
        localStorage.token = tokenValue;
        getUserDetailsBasedOnToken();
      } else {
        setLoading(false);
      }
    } catch (error) {}
  }, [token]);

  if (loading) return <></>;

  return <>{props.children}</>;
}
