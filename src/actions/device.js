import { DEVICE_IS_TOUCH, TOGGLE_THEME } from '../constants/actionsTypes';

export const deviceIsTouch = (flag) => ({ type: DEVICE_IS_TOUCH, flag });
export const toggleTheme = () => ({ type: TOGGLE_THEME });
