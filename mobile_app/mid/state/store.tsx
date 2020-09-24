import { createStore, applyMiddleware, combineReducers } from "redux";
import thunkMiddleware from "redux-thunk";
import { userAuth } from "./user-auth/reducers";
import logger from "redux-logger";

const rootReducer = combineReducers({
  userAuth, // this is the user-auth reducer
  // other sub-states reducers go here
});

export default () => {
  const store = createStore(
    rootReducer,
    applyMiddleware(thunkMiddleware, logger)
  );
  return { store };
};