import React from "react";

import { Provider } from "react-redux";
import RootNavigator from "./navigation/RootNavigator";

import configureStore from "./state/store";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";

const { store } = configureStore();

export default function App() {
  const isLoadingComplete = useCachedResources();
  // const colorScheme = useColorScheme();
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <Provider store={store}>
        <RootNavigator />
      </Provider>
    );
  }
}
