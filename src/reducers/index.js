import { SET_CATEGORY, SET_LANG, TOGGLE_THEME } from '../constants/actionsTypes';
import availablesLang from '../constants/locales';
import * as contents from '../store/initialState';
import { getLocationHash, isTouchDevice, storage } from '../utils';

const defaultLang = getLocationHash() || storage.getItem('lang') || availablesLang[1].id;

document.documentElement.setAttribute('lang', defaultLang);

const storedDarkMode = storage.getItem('dark');

const INITIAL_DEVICE = {
  isTouch: isTouchDevice(),
  isDarkMode: storedDarkMode !== null ? storedDarkMode : true,
  lang: defaultLang,
  category: -1,
};

const INITIAL_CONTENT = {
  ...contents[defaultLang],
};

export const INITIAL_STATE = {
  device: INITIAL_DEVICE,
  content: INITIAL_CONTENT,
};

export function mainReducer(state, action) {
  switch (action.type) {
    case TOGGLE_THEME: {
      const isDarkMode = !state.isDarkMode;
      storage.setItem('dark', isDarkMode);
      return {
        ...state,
        device: { ...state.device, isDarkMode },
      };
    }
    case SET_LANG: {
      const newContent = contents[action.flag];
      return {
        ...state,
        content: newContent || state,
        device: { ...state.device, lang: action.flag },
      };
    }
    case SET_CATEGORY: {
      return {
        ...state,
        device: {
          ...state.device,
          category: state.category === action.flag ? -1 : action.flag,
        },
      };
    }
    default:
      return state;
  }
}
