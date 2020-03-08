import { DEVICE_IS_TOUCH, TOGGLE_THEME, SET_LANG } from '../constants/actionsTypes';
import { isTouchDevice, getLocationHash } from '../utils';
import availablesLang from '../constants/lang';


const initialState = {
  isTouch: isTouchDevice(),
  isDarkMode: true,
  lang: getLocationHash(),
};

export default function device(state = initialState, action) {
  switch (action.type) {
    case DEVICE_IS_TOUCH:
      return {
        ...state,
        isTouch: action.flag,
      };
    case TOGGLE_THEME:
      return {
        ...state,
        isDarkMode: !state.isDarkMode,
      };
    case SET_LANG: {
      if (availablesLang.indexOf(action.flag.toLowerCase()) !== -1) {
        return {
          ...state,
          lang: action.flag,
        };
      }
      return state;
    }
    default:
      return state;
  }
}
