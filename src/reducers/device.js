import { DEVICE_IS_TOUCH, TOGGLE_THEME } from '../constants/actionsTypes';
import { isTouchDevice } from '../utils';

const initialState = {
  isTouch: isTouchDevice(),
  isDarkMode: true,
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
    default:
      return state;
  }
}
