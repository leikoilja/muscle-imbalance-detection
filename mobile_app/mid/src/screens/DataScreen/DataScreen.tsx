import * as React from "react";

import { View, Dimensions } from "react-native";
import { Icon, Button, Layout, Text, Divider } from "@ui-kitten/components";
import styles from "./styles";
import { connect } from "react-redux";
import { logoutUser, saveMeasurement } from "../../state/user-auth/actions";
import {
  saveBtDevice,
  updateDeviceIsConnected,
} from "../../state/settings/actions";
import BluetoothConnectedDataGraph from "../../components/BluetoothConnectedDataGraph";

const ArchiveIcon = (props) => <Icon {...props} name="archive" />;

class DataScreen extends React.Component {
  onLogout = async () => {
    const { logoutUser } = this.props;
    await logoutUser();
  };

  onMeasurementsPress = () => {
    const { navigation } = this.props;
    const { measurements } = this.props.auth;
    navigation.navigate("MeasurementsScreen", {
      measurements,
    });
  };

  onSettingsPress = () => {
    const { navigation } = this.props;
    navigation.navigate("Settings", { screen: "BluetoothSettingScreen" });
  };

  render() {
    const { user } = this.props.auth;
    const { device } = this.props.bt;
    const { measurements } = this.props.auth;

    return (
      <Layout style={styles.container}>
        {measurements.length > 0 && (
          <View style={styles.measurementsButtonContainer}>
            <Button
              status="info"
              accessoryRight={ArchiveIcon}
              onPress={this.onMeasurementsPress}
            >
              Measurements
            </Button>
          </View>
        )}
        {device.address ? (
          <>
            <BluetoothConnectedDataGraph
              userUid={user.user.uid}
              saveMeasurement={this.props.saveMeasurement}
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
              onPress={this.onSettingsPress}
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
  saveMeasurement,
};

export default connect(mapStateToProps, mapDispatchToProps)(DataScreen);
