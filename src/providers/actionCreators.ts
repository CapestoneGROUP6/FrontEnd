import { CustomDispatchAction, User } from "../types";

export const login = (token: string): CustomDispatchAction => {
  return {
    type: "LOGIN",
    payload: {
      token,
    },
  };
};

export const saveUser = (user: User): CustomDispatchAction => {
  return {
    type: "SAVE_USER",
    payload: {
      user,
    },
  };
};


export const logout = (): CustomDispatchAction => {
  return {
    type: "LOGOUT",
    payload: {
    },
  };
};
