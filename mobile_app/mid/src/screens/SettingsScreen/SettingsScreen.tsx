import * as React from "react";

import { Text, View, TouchableOpacity } from "react-native";
import styles from "./styles";

export default class SettingsScreen extends React.Component {

  render() {
    const {navigation} = this.props;

    return (
      <View style={styles.container}>
        <Text>This is settings screen</Text>
      </View>
    );
  }
}
