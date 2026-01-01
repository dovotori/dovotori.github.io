import { createContext, useContext, useReducer } from "react";
import type { AppContext } from "src/types";
import { INITIAL_STATE, mainReducer } from "../reducers";

export const StateContext = createContext<AppContext | undefined>(undefined);

export function useStateCtx(): AppContext {
  const ctx = useContext(StateContext);
  if (!ctx) {
    throw new Error("StateContext not provided (make sure component is wrapped by provider)");
  }
  return ctx;
}

export const StateProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(mainReducer, INITIAL_STATE);
  return <StateContext value={{ state, dispatch }}>{children}</StateContext>;
};
