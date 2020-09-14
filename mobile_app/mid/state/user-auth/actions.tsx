import { firebase } from "../../firebase/config";
import {
  LogoutFinishedAction,
  User,
  LoginStartAction,
  LoginFinishedAction,
  LoginErrorAction,
  LoginUserAction,
  LogoutUserAction,
  UserAuthAction,
  LogoutStartAction,
  LogoutErrorAction,
} from "../types";
import { Dispatch } from "redux";

export enum USER_AUTH_ACTION_TYPES {
  LOGIN_START = "USER_AUTH/LOGIN_START",
  LOGIN_FINISHED = "USER_AUTH/LOGIN_FINISHED",
  LOGIN_ERROR = "USER_AUTH/LOGIN_ERROR",
  LOGOUT_START = "USER_AUTH/LOGOUT_START",
  LOGOUT_FINISHED = "USER_AUTH/LOGOUT_FINISHED",
  LOGOUT_ERROR = "USER_AUTH/LOGOUT_ERROR",
}

// Login
const loginStart = (): LoginStartAction => ({
  type: USER_AUTH_ACTION_TYPES.LOGIN_START,
});

const loginFinished = (user: User): LoginFinishedAction => ({
  type: USER_AUTH_ACTION_TYPES.LOGIN_FINISHED,
  user,
});

const loginError = (error: string): LoginErrorAction => ({
  type: USER_AUTH_ACTION_TYPES.LOGIN_ERROR,
  error,
});

// Logout
const logoutStart = (): LogoutStartAction => ({
  type: USER_AUTH_ACTION_TYPES.LOGOUT_START,
});

const logoutFinished = (): LogoutFinishedAction => ({
  type: USER_AUTH_ACTION_TYPES.LOGOUT_FINISHED,
});

const logoutError = (error: string): LogoutErrorAction => ({
  type: USER_AUTH_ACTION_TYPES.LOGOUT_ERROR,
  error,
});

//
// Action creators
//
export const loginUser = (
  email: string,
  password: string
): LoginUserAction => async (dispatch) => {
  dispatch(loginStart());
  try {
    const response = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    if (response.error) {
      throw new Error(response);
    }
    dispatch(loginFinished(response.user));
  } catch (error) {
    console.log(error);
    dispatch(loginError(error));
  }
};

export const logoutUser = (): LogoutUserAction => async (
  dispatch: Dispatch<UserAuthAction>
) => {
  dispatch(logoutStart());
  try {
    await firebase.auth().signOut();
    dispatch(logoutFinished());
  } catch (error) {
    dispatch(logoutError(error));
  }
};
