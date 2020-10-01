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

// Login
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

// Logout
export type LogoutUserAction = {};

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

// Registration
export type RegisterUserAction = {
  email: string;
  password: string;
};

export type RegistrationAction = {
  email: string;
  password: string;
};

export type RegistrationStartAction = {
  type: string;
};

export type RegistrationFinishedAction = {
  type: string;
  user: User;
};

export type RegistrationErrorAction = {
  type: string;
  error: string;
};

export type UserAuthAction =
  | LoginFinishedAction
  | LoginStartAction
  | LoginErrorAction
  | LogoutStartAction
  | LogoutErrorAction
  | LogoutFinishedAction;
