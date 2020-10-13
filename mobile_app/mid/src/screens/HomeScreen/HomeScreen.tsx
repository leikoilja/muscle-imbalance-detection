import * as React from "react";

import { Text, View, TouchableOpacity, Dimensions } from "react-native";
import styles from "./styles";
import { connect } from "react-redux";
import { logoutUser } from "../../state/user-auth/actions";
import { saveBtDevice, updateDeviceIsConnected } from "../../state/bt/actions";
import Button from "../../components/Button";
import BluetoothConnectedDataGraph from "../../components/BluetoothConnectedDataGraph";

class HomeScreen extends React.Component {
  onLogout = async () => {
    const { logoutUser } = this.props;
    await logoutUser();
  };

  onSettings = () => {
    const { navigation } = this.props;
    navigation.navigate("Settings");
  };

  render() {
    const { user } = this.props.auth;
    const { device } = this.props.bt;

    return (
      <View style={styles.container}>
        <Text testID="welcome-text">Welcome, {user.fullName} </Text>
        {user.isDoctor && <Text testID="doctor-info">You are doctor!</Text>}
        {device.address ? (
          <>
            <BluetoothConnectedDataGraph
              device={this.props.bt.device}
              isConnected={this.props.bt.isConnected}
              onSaveBtDevice={this.props.saveBtDevice}
              onUpdateDeviceIsConnected={this.props.updateDeviceIsConnected}
            />
          </>
        ) : (
          <>
            <Text>
              Looks like you have no Bluetooth module setup yet, please go to
              'Settings' to do so!
            </Text>
            <Button
              testID="button-settings"
              style={{ width: "50%" }}
              onPress={this.onSettings}
              text="Settings"
            />
          </>
        )}
        <Button
          testID="button-logout"
          style={{ width: "50%" }}
          onPress={this.onLogout}
          text="Log out"
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.userAuth,
  bt: state.btReducer,
});

const mapDispatchToProps = {
  logoutUser,
  updateDeviceIsConnected,
  saveBtDevice,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
