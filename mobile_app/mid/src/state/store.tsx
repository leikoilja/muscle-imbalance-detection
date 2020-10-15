import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';
import { userAuth } from './user-auth/reducers';
import { settingsReducer } from './settings/reducers';

const rootReducer = combineReducers({
  userAuth, // user-auth reducer
  settingsReducer, // settings reducers
});

export default () => {
  const store = createStore(
    rootReducer,
    applyMiddleware(thunkMiddleware, logger),
  );
  return { store };
};
