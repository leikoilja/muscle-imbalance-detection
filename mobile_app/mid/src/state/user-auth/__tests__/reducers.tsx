import { initialState, userAuth } from "../reducers";
import {
  loginStart,
  loginFinished,
  loginError,
  logoutStart,
  logoutFinished,
  logoutError,
  registrationStart,
  registrationFinished,
  registrationError,
} from "../actions";

describe("userAuth reducer", () => {
  it("returns the initial state", () => {
    expect(userAuth(undefined, {})).toEqual(initialState);
  });
});

describe("userAuth reducer - login", () => {
  it("handles login start", () => {
    expect(userAuth(initialState, loginStart())).toEqual({
      ...initialState,
      isFetching: true,
    });
  });

  it("handles login finish", () => {
    expect(userAuth(initialState, loginFinished({ name: "User" }))).toEqual({
      ...initialState,
      isFetching: false,
      loggedIn: true,
      hasError: false,
      errorMessage: "",
      user: { name: "User" },
    });
  });

  it("handles login error", () => {
    expect(userAuth(initialState, loginError({ message: "error" }))).toEqual({
      ...initialState,
      isFetching: false,
      loggedIn: false,
      hasError: true,
      user: null,
      errorMessage: "error",
    });
  });
});

describe("userAuth reducer - logout", () => {
  it("handles logout start", () => {
    expect(userAuth(initialState, logoutStart())).toEqual({
      ...initialState,
      isFetching: true,
    });
  });

  it("handles logout finish", () => {
    expect(userAuth(initialState, logoutFinished())).toEqual({
      ...initialState,
    });
  });

  it("handles logout error", () => {
    expect(userAuth(initialState, logoutError("error"))).toEqual({
      ...initialState,
      isFetching: false,
      loggedIn: true,
      hasError: true,
      user: null,
      errorMessage: "error",
    });
  });
});

describe("userAuth reducer - registration", () => {
  it("handles logout start", () => {
    expect(userAuth(initialState, registrationStart())).toEqual({
      ...initialState,
      isFetching: true,
    });
  });

  it("handles registration finish", () => {
    expect(
      userAuth(initialState, registrationFinished({ name: "User" }))
    ).toEqual({
      ...initialState,
      isFetching: false,
      hasError: false,
      loggedIn: true,
      errorMessage: "",
      user: { name: "User" },
    });
  });

  it("handles registration error", () => {
    expect(
      userAuth(initialState, registrationError({ message: "error" }))
    ).toEqual({
      ...initialState,
      isFetching: false,
      hasError: true,
      errorMessage: "error",
    });
  });
});
