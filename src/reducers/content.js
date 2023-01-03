import { SET_LANG } from "../constants/actionsTypes";
import * as contents from "../store/initialState";
import { defaultLang } from "./device";

const initialState = {
  ...contents[defaultLang],
};

export default function device(
  state = initialState,
  action = {},
  otherState = {},
) {
  switch (action.type) {
    case SET_LANG: {
      const newContent = contents[otherState.device.lang];
      return newContent || state;
    }
    default:
      return state;
  }
}
