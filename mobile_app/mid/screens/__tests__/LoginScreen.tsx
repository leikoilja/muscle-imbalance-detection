import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { setMockStore } from "../../utils/test_utils";
import LoginScreen from "../LoginScreen/LoginScreen";
import { initialState } from "../../state/user-auth/reducers";
import { Alert } from "react-native";

Alert.alert = jest.fn();

const createTestProps = (props: Object) => ({
  navigation: {
    navigate: jest.fn(),
  },
  ...props,
});

describe("LoginScreen", () => {
  let store;
  let component;
  let props;

  beforeEach(() => {
    props = createTestProps({});
    [store, component] = setMockStore(
      { userAuth: initialState },
      <LoginScreen {...props} />
    );
  });

  it("shows login form if not logged in", () => {
    const { getByTestId, toJSON } = render(component);
    expect(getByTestId("form-logo")).toBeTruthy();
    expect(getByTestId("form-desc")).toBeTruthy();
    expect(getByTestId("form-email-input")).toBeTruthy();
    expect(getByTestId("form-password-input")).toBeTruthy();
    expect(getByTestId("form-login-button")).toBeTruthy();
    expect(getByTestId("form-footer-button")).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it("navigates to Home if user is logged in", () => {
    [store, component] = setMockStore(
      {
        userAuth: { ...initialState, loggedIn: true },
      },
      <LoginScreen {...props} />
    );
    render(component);
    expect(props.navigation.navigate).toHaveBeenCalledTimes(1);
    expect(props.navigation.navigate).toHaveBeenCalledWith("Home");
  });

  it("navigates to Registration if footer link is pressed", () => {
    const { getByTestId } = render(component);
    const button = getByTestId("form-footer-button");
    fireEvent(button, "press");
    expect(props.navigation.navigate).toHaveBeenCalledTimes(1);
    expect(props.navigation.navigate).toHaveBeenCalledWith("Registration");
  });

  it("shows errors if they exist", () => {
    [store, component] = setMockStore(
      {
        userAuth: {
          ...initialState,
          hasError: true,
          errorMessage: "Error message",
        },
      },
      <LoginScreen {...props} />
    );
    render(component);
    expect(Alert.alert).toHaveBeenCalled();
  });

  it("changes emailValue when typing", () => {
    const { getByTestId } = render(component);
    const textInput = getByTestId("form-email-input");
    fireEvent.changeText(textInput, "example@company.com");
    expect(textInput.props.value).toBe("example@company.com");
  });

  it("changes passwordValue when typing", () => {
    const { getByTestId } = render(component);
    const textInput = getByTestId("form-password-input");
    fireEvent.changeText(textInput, "password");
    expect(textInput.props.value).toBe("password");
  });

  it("loggs-in when Login button is pressed", () => {
    const { getByTestId } = render(component);
    const button = getByTestId("form-login-button");
    fireEvent(button, "press");
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    // TODO: Check that loginUser dispatch has been called
  });
});
