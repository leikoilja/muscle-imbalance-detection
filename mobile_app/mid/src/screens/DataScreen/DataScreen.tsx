import * as React from "react";

import { Dimensions } from "react-native";
import { Button, Layout, Text, Divider } from "@ui-kitten/components";
import styles from "./styles";
import { connect } from "react-redux";
import { logoutUser } from "../../state/user-auth/actions";
import {
  saveBtDevice,
  updateDeviceIsConnected,
} from "../../state/settings/actions";
import BluetoothConnectedDataGraph from "../../components/BluetoothConnectedDataGraph";

class HomeScreen extends React.Component {
  onLogout = async () => {
    const { logoutUser } = this.props;
    await logoutUser();
  };

  onSettings = () => {
    const { navigation } = this.props;
    navigation.navigate("Settings", { screen: "BluetoothSettingScreen" });
  };

  render() {
    const { user } = this.props.auth;
    const { device } = this.props.bt;

    return (
      <Layout style={styles.container}>
        <Text testID="welcome-text">Welcome, {user.fullName}!</Text>
        {user.isDoctor && <Text testID="doctor-info">You are doctor!</Text>}
        <Divider />
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
            <Text style={styles.descText}>
              Looks like you have no Bluetooth module setup yet, please go to
              'Settings' to do so!
            </Text>
            <Button
              testID="button-settings"
              style={{ width: "50%" }}
              onPress={this.onSettings}
            >
              Bluetooth Settings
            </Button>
          </>
        )}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.userAuth,
  bt: state.settingsReducer.bt,
});

const mapDispatchToProps = {
  logoutUser,
  updateDeviceIsConnected,
  saveBtDevice,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
