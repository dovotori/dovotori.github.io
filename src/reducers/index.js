import { combineReducers } from 'redux';
import device from './device';
import content from './content';

export default combineReducers({
  content,
  device,
});
