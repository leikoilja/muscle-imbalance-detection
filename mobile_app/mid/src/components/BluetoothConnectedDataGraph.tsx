import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Layout, Text, Spinner } from "@ui-kitten/components";
import { LineChart } from "react-native-chart-kit";
import RNBluetoothClassic, { BTEvents } from "react-native-bluetooth-classic";
import { useFocusEffect } from "@react-navigation/native";
import { connectToDevice } from "../screens/BluetoothSettingScreen/BluetoothSettingScreen";

export default function BluetoothConnectedDataGraph({
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
            <BTDataGraph device={device} />
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
      data: {
        // labels: [],
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
    const dataClone = { ...this.state.data };
    data.timestamp = new Date();
    let dataArray = dataClone.datasets[0].data;
    dataArray.push(parseInt(data.data, 10));

    // Limit the array N values
    const N = 50;
    if (dataArray.length > N) {
      dataArray = dataArray.slice(Math.max(dataArray.length - N, 1));
    }
    dataClone.datasets[0].data = dataArray;

    this.setState({
      data: dataClone,
    });
  };

  render() {
    return (
      <LineChart
        data={this.state.data}
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
        style={{
          margin: 10,
          borderRadius: 10,
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
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
});
