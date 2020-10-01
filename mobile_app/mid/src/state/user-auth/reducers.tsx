import { AuthState, UserAuthAction } from "../types";
import { USER_AUTH_ACTION_TYPES } from "./actions";

export const initialState: AuthState = {
  loggedIn: false,
  isFetching: false,
  hasError: false,
  errorMessage: "",
  user: null,
};

export const userAuth = (
  state: AuthState = initialState,
  action: UserAuthAction
) => {
  switch (action.type) {
    case USER_AUTH_ACTION_TYPES.LOGIN_START:
      return {
        ...state,
        isFetching: true,
      };
    case USER_AUTH_ACTION_TYPES.LOGIN_FINISHED:
      const { user } = action;
      return {
        ...state,
        isFetching: false,
        loggedIn: true,
        hasError: false,
        errorMessage: "",
        user,
      };
    case USER_AUTH_ACTION_TYPES.LOGIN_ERROR:
      const { error } = action;
      return {
        ...state,
        isFetching: false,
        loggedIn: false,
        hasError: true,
        user: null,
        errorMessage: error.message,
      };
    case USER_AUTH_ACTION_TYPES.LOGOUT_START: {
      return {
        ...state,
        isFetching: true,
      };
    }
    case USER_AUTH_ACTION_TYPES.LOGOUT_FINISHED: {
      return {
        ...initialState,
      };
    }
    case USER_AUTH_ACTION_TYPES.LOGOUT_ERROR: {
      const { error } = action;
      return {
        ...state,
        isFetching: false,
        loggedIn: true,
        hasError: true,
        errorMessage: error,
      };
    }
    case USER_AUTH_ACTION_TYPES.REGISTRATION_START: {
      return {
        ...state,
        isFetching: true,
      };
    }
    case USER_AUTH_ACTION_TYPES.REGISTRATION_FINISHED: {
      const { user } = action;
      return {
        ...state,
        isFetching: false,
        hasError: false,
        loggedIn: true,
        errorMessage: "",
        user,
      };
    }
    case USER_AUTH_ACTION_TYPES.REGISTRATION_ERROR: {
      const { error } = action;
      return {
        ...state,
        isFetching: false,
        hasError: true,
        errorMessage: error.message,
      };
    }
    default:
      return state;
  }
};
