import { StyleSheet, Dimensions } from "react-native";
import React from "react";
import { LineChart } from "react-native-chart-kit";

export default function OrangeLineChart({ data }) {
  if (data.datasets[0].data.length == 0) {
    data = {
      datasets: [
        {
          data: [0],
        },
      ],
    };
  }
  return (
    <LineChart
      data={data}
      style={styles.graph}
      width={Dimensions.get("window").width} // from react-native
      height={250}
      yAxisSuffix="mV"
      yAxisInterval={1} // optional, defaults to 1
      verticalLabelRotation={20}
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
    />
  );
}

const styles = StyleSheet.create({
  graph: {
    borderRadius: 10,
  },
});
