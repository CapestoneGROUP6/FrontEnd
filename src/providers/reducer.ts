import { CustomDispatchAction, GlobalContextState, User } from "../types";

export const globalReducer = (
  state: GlobalContextState,
  action: CustomDispatchAction
): GlobalContextState => {
  switch (action.type) {
    case "LOGIN":
      const { token } = action.payload;
      const loggedIn = !!token;
      return { ...state, loggedIn, token };
    case "SAVE_USER": {
      const { user } = action.payload;
      const tokenValue = state.token || localStorage.token;
      const loggedIn = !!tokenValue;
      return { ...state, user, loggedIn, token: tokenValue };
    }
    case "LOGOUT":
      return { ...state, loggedIn: false, user: {} as User, token: "" };
    default:
      return state;
  }
};
