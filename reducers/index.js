import { combineReducers } from 'redux';

import mapregionReducer from './mapregion.reducer';
import stepReducer from './step.reducer';
import authReducer from './auth.reducer';
import userReducer from './user.reducer';
import bankReducer from './bank.reducer';

const rootReducer = combineReducers({
  mapregion: mapregionReducer,
  step: stepReducer,
  auth: authReducer,
  user: userReducer,
  bank: bankReducer
});

export default rootReducer;
