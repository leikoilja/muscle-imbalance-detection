import * as React from "react";

import { Text, View, TouchableOpacity, Platform } from "react-native";
import styles from "./styles";
import BluetoothSetting from "../../components/BluetoothSetting";

export default class SettingsScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.settingBlock}>
          <View style={styles.settingTitle}>
            <Text style={styles.settingTitleText}>Bluetooth settings</Text>
          </View>
          <View style={styles.settingBody}>
            {Platform.OS === "android" ? (
              <BluetoothSetting />
            ) : (
              <Text style={styles.settingNotSupported}>
                We are sorry, but your OS is not supported for automatic device
                discovery and connection. Please go to system settings and
                connect to the Bluetooth device
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  }
}
