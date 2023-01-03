import {
  DEVICE_IS_TOUCH,
  TOGGLE_THEME,
  SET_LANG,
  SET_CATEGORY,
} from "../constants/actionsTypes";
import { isTouchDevice, getLocationHash, storage } from "../utils";
import availablesLang from "../constants/locales";

export const defaultLang =
  getLocationHash() || storage.getItem("lang") || availablesLang[1].id;

document.documentElement.setAttribute("lang", defaultLang);

const storedDarkMode = storage.getItem("dark");

const initialState = {
  isTouch: isTouchDevice(),
  isDarkMode: storedDarkMode !== null ? storedDarkMode : true,
  lang: defaultLang,
  category: -1,
};

export default function device(state = initialState, action = {}) {
  switch (action.type) {
    case DEVICE_IS_TOUCH:
      return {
        ...state,
        isTouch: action.flag,
      };
    case TOGGLE_THEME: {
      const isDarkMode = !state.isDarkMode;
      storage.setItem("dark", isDarkMode);
      return {
        ...state,
        isDarkMode,
      };
    }
    case SET_LANG: {
      const lang = action.flag.toLowerCase();
      if (
        state.lang !== lang &&
        availablesLang.map((l) => l.id).indexOf(lang) !== -1
      ) {
        storage.setItem("lang", lang);
        document.documentElement.setAttribute("lang", lang);
        return {
          ...state,
          lang,
        };
      }
      return state;
    }
    case SET_CATEGORY: {
      return {
        ...state,
        category: state.category === action.flag ? -1 : action.flag,
      };
    }
    default:
      return state;
  }
}
