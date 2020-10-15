import { createStore, applyMiddleware, combineReducers } from 'redux';
import AsyncStorage from '@react-native-community/async-storage';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import { userAuth } from './user-auth/reducers';
import { settingsReducer } from './settings/reducers';

const rootReducer = combineReducers({
  userAuth, // user-auth reducer
  settingsReducer, // settings reducers
});

// Middleware: Redux Persist Config
const persistConfig = {
  // Root
  key: 'root',
  // Storage Method (React Native)
  storage: AsyncStorage,
  // Whitelist (Save Specific Reducers)
  // whitelist: [
  //   'authReducer',
  // ],
  // Blacklist (Don't Save Specific Reducers)
  // blacklist: [
  //   'counterReducer',
  // ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Redux: Store
const store = createStore(
  persistedReducer,
  applyMiddleware(thunkMiddleware, logger),
);
// Middleware: Redux Persist Persister
const persistor = persistStore(store);
//
// Exports
export { store, persistor };
