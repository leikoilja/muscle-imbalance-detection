import {
  AddUserAction,
  User,
  UpdateUserAction,
  RemoveUserAction,
} from "../types";

export enum USER_LIST_ACTION_TYPES {
  ADD_USER = "USER_LIST/ADD_USER",
  REMOVE_USER = "USER_LIST/REMOVE_USER",
  UPDATE_USER = "USER_LIST/UPDATE_USER",
}

export const addUser = (
  name: string,
  surname: string,
  age: number
): AddUserAction => ({
  type: USER_LIST_ACTION_TYPES.ADD_USER,
  userData: {
    name,
    surname,
    age,
  },
});

export const updateUser = (index: number, user: User): UpdateUserAction => ({
  type: USER_LIST_ACTION_TYPES.UPDATE_USER,
  index: index,
  userData: user,
});

export const removeUser = (index: number): RemoveUserAction => ({
  type: USER_LIST_ACTION_TYPES.REMOVE_USER,
  index: index,
});
