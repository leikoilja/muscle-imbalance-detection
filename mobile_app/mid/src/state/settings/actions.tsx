export enum SETTINGS_ACTION_TYPES {
  BT_SAVE_DEVICE = "SETTINGS/BT/SAVE_DEVICE",
  BT_UPDATE_DEVICE_STATE = "SETTINGS/BT/UPDATE_DEVICE_STATE",
  THEME_CHANGE = "SETTINGS/THEME/CHANGE",
}

export const saveBtDevice = (device) => ({
  type: SETTINGS_ACTION_TYPES.BT_SAVE_DEVICE,
  device,
});

export const updateDeviceIsConnected = (isConnected) => ({
  type: SETTINGS_ACTION_TYPES.BT_UPDATE_DEVICE_STATE,
  isConnected,
});

export const changeTheme = (theme) => ({
  type: SETTINGS_ACTION_TYPES.THEME_CHANGE,
  theme,
});
