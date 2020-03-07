import { combineReducers } from 'redux';
import device from './device';
import initialState from '../store/initialState';

const content = (state = initialState) => state;

export default combineReducers({
  content,
  device,
});
