import * as React from "react";
import { View, TouchableOpacity, FlatList } from "react-native";
import {
  Button,
  ButtonGroup,
  Layout,
  Spinner,
  Icon,
  TopNavigation,
  TopNavigationAction,
  Text,
} from "@ui-kitten/components";
import RNBluetoothClassic, {
  BTEvents,
  BTCharsets,
} from "react-native-bluetooth-classic";
import Toast from "react-native-toast-message";
import { connect } from "react-redux";
import styles from "./styles";

import {
  saveBtDevice,
  updateDeviceIsConnected,
} from "../../state/settings/actions";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

export async function connectToDevice(
  device,
  saveBtDevice,
  updateDeviceIsConnected
) {
  console.log(`Attempting connection to device ${device.id}`);
  try {
    await RNBluetoothClassic.setEncoding(BTCharsets.ASCII);
    const connectedDevice = await RNBluetoothClassic.connect(device.id);
    saveBtDevice(connectedDevice);
    updateDeviceIsConnected(true);
    return connectedDevice;
  } catch (error) {
    console.log(error.message);
    Toast.show({
      text1: "Unsuccessful connection",
      text2: `Connection to ${device.name} unsuccessful`,
      visibilityTime: 3000,
      autoHide: true,
    });
  }
}

const DeviceList = ({ devices, onPress }) => {
  return (
    <Layout style={styles.listContainer}>
      {devices.map((device, i) => {
        return (
          <Button
            style={styles.listElement}
            onPress={() => onPress(device)}
            status="basic"
          >
            {device.name}(MAC: {device.address})
          </Button>
        );
      })}
    </Layout>
  );
};

class ConnectionScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: undefined,
      scannedData: [],
      frameAnimation: true,
    };
    this.receivedData = [];
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.onReadListener = RNBluetoothClassic.addListener(
      BTEvents.READ,
      this.handleRead,
      this
    );
    this.onFocusListener = navigation.addListener("blur", () => {
      this.props.disconnect();
    });
    //start animation
    requestAnimationFrame(this._animation);
  }

  componentWillUnmount() {
    this.onReadListener.remove();
    this.onFocusListener();
    this.props.disconnect();
    this.setState({ frameAnimation: false });
  }

  _animation = () => {
    const N = 20; // Amount shown in the flatlist
    let dataArray = [...this.receivedData];
    if (dataArray.length > N) {
      dataArray = dataArray.slice(Math.max(dataArray.length - N, 1));
    }
    this.setState({
      scannedData: dataArray,
    });
    if (this.state.frameAnimation) {
      requestAnimationFrame(this._animation);
    }
  };

  handleRead = (data) => {
    data.data = parseInt(data.data, 10) || 0;
    this.receivedData.push(data);
  };

  onDisconnectPress = () => {
    this.setState({ frameAnimation: false });
    this.props.disconnect();
  };

  renderItem({ item }) {
    return (
      <Layout
        id={item.timestamp}
        style={{ flexDirection: "row", justifyContent: "flex-start" }}
      >
        <Text>{item.timestamp} - </Text>
        <Text style={{ flexShrink: 1 }}>{item.data}</Text>
      </Layout>
    );
  }

  keyExtractor(item) {
    return item.timestamp;
  }

  itemLayout(data, index) {
    return {
      length: 2,
      offset: 2 * index,
      index,
    };
  }

  render() {
    return (
      <Layout style={styles.dataContainer}>
        <Text style={styles.dataTitle}>
          Real-time data received from {this.props.device.name}
        </Text>
        <Layout style={styles.container}>
          <FlatList
            style={{ flex: 1, marginBottom: 5 }}
            contentContainerStyle={{ justifyContent: "flex-end" }}
            inverted
            maxToRenderPerBatch={10}
            getItemLayout={this.itemLayout}
            ref="scannedDataList"
            data={this.state.scannedData.reverse()}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
          />
        </Layout>
        <Button onPress={this.onDisconnectPress}>Disconnect</Button>
      </Layout>
    );
  }
}

class BluetoothSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceList: [],
      connectedDevice: undefined,
      scannedData: [],
      isDiscovering: false,
      isConnecting: false,
    };
  }

  componentDidMount() {
    this.initialize();
    this.subs = [];

    // Re-initialize whenever a Bluetooth event occurs
    this.subs.push(
      RNBluetoothClassic.addListener(
        BTEvents.BLUETOOTH_CONNECTED,
        (device) => this.onConnected(device),
        this
      )
    );
    this.subs.push(
      RNBluetoothClassic.addListener(
        BTEvents.BLUETOOTH_DISCONNECTED,
        (device) => this.onDisconnected(device),
        this
      )
    );
    this.subs.push(
      RNBluetoothClassic.addListener(
        BTEvents.CONNECTION_LOST,
        (error) => this.onConnectionLost(error),
        this
      )
    );
    this.subs.push(
      RNBluetoothClassic.addListener(
        BTEvents.ERROR,
        (error) => this.onError(error),
        this
      )
    );
  }

  componentWillUnmount() {
    this.subs.forEach((sub) => sub.remove());
  }

  onConnected(device) {
    Toast.show({
      text1: "Successful connection",
      text2: `Connected to ${device.name}`,
      visibilityTime: 3000,
      autoHide: true,
    });
    this.initialize();
  }

  onDisconnected(device) {
    Toast.show({
      text1: "Disconnection",
      text2: `Connection to ${device.name} was disconnected`,
      visibilityTime: 3000,
      autoHide: true,
    });
    this.initialize();
  }

  onConnectionLost(error) {
    Toast.show({
      text1: "Lost connection",
      text2: `Connection to ${error.device.name} was lost`,
      visibilityTime: 3000,
      autoHide: true,
    });
    this.initialize();
  }

  onError(error) {
    Toast.show({
      text1: "Unexpected error",
      text2: `${error.message}`,
      visibilityTime: 3000,
      autoHide: true,
    });
    this.initialize();
  }

  onBackPress = () => {
    const { navigation } = this.props;
    navigation.navigate("Settings", { screen: "SettingsScreen" });
  };

  BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={this.onBackPress} />
  );

  async initialize() {
    let enabled = await RNBluetoothClassic.isEnabled();
    this.setState({ bluetoothEnabled: enabled });

    if (enabled) {
      this.refreshDevices();
    }
  }

  async refreshDevices() {
    let newState = {
      devices: [],
      connectedDevice: undefined,
    };

    try {
      let connectedDevice = await RNBluetoothClassic.getConnectedDevice();

      console.log("initializeDevices::connectedDevice");
      console.log(connectedDevice);
      newState.connectedDevice = connectedDevice;
    } catch (error) {
      try {
        let devices = await RNBluetoothClassic.list();

        console.log("initializeDevices::list");
        console.log(devices);
        newState.deviceList = devices;
      } catch (error) {
        console.error(error.message);
      }
    }

    this.setState(newState);
  }

  async disconnectFromDevice() {
    const { updateDeviceIsConnected } = this.props;
    await RNBluetoothClassic.disconnect();
    this.setState({ connectedDevice: undefined });
    updateDeviceIsConnected(false);
  }

  async discoverDevices() {
    console.log("Attempting to discover devices...");
    this.setState({ isDiscovering: true });

    try {
      const unpaired = await RNBluetoothClassic.discoverDevices();
      console.log("Unpaired Devices");
      console.log(unpaired);
      Toast.show({
        text1: "Unpaired devices",
        text2: `Found ${unpaired.length} unpaired devices.`,
        visibilityTime: 3000,
        autoHide: true,
      });
    } catch (error) {
      console.log(error);
      Toast.show({
        text1: "Discovery error",
        text2: `Error occurred while attempting to discover devices`,
        visibilityTime: 3000,
        autoHide: true,
      });
    } finally {
      this.setState({ isDiscovering: false });
    }
  }

  async cancelDiscoverDevices() {
    console.log(`Attempting to cancel discovery...`);

    try {
      await RNBluetoothClassic.cancelDiscovery();
      this.setState({ isDiscovering: false });
    } catch (error) {
      console.log(error);
      Toast.show({
        text1: "Discovery cancelation error",
        text2: `Error occurred while attempting to cancel discover devices`,
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  }

  refresh = () => this.refreshDevices();
  selectDevice = async (device) => {
    this.setState({ isConnecting: true });
    const { saveBtDevice, updateDeviceIsConnected } = this.props;
    const connectedDevice = await connectToDevice(
      device,
      saveBtDevice,
      updateDeviceIsConnected
    );
    if (connectedDevice) {
      this.setState({ connectedDevice });
      // saveBtDevice(connectedDevice);
    }
    this.setState({ isConnecting: false });
  };
  unselectDevice = () => {
    this.disconnectFromDevice();
  };
  discover = () => this.discoverDevices();
  cancelDiscover = () => this.cancelDiscoverDevices();

  render() {
    let discoverFn = !this.state.isDiscovering
      ? () => this.discover()
      : () => this.cancelDiscover();

    return (
      <Layout style={styles.container}>
        <TopNavigation accessoryLeft={this.BackAction} title="Go Back" />
        {Platform.OS === "android" ? (
          <>
            {this.state.connectedDevice ? (
              <ConnectionScreen
                device={this.state.connectedDevice}
                scannedData={this.state.scannedData}
                disconnect={this.unselectDevice}
                navigation={this.props.navigation}
              />
            ) : (
              <Layout style={styles.container}>
                <DeviceList
                  devices={this.state.deviceList}
                  onPress={this.selectDevice}
                />
                {(this.state.isDiscovering || this.state.isConnecting) && (
                  <Layout style={styles.discoverySpinner}>
                    <Spinner />
                  </Layout>
                )}
                <ButtonGroup>
                  <Button style={styles.button} onPress={this.refresh}>
                    Refresh device list
                  </Button>
                  <Button style={styles.button} onPress={discoverFn}>
                    {this.state.isDiscovering
                      ? "Cancel discovering"
                      : "Discover devices"}
                  </Button>
                </ButtonGroup>
              </Layout>
            )}
          </>
        ) : (
          <View style={styles.settingNotSupportedContainer}>
            <Text style={styles.settingNotSupportedText}>
              We are sorry, but your OS is currently not supporting Bluetooth
              connection and data transmission.{" "}
            </Text>
          </View>
        )}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => ({
  bt: state.settingsReducer.bt,
});

const mapDispatchToProps = {
  saveBtDevice,
  updateDeviceIsConnected,
};

export default connect(mapStateToProps, mapDispatchToProps)(BluetoothSetting);
