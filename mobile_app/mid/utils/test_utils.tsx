import React from "react";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import thunkMiddleware from "redux-thunk";

export const setMockStore = (store_data: object, child_component) => {
  const mockStore = configureStore([thunkMiddleware]);
  const store = mockStore(store_data);
  const component = <Provider store={store}>{child_component}</Provider>;
  store.dispatch = jest.fn();
  return [store, component];
};
