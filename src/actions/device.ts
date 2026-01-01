import type {
  ActionSetCategory,
  ActionSetLang,
  ActionSetTouch,
  ActionToggleTheme,
  Category,
  Locale,
} from "src/types";
import { DEVICE_IS_TOUCH, SET_CATEGORY, SET_LANG, TOGGLE_THEME } from "../constants/actionsTypes";

export const deviceIsTouch = (flag: boolean): ActionSetTouch => ({ type: DEVICE_IS_TOUCH, flag });
export const toggleTheme = (): ActionToggleTheme => ({ type: TOGGLE_THEME });
export const setLang = (flag: Locale): ActionSetLang => ({ type: SET_LANG, flag });
export const setCategory = (flag: Category): ActionSetCategory => ({ type: SET_CATEGORY, flag });
