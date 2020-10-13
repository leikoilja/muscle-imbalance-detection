import { createStore, applyMiddleware, combineReducers } from "redux";
import thunkMiddleware from "redux-thunk";
import { userAuth } from "./user-auth/reducers";
import { btReducer } from "./bt/reducers";
import logger from "redux-logger";

const rootReducer = combineReducers({
  userAuth, // this is the user-auth reducer
  btReducer, // bluetooth reducers
});

export default () => {
  const store = createStore(
    rootReducer,
    applyMiddleware(thunkMiddleware, logger)
  );
  return { store };
};
