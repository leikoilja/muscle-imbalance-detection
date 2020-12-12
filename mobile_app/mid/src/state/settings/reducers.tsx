import { SETTINGS_ACTION_TYPES } from "./actions";

const initialState = {
  bt: {
    device: {},
    isConnected: false,
  },
  theme: "light",
};

export const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SETTINGS_ACTION_TYPES.BT_SAVE_DEVICE:
      const { device } = action;
      return {
        ...state,
        bt: { ...state.bt, device },
      };
    case SETTINGS_ACTION_TYPES.BT_REMOVE_DEVICE:
      return {
        ...state,
        bt: initialState.bt,
      };
    case SETTINGS_ACTION_TYPES.BT_UPDATE_DEVICE_STATE:
      const { isConnected } = action;
      return {
        ...state,
        isConnected,
      };
    case SETTINGS_ACTION_TYPES.THEME_CHANGE:
      const { theme } = action;
      return {
        ...state,
        theme,
      };
    default:
      return state;
  }
};
