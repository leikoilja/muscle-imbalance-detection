import { BT_ACTION_TYPES } from "./actions";

const initialState = {
  device: {},
  isConnected: false,
};

export const btReducer = (state = initialState, action) => {
  switch (action.type) {
    case BT_ACTION_TYPES.SAVE_DEVICE:
      const { device } = action;
      return {
        ...state,
        device,
      };
    case BT_ACTION_TYPES.UPDATE_DEVICE_STATE:
      const { isConnected } = action;
      return {
        ...state,
        isConnected,
      };
    default:
      return state;
  }
};
