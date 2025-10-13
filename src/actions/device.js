import {
  DEVICE_IS_TOUCH,
  TOGGLE_THEME,
  SET_LANG,
  SET_CATEGORY,
} from "../constants/actionsTypes";

export const deviceIsTouch = (flag) => ({ type: DEVICE_IS_TOUCH, flag });
export const toggleTheme = () => ({ type: TOGGLE_THEME });
export const setLang = (flag) => ({ type: SET_LANG, flag });
export const setCategory = (flag) => ({ type: SET_CATEGORY, flag });
