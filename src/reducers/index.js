import {
  SET_CATEGORY,
  SET_LANG,
  TOGGLE_THEME,
} from "../constants/actionsTypes";
import availablesLang from "../constants/locales";
import { en, fr, jp } from "../store/initialState";
import { getLocationHash, isTouchDevice, storage } from "../utils";

const CONTENTS_MAP = { en, jp, fr };

const defaultLang =
  getLocationHash() || storage.getItem("lang") || availablesLang[1].id;

document.documentElement.setAttribute("lang", defaultLang);

const storedDarkMode = storage.getItem("dark");

const INITIAL_DEVICE = {
  isTouch: isTouchDevice(),
  isDarkMode: storedDarkMode !== null ? storedDarkMode : true,
  lang: defaultLang,
  category: -1,
};

const INITIAL_CONTENT = {
  ...CONTENTS_MAP[defaultLang],
};

export const INITIAL_STATE = {
  device: INITIAL_DEVICE,
  content: INITIAL_CONTENT,
};

export function mainReducer(state, action) {
  switch (action.type) {
    case TOGGLE_THEME: {
      const isDarkMode = !state.device.isDarkMode;
      storage.setItem("dark", isDarkMode);
      return {
        ...state,
        device: { ...state.device, isDarkMode },
      };
    }
    case SET_LANG: {
      const newContent = CONTENTS_MAP[action.flag];
      return {
        ...state,
        content: newContent || state.content,
        device: { ...state.device, lang: action.flag },
      };
    }
    case SET_CATEGORY: {
      return {
        ...state,
        device: {
          ...state.device,
          category: state.device.category === action.flag ? -1 : action.flag,
        },
      };
    }
    default:
      return state;
  }
}
