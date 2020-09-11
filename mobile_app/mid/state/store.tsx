// import { combineReducers } from "react-redux";
// import { AppState } from "./types";
// import { userList } from "./user-list/reducer";
//
// export default store.create(
//   combineReducers<AppState>(
//     userList // this is the user-list reducer
//     // other sub-states reducers go here
//   )
// );

import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { firebase } from "../firebase/config";

//
// Initial State...
//
const initialState = {
  personData: {},
};

//
// Reducer...
//
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "setPersonData":
      return { ...state, personData: action.value };
    default:
      return state;
  }
};

//
// Action Creators
//
const setPersonData = (personData) => {
  return {
    type: "setPersonData",
    value: personData,
  };
};

//
// Actions
//
const watchPersonData = () => {
  return function (dispatch) {
    firebase
      .database()
      .ref("person")
      .on(
        "value",
        function (snapshot) {
          var personData = snapshot.val();
          var actionSetPersonData = setPersonData(personData);
          dispatch(actionSetPersonData);
        },
        function (error) {
          console.log(error);
        }
      );
  };
};
export { setPersonData, watchPersonData };

//
// Store...
//
const store = createStore(reducer, applyMiddleware(thunkMiddleware));
export { store };
