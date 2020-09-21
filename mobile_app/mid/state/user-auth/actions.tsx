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
  RegistrationErrorAction,
  RegistrationStartAction,
  RegistrationFinishedAction,
  RegisterUserAction,
} from "../types";
import { Dispatch } from "redux";

export enum USER_AUTH_ACTION_TYPES {
  LOGIN_START = "USER_AUTH/LOGIN_START",
  LOGIN_FINISHED = "USER_AUTH/LOGIN_FINISHED",
  LOGIN_ERROR = "USER_AUTH/LOGIN_ERROR",
  LOGOUT_START = "USER_AUTH/LOGOUT_START",
  LOGOUT_FINISHED = "USER_AUTH/LOGOUT_FINISHED",
  LOGOUT_ERROR = "USER_AUTH/LOGOUT_ERROR",
  REGISTRATION_START = "USER_AUTH/REGISTRATION_START",
  REGISTRATION_FINISHED = "USER_AUTH/REGISTRATION_FINISHED",
  REGISTRATION_ERROR = "USER_AUTH/REGISTRATION_ERROR",
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

// Registration
const registrationStart = (): RegistrationStartAction => ({
  type: USER_AUTH_ACTION_TYPES.REGISTRATION_START,
});

const registrationFinished = (user: User): RegistrationFinishedAction => ({
  type: USER_AUTH_ACTION_TYPES.REGISTRATION_FINISHED,
  user,
});

const registrationError = (error: string): RegistrationErrorAction => ({
  type: USER_AUTH_ACTION_TYPES.REGISTRATION_ERROR,
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
  await firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((response) => {
      dispatch(loginFinished(response.user));
    })
    .catch((error) => {
      dispatch(loginError(error));
    });
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

export const registerUser = (
  email: string,
  password: string,
  fullName: string
): RegisterUserAction => async (dispatch) => {
  dispatch(registrationStart());
  await firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((response) => {
      response.user.updateProfile({
        fullName: fullName,
      });
      dispatch(registrationFinished(response.user));
    })
    .catch((error) => {
      dispatch(registrationError(error));
    });
};
