import React, { createContext, useContext, useReducer } from "react";
import { GlobalContext, GlobalContextState, User } from "../types";
import { globalReducer } from "./reducer";

const GlobalContextInstance = createContext<GlobalContext>({} as GlobalContext);

export const GlobalContextProvider = (props: { children: React.ReactNode }) => {
  const getInitialState = (): GlobalContextState => {
    return {
      loggedIn: false,
      user: {} as User,
      token: "",
    };
  };
  const [state, dispatch] = useReducer(globalReducer, getInitialState());

  return (
    <GlobalContextInstance.Provider value={{ ...state, dispatch }}>
      {props.children}
    </GlobalContextInstance.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContextInstance);
  return context;
};
