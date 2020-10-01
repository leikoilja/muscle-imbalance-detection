import React from "react";
import HomeScreen from "../HomeScreen/HomeScreen";
import { render, fireEvent } from "@testing-library/react-native";
import { setMockStore } from "../../utils/test_utils";
import { logoutUser } from "../../state/user-auth/actions";

describe("HomeScreen", () => {
  let store;
  let component;

  beforeEach(() => {
    [store, component] = setMockStore(
      { userAuth: { user: { fullName: "Full Name" } } },
      <HomeScreen />
    );
    store.dispatch = jest.fn();
  });

  it("shows welcome screen for user", async () => {
    const { getByTestId, toJSON } = render(component);
    expect(getByTestId("welcome-text")).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it("shows extra content for doctor", async () => {
    [store, component] = setMockStore(
      {
        userAuth: { user: { fullName: "Full Name", isDoctor: true } },
      },
      <HomeScreen />
    );
    const { getByTestId, toJSON } = render(component);
    expect(getByTestId("doctor-info")).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it("loggs-out when Logout button is pressed", async () => {
    const { getByText } = render(component);
    const button = getByText("Log out");
    fireEvent(button, "press");
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    // TODO: Check that logoutUser dispatch has been called
  });
});
