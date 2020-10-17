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
  SAVE_MEASUREMENT = "USER/SAVE_MEASUREMENT",
}

// Login
export const loginStart = (): LoginStartAction => ({
  type: USER_AUTH_ACTION_TYPES.LOGIN_START,
});

export const loginFinished = (user: User): LoginFinishedAction => ({
  type: USER_AUTH_ACTION_TYPES.LOGIN_FINISHED,
  user,
});

export const loginError = (error: string): LoginErrorAction => ({
  type: USER_AUTH_ACTION_TYPES.LOGIN_ERROR,
  error,
});

// Logout
export const logoutStart = (): LogoutStartAction => ({
  type: USER_AUTH_ACTION_TYPES.LOGOUT_START,
});

export const logoutFinished = (): LogoutFinishedAction => ({
  type: USER_AUTH_ACTION_TYPES.LOGOUT_FINISHED,
});

export const logoutError = (error: string): LogoutErrorAction => ({
  type: USER_AUTH_ACTION_TYPES.LOGOUT_ERROR,
  error,
});

// Registration
export const registrationStart = (): RegistrationStartAction => ({
  type: USER_AUTH_ACTION_TYPES.REGISTRATION_START,
});

export const registrationFinished = (
  user: User
): RegistrationFinishedAction => ({
  type: USER_AUTH_ACTION_TYPES.REGISTRATION_FINISHED,
  user,
});

export const registrationError = (error: string): RegistrationErrorAction => ({
  type: USER_AUTH_ACTION_TYPES.REGISTRATION_ERROR,
  error,
});

// User related
export const saveMeasurement = (measurementUid: string) => ({
  type: USER_AUTH_ACTION_TYPES.SAVE_MEASUREMENT,
  measurementUid,
});

//
// Action creators
//
export const loginUser = (
  email: string,
  password: string
): LoginUserAction => async (dispatch) => {
  dispatch(loginStart());
  let user_data = {};
  await firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((response) => {
      let user = response.user;
      firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (!doc.exists) {
            console.log("No documents");
          } else {
            user_data = doc.data();
          }
        })
        .catch((error) => {
          dispatch(loginError(error));
        })
        .finally(() => {
          user = { ...user_data, user };
          dispatch(loginFinished(user));
        });
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
      const user = response.user;
      const account = {
        fullName: fullName,
        isDoctor: false,
        isSuperuser: false,
      };
      firebase.firestore().collection("users").doc(user.uid).set(account);
      dispatch(registrationFinished(user));
    })
    .catch((error) => {
      dispatch(registrationError(error));
    });
};
