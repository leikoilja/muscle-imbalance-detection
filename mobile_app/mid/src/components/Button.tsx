import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

export default function Button({ onPress, text, testID, style }) {
  return (
    <TouchableOpacity
      testID={testID}
      style={[styles.button, style]}
      onPress={onPress}
    >
      <Text style={styles.buttonTitle}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#788eec",
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonTitle: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
