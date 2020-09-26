import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { setMockStore } from "../../utils/test_utils";
import RegistrationScreen from "../RegistrationScreen/RegistrationScreen";
import { initialState } from "../../state/user-auth/reducers";

const createTestProps = (props: Object) => ({
  navigation: {
    navigate: jest.fn(),
  },
  ...props,
});

describe("RegistrationScreen", () => {
  let store;
  let component;
  let props;

  beforeEach(() => {
    props = createTestProps({});
    [store, component] = setMockStore(
      { userAuth: initialState },
      <RegistrationScreen {...props} />
    );
    store.dispatch = jest.fn();
  });

  it("shows registration form", () => {
    const { getByTestId, toJSON } = render(component);
    expect(getByTestId("form-logo")).toBeTruthy();
    expect(getByTestId("form-fullName-input")).toBeTruthy();
    expect(getByTestId("form-email-input")).toBeTruthy();
    expect(getByTestId("form-password-input")).toBeTruthy();
    expect(getByTestId("form-confirmPassword-input")).toBeTruthy();
    expect(getByTestId("form-registration-button")).toBeTruthy();
    expect(getByTestId("form-footer-button")).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it("navigates to Login if footer link is pressed", () => {
    const { getByTestId } = render(component);
    const button = getByTestId("form-footer-button");
    fireEvent(button, "press");
    expect(props.navigation.navigate).toHaveBeenCalledTimes(1);
    expect(props.navigation.navigate).toHaveBeenCalledWith("Login");
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
    const button = getByTestId("form-registration-button");
    fireEvent(button, "press");
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    // TODO: Check that registerUser dispatch has been called
  });
});
