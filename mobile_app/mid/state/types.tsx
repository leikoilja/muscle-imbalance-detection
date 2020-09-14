export type User = {
  uid: number;
  email: string;
  fullName: string;
};

export type AuthState = {
  loggedIn: boolean;
  isFetching: boolean;
  hasError: boolean;
  errorMessage: string;
  user: User;
};

export type LoginUserAction = {
  email: string;
  password: string;
};

export type LoginStartAction = {
  type: string;
};

export type LoginFinishedAction = {
  type: string;
  user: User;
};

export type LoginErrorAction = {
  type: string;
  error: string;
};

export type LogoutStartAction = {
  type: string;
};

export type LogoutFinishedAction = {
  type: string;
};

export type LogoutErrorAction = {
  type: string;
  error: string;
};

export type LogoutUserAction = {};

export type UserAuthAction =
  | LoginFinishedAction
  | LoginStartAction
  | LoginErrorAction
  | LogoutStartAction
  | LogoutErrorAction
  | LogoutFinishedAction;
