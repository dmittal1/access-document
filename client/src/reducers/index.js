import { combineReducers } from 'redux';
import documentReducer from './documentReducer';
import errorReducer from './errorReducer';
import authReducer from './authReducer';

export default combineReducers({
  item: documentReducer,
  error: errorReducer,
  auth: authReducer
}); 