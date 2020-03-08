import { SET_LANG } from '../constants/actionsTypes';
import * as contents from '../store/initialState';
import { getLocationHash } from '../utils';

export default function device(state = contents[getLocationHash()], action) {
  switch (action.type) {
    case SET_LANG: {
      const newContent = contents[action.flag.toLowerCase()];
      return newContent || state;
    }
    default:
      return state;
  }
}
