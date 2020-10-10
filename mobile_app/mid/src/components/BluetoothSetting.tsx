import React from "react";
import {
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  Platform,
  FlatList,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";
import RNBluetoothClassic, {
  BTEvents,
  BTCharsets,
} from "react-native-bluetooth-classic";
import Toast from "react-native-toast-message";
import Button from "../components/Button";

const InlineActivityIndicator = ({ animating }) => {
  return (
    <ActivityIndicator
      size={"small"}
      style={styles.inlineActivityIndicator}
      animating={animating}
    />
  );
};

const DeviceList = ({ devices, onPress, style, isConnecting }) => {
  console.log("DeviceList.render()");
  console.log(devices);

  return (
    <ScrollView
      style={styles.listContainer}
      contentContainerStyle={styles.container}
    >
      {devices.map((device, i) => {
        let bgColor = device.connected
          ? "#0f0"
          : styles.connectionStatus.backgroundColor;
        return (
          <TouchableOpacity
            key={device.id}
            style={[styles.button, style]}
            onPress={() => onPress(device)}
          >
            <View
              style={[styles.connectionStatus, { backgroundColor: bgColor }]}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.deviceName}>{device.name}</Text>
              <Text>{device.address}</Text>
            </View>
            <InlineActivityIndicator animating={isConnecting} />
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

class ConnectionScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: undefined,
      scannedData: [],
    };
  }

  componentDidMount() {
    this.onRead = RNBluetoothClassic.addListener(
      BTEvents.READ,
      this.handleRead,
      this
    );
    //this.poll = setInterval(() => this.pollForData(), 3000);
  }

  componentWillUnmount() {
    this.onRead.remove();
    //clearInterval(this.poll);

    RNBluetoothClassic.disconnect();
  }

  // pollForData = async () => {
  //   var available = 0;
  //
  //   do {
  //     console.log("Checking for available data");
  //     available = await RNBluetoothClassic.available();
  //     console.log(`There are ${available} bytes of data available`);
  //
  //     if (available > 0) {
  //       console.log("Attempting to read the next message from the device");
  //       const data = await RNBluetoothClassic.readFromDevice();
  //
  //       console.log(data);
  //       this.handleRead({ data });
  //     }
  //   } while (available > 0);
  // };

  handleRead = (data) => {
    data.timestamp = new Date();
    let scannedData = this.state.scannedData;
    scannedData.unshift(data);
    this.setState({ scannedData });
  };

  render() {
    console.log("DeviceConnection.render()");
    console.log(this.state);

    return (
      <View style={styles.dataContainer}>
        <Text style={styles.dataTitle}>
          Real-time data received from {this.props.device.name}
        </Text>
        <View style={styles.container}>
          <FlatList
            style={{ flex: 1 }}
            contentContainerStyle={{ justifyContent: "flex-end" }}
            inverted
            ref="scannedDataList"
            data={this.state.scannedData}
            keyExtractor={(item, index) => item.timestamp.toISOString()}
            renderItem={({ item }) => (
              <View
                id={item.timestamp.toISOString()}
                style={{ flexDirection: "row", justifyContent: "flex-start" }}
              >
                <Text>{item.timestamp.toTimeString().split(" ")[0]}</Text>
                <Text>{item.type === "sent" ? " < " : " > "}</Text>
                <Text style={{ flexShrink: 1 }}>{item.data.trim()}</Text>
              </View>
            )}
          />
        </View>
        <Button
          style={styles.dataButton}
          onPress={this.props.disconnect}
          text="Disconnect"
        />
      </View>
    );
  }
}

export default class BluetoothSetting extends React.Component {
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
      text1: "Los connection",
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

  async connectToDevice(device) {
    console.log(`Attempting connection to device ${device.id}`);
    this.setState({ isConnecting: true });
    try {
      await RNBluetoothClassic.setEncoding(BTCharsets.ASCII);
      let connectedDevice = await RNBluetoothClassic.connect(device.id);
      this.setState({ connectedDevice });
    } catch (error) {
      console.log(error.message);
      Toast.show({
        text1: "Unsuccessful connection",
        text2: `Connection to ${device.name} unsuccessful`,
        visibilityTime: 3000,
        autoHide: true,
      });
    }
    this.setState({ isConnecting: false });
  }

  async disconnectFromDevice() {
    await RNBluetoothClassic.disconnect();
    this.setState({ connectedDevice: undefined });
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
  selectDevice = (device) => this.connectToDevice(device);
  unselectDevice = () => this.disconnectFromDevice();
  discover = () => this.discoverDevices();
  cancelDiscover = () => this.cancelDiscoverDevices();

  render() {
    console.log("App.render()");
    console.log(this.state);

    let connectedColor = !this.state.bluetoothEnabled
      ? styles.toolbarButton.color
      : "green";

    let discoverFn = !this.state.isDiscovering
      ? () => this.discover()
      : () => this.cancelDiscover();

    return (
      <View style={styles.container}>
        {this.state.connectedDevice ? (
          <ConnectionScreen
            device={this.state.connectedDevice}
            scannedData={this.state.scannedData}
            disconnect={this.unselectDevice}
            onSend={this.onSend}
          />
        ) : (
          <View style={styles.container}>
            <DeviceList
              devices={this.state.deviceList}
              onPress={this.selectDevice}
              isConnecting={this.state.isConnecting}
            />
            <InlineActivityIndicator animating={this.state.isDiscovering} />
            <View style={styles.buttonGroup}>
              <Button
                onPress={this.refresh}
                style={{ marginLeft: null, marginRight: null, width: "40%" }}
                text="Refresh paired device list"
              />
              <Button
                style={{ marginLeft: null, marginRight: null, width: "40%" }}
                onPress={discoverFn}
                text={
                  this.state.isDiscovering
                    ? "Cancel discovering"
                    : "Discover devices"
                }
              />
            </View>
          </View>
        )}
      </View>
    );
  }
}

/**
 * The statusbar height goes wonky on Huawei with a notch - not sure if its the notch or the
 * Huawei but the fact that the notch is different than the status bar makes the statusbar
 * go below the notch (even when the notch is on).
 */
const APPBAR_HEIGHT = Platform.OS === "ios" ? 44 : 56;

const styles = StyleSheet.create({
  statusbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#222",
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#222",
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    height: APPBAR_HEIGHT,
  },
  toolbarText: {
    flex: 1,
    fontSize: 20,
    color: "red",
  },
  toolbarButton: {
    fontSize: 20,
    color: "red",
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  listContainer: {
    flex: 1,
  },
  button: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "stretch",
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "stretch",
    marginBottom: 10,
  },
  refreshButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#999",
    padding: 9,
    marginBottom: 9,
  },
  dataContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dataTitle: {
    marginBottom: 10,
  },
  dataButton: {
    width: "100%",
    marginBottom: 10,
  },
  inlineActivityIndicator: {
    marginLeft: 10,
  },
  startAcceptButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
    padding: 9,
    marginBottom: 9,
  },
  deviceName: {
    fontSize: 16,
  },
  connectionStatus: {
    width: 8,
    backgroundColor: "#ccc",
    marginRight: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  horizontalContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "stretch",
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  textInput: {
    flex: 1,
    height: 40,
  },
});
