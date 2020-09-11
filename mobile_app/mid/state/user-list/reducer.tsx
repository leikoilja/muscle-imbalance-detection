import { AddUserAction, UserListState, UserListAction } from "../types";
import { USER_LIST_ACTION_TYPES } from "./actions";

export const initialState: UserListState = [];

export const userList = (
  state: UserListState = initialState,
  action: UserListAction
) => {
  const newState: UserListState = deepClone(state); // a deep cloning function

  switch (action.type) {
    case USER_LIST_ACTION_TYPES.ADD_USER:
      // pay attention to type-casting on action
      const { name, surname, age } = <AddUserAction>action;
      return [...newState, { name, surname, age }];

    // define rest of actions here
    default:
      return newState;
  }
};
