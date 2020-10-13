export enum BT_ACTION_TYPES {
  SAVE_DEVICE = "BT/SAVE_DEVICE",
  UPDATE_DEVICE_STATE = "BR/UPDATE_DEVICE_STATE",
}

export const saveBtDevice = (device) => ({
  type: BT_ACTION_TYPES.SAVE_DEVICE,
  device,
});

export const updateDeviceIsConnected = (isConnected) => ({
  type: BT_ACTION_TYPES.UPDATE_DEVICE_STATE,
  isConnected,
});
