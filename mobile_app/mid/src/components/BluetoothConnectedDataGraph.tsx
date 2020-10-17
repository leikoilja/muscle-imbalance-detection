import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import {
  Layout,
  Text,
  Icon,
  Spinner,
  ButtonGroup,
  Button,
} from "@ui-kitten/components";
import RNBluetoothClassic, { BTEvents } from "react-native-bluetooth-classic";
import { useFocusEffect } from "@react-navigation/native";
import { connectToDevice } from "../screens/BluetoothSettingScreen/BluetoothSettingScreen";
import { firebase } from "../firebase/config";
import OrangeLineChart from "./OrangeLineChart";

const PlayIcon = (props) => <Icon {...props} name="play-circle" />;
const PauseIcon = (props) => <Icon {...props} name="pause-circle" />;
const UploadIcon = (props) => <Icon {...props} name="cloud-upload" />;
const CloseIcon = (props) => <Icon {...props} name="close-circle" />;

export default function BluetoothConnectedDataGraph({
  userUid,
  saveMeasurement,
  device,
  onSaveBtDevice,
  onUpdateDeviceIsConnected,
  isConnected,
}) {
  const [isConnecting, setIsConnecting] = useState(true);
  const [failedToConnect, setFailedToConnect] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const bluetoothCheckAndConnect = async () => {
        let isConnected = await RNBluetoothClassic.isConnected();
        if (!isConnected) {
          console.log("DEVICE is not connected. Connecting ...");
          setIsConnecting(true);
          const connectedDevice = await connectToDevice(
            device,
            onSaveBtDevice,
            onUpdateDeviceIsConnected
          );
          setIsConnecting(false);
          if (connectedDevice) {
            setFailedToConnect(false);
            console.log("Connected to ", device);
          } else {
            setFailedToConnect(true);
            console.log("Failed to connect to ", device);
          }
        }
      };

      bluetoothCheckAndConnect();
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
        RNBluetoothClassic.disconnect();
      };
    }, [])
  );

  return (
    <Layout style={styles.container}>
      {isConnecting ? (
        <View style={styles.connectionContainer}>
          <Spinner size="large" />
          <Text style={styles.infoText}>Connecting to "{device.name}"</Text>
        </View>
      ) : (
        <View style={styles.connectionContainer}>
          {failedToConnect ? (
            <Text style={[styles.infoText, styles.errorText]}>
              Failed to connect to "{device.name}"({device.address}). Try
              restarting your Bluetooth device and refresh this screen.
            </Text>
          ) : (
            <BTDataGraph
              device={device}
              userUid={userUid}
              saveMeasurement={saveMeasurement}
            />
          )}
        </View>
      )}
    </Layout>
  );
}

class BTDataGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRecording: false,
      recordedData: {
        data: [],
        datasets: [
          {
            data: [],
          },
        ],
      },
      shownData: {
        datasets: [
          {
            data: [0],
          },
        ],
      },
    };
  }

  componentDidMount() {
    this.onRead = RNBluetoothClassic.addListener(
      BTEvents.READ,
      this.handleRead,
      this
    );
  }

  componentWillUnmount() {
    this.onRead.remove();
    RNBluetoothClassic.disconnect();
  }

  handleRead = (data) => {
    // clone the data from the state
    const dataClone = { ...this.state.shownData };
    let timestamp = new Date();
    data.timestamp = timestamp;
    let dataArray = dataClone.datasets[0].data;
    dataArray.push(parseInt(data.data, 10));

    if (this.state.isRecording) {
      const recordedDataClone = { ...this.state.recordedData };
      let recordedDataArray = recordedDataClone.datasets[0].data;
      recordedDataArray.push(parseInt(data.data, 10));
      recordedDataClone.datasets[0].data = recordedDataArray;
      recordedDataClone.data.push({
        unixTimestamp: Math.round(timestamp.getTime() / 1000),
        value: data.data,
      });
      this.setState({
        recordedData: recordedDataClone,
      });
    }

    // Limit the array of shownData to N values
    const N = 20;
    if (dataArray.length > N) {
      dataArray = dataArray.slice(Math.max(dataArray.length - N, 1));
    }
    dataClone.datasets[0].data = dataArray;

    this.setState({
      shownData: dataClone,
    });
  };

  onRecordPress = () => {
    console.log("started recording");
    this.setState({
      isRecording: true,
    });
  };

  onStopRecordPress = () => {
    console.log("stopped recording");
    this.setState({
      isRecording: false,
    });
  };

  onUploadPress = async () => {
    const { userUid } = this.props;
    const document = {
      userUid: userUid,
      measurements: this.state.recordedData.data,
    };
    let measurementUid;
    await firebase
      .firestore()
      .collection("measurements")
      .add(document)
      .then(function (response) {
        console.log("Document successfully written!", response.id);
        measurementUid = response.id;
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
    if (measurementUid) {
      this.props.saveMeasurement(measurementUid);
    }
    this.onCancelPress();
  };

  onCancelPress = () => {
    console.log("cancel pressed");
    this.setState({
      recordedData: {
        data: [],
        datasets: [
          {
            data: [],
          },
        ],
      },
      isRecording: false,
    });
  };

  render() {
    const hasRecordedData = this.state.recordedData.datasets[0].data.length
      ? true
      : false;
    const dataToShow = hasRecordedData
      ? this.state.recordedData
      : this.state.shownData;
    const descText = hasRecordedData ? "Recorded data" : "Real-time data";
    return (
      <Layout>
        <Text style={styles.descText}>{descText}</Text>
        <OrangeLineChart data={dataToShow} />
        <View style={styles.actionButtons}>
          {this.state.isRecording ? (
            <Button
              style={styles.button}
              status="danger"
              onPress={this.onStopRecordPress}
              accessoryRight={PauseIcon}
            >
              Stop recording
            </Button>
          ) : (
            <>
              {hasRecordedData ? (
                <>
                  <Button
                    style={styles.button}
                    status="success"
                    onPress={this.onUploadPress}
                    accessoryRight={UploadIcon}
                  >
                    Upload recorded data
                  </Button>
                  <Button
                    style={styles.button}
                    status="info"
                    onPress={this.onCancelPress}
                    accessoryRight={CloseIcon}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  style={styles.button}
                  status="success"
                  onPress={this.onRecordPress}
                  accessoryRight={PlayIcon}
                >
                  Record measurements
                </Button>
              )}
            </>
          )}
        </View>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  connectionContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: {
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    color: "red",
  },
  graph: {
    // margin: 10,
    borderRadius: 10,
  },
  actionButtons: {
    marginTop: 10,
  },
  descText: {
    alignSelf: "center",
    marginBottom: 10,
  },
  button: { marginHorizontal: 10, marginTop: 10 },
});
