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
      isUploading: false,
      frameAnimation: true,
      recordedData: {
        dataToUpload: [],
        datasets: [
          {
            data: [],
          },
        ],
      },
      shownData: {
        datasets: [
          {
            data: [],
          },
        ],
      },
    };
    this.receivedData = [];
    this.receivedRecordedData = [];
  }

  componentDidMount() {
    this.onReadListener = RNBluetoothClassic.addListener(
      BTEvents.READ,
      this.handleRead,
      this
    );
    //start animation
    requestAnimationFrame(this._animation);
  }

  componentWillUnmount() {
    this.onReadListener.remove();
    RNBluetoothClassic.disconnect();
    this.setState({ frameAnimation: false });
  }

  updateGraphData = () => {
    // clone the data from the state
    const shownDataClone = { ...this.state.shownData };
    let receivedDataClone = [...this.receivedData];

    // Moving average approach:
    // Since this method is called each frame - calculate the average of the
    // last 16 measurement recordings
    let N = 16;
    if (receivedDataClone.length > N) {
      receivedDataClone = receivedDataClone.slice(
        Math.max(receivedDataClone.length - N, 1)
      );
    }
    let receivedDataSum = 0;
    let receivedDataAvg;
    for (const element of receivedDataClone) {
      receivedDataSum += element.data;
    }
    receivedDataAvg = receivedDataSum / receivedDataClone.length || 0;

    let shownDataArray = shownDataClone.datasets[0].data;
    shownDataArray.push(receivedDataAvg);

    // Limit the array of shownData to N values
    N = 20;
    if (shownDataArray.length > N) {
      shownDataArray = shownDataArray.slice(
        Math.max(shownDataArray.length - N, 1)
      );
    }
    shownDataClone.datasets[0].data = shownDataArray;
    this.setState({
      shownData: shownDataClone,
    });
  };

  handleRecordedData = () => {
    /**
     * Function that saves all incoming data points unchanged, but
     * since there are too much data to represent on the graph screen it also
     * splits that big data set into set amount of chunks and then calculates
     * average per each chunk for better representation on the screen.
     */
    const recordedDataClone = { ...this.state.recordedData };
    recordedDataClone.dataToUpload = [...this.receivedRecordedData];

    // Split array into set amount of chunks
    const splitArrayToChunks = (array, parts = 40) => {
      let result = [];
      for (let i = parts; i > 0; i--) {
        result.push(array.splice(0, Math.ceil(array.length / i)));
      }
      return result;
    };
    const dataChunks = splitArrayToChunks(this.receivedRecordedData);

    // Calculate average per each chunk
    const sumReducer = (accumulator, item) => {
      return accumulator + item.data;
    };
    const avg = dataChunks.map(
      (chunk) => chunk.reduce(sumReducer, 0) / chunk.length
    );
    recordedDataClone.datasets[0].data = avg;
    this.setState({
      recordedData: recordedDataClone,
    });
  };

  _animation = () => {
    this.updateGraphData();
    if (this.state.frameAnimation) {
      requestAnimationFrame(this._animation);
    }
  };

  handleRead = (data) => {
    data.data = parseInt(data.data, 10) || 0;
    this.receivedData.push(data);
    if (this.state.isRecording) {
      this.receivedRecordedData.push(data);
    }
  };

  onRecordPress = () => {
    this.setState({
      isRecording: true,
    });
  };

  onStopRecordPress = () => {
    this.setState({
      isRecording: false,
    });
    this.handleRecordedData();
  };

  onUploadPress = async () => {
    const { userUid } = this.props;
    const document = {
      userUid: userUid,
      measurements: this.state.recordedData.dataToUpload,
      visualRepresentation: this.state.recordedData.datasets[0].data,
    };
    let measurementUid;
    this.setState({ isUploading: true });
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
    this.receivedRecordedData = [];
    this.setState({ isUploading: false });
    this.setState({
      recordedData: {
        dataToUpload: [],
        datasets: [
          {
            data: [],
          },
        ],
      },
      isRecording: false,
    });
  };

  uploadButtonIcon = (props) => {
    return this.state.isUploading ? (
      <Spinner size="small" />
    ) : (
      UploadIcon(props)
    );
  };

  render() {
    const hasRecordedData = this.state.recordedData.datasets[0].data.length
      ? true
      : false;
    const dataToShow = hasRecordedData
      ? this.state.recordedData
      : this.state.shownData;
    let descText = "Moving average of 1kHz ";
    descText += hasRecordedData ? "recorded data" : "real-time data";
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
                    accessoryRight={this.uploadButtonIcon}
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
