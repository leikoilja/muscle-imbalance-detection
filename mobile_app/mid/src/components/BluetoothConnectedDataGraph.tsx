import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import {
  Layout,
  Text,
  Spinner,
  ButtonGroup,
  Button,
} from "@ui-kitten/components";
import { LineChart } from "react-native-chart-kit";
import RNBluetoothClassic, { BTEvents } from "react-native-bluetooth-classic";
import { useFocusEffect } from "@react-navigation/native";
import { connectToDevice } from "../screens/BluetoothSettingScreen/BluetoothSettingScreen";
import { firebase } from "../firebase/config";

export default function BluetoothConnectedDataGraph({
  userUid,
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
            <BTDataGraph device={device} userUid={userUid} />
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
    console.log("uploading last recording", this.state.recordedData);
    const { userUid } = this.props;
    console.log("USERID", userUid);
    const document = {
      userUid: userUid,
      measurements: this.state.recordedData.data,
    };
    await firebase
      .firestore()
      .collection("recordings")
      .add(document)
      .then(function () {
        console.log("Document successfully written!");
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
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
    console.log("state", this.state.recordedData);
    console.log("state", this.state.isRecording);
  };

  render() {
    const hasRecordedData = this.state.recordedData.datasets[0].data.length
      ? true
      : false;
    const dataToShow = hasRecordedData
      ? this.state.recordedData
      : this.state.shownData;
    const descText = hasRecordedData ? "Recorded data" : "Read-time data";
    return (
      <Layout>
        <Text style={styles.descText}>{descText}</Text>
        <LineChart
          data={dataToShow}
          width={Dimensions.get("window").width} // from react-native
          height={220}
          yAxisSuffix="mV"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "3",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
          bezier
          style={styles.graph}
        />
        <View style={styles.actionButtons}>
          {this.state.isRecording ? (
            <Button
              style={styles.button}
              status="danger"
              onPress={this.onStopRecordPress}
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
                  >
                    Upload recorded data
                  </Button>
                  <Button
                    style={styles.button}
                    status="info"
                    onPress={this.onCancelPress}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  style={styles.button}
                  status="success"
                  onPress={this.onRecordPress}
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
