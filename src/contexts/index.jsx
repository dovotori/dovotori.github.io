import { createContext, useReducer } from "react";
import { INITIAL_STATE, mainReducer } from "../reducers";

export const StateContext = createContext({});

export const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(mainReducer, INITIAL_STATE);
  return <StateContext value={{ state, dispatch }}>{children}</StateContext>;
};
