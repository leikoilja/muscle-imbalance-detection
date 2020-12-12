export enum SETTINGS_ACTION_TYPES {
  BT_SAVE_DEVICE = "SETTINGS/BT/SAVE_DEVICE",
  BT_REMOVE_DEVICE = "SETTINGS/BT/REMOVE_DEVICE",
  BT_UPDATE_DEVICE_STATE = "SETTINGS/BT/UPDATE_DEVICE_STATE",
  THEME_CHANGE = "SETTINGS/THEME/CHANGE",
}

export const saveBtDevice = (device) => ({
  type: SETTINGS_ACTION_TYPES.BT_SAVE_DEVICE,
  device,
});

export const removeBtDevice = () => ({
  type: SETTINGS_ACTION_TYPES.BT_REMOVE_DEVICE,
});

export const updateDeviceIsConnected = (isConnected) => ({
  type: SETTINGS_ACTION_TYPES.BT_UPDATE_DEVICE_STATE,
  isConnected,
});

export const changeTheme = (theme) => ({
  type: SETTINGS_ACTION_TYPES.THEME_CHANGE,
  theme,
});
