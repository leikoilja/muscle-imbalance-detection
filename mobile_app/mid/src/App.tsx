import React from "react";

import Toast from "react-native-toast-message";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry, Text } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { StyleSheet, SafeAreaView, View } from "react-native";
import { connect } from "react-redux";
import NetInfo from "@react-native-community/netinfo";
import RootNavigator from "./navigation/RootNavigator";

class App extends React.Component {
  state = {
    isConnected: false,
  };

  componentDidMount() {
    this._subscription = NetInfo.addEventListener(this._handleIsConnected);
  }

  componentWillUnmount() {
    this._subscription && this._subscription();
  }

  _handleIsConnected = (connectionInfo: NetInfoState) => {
    this.setState(({ isConnected }) => ({
      isConnected: connectionInfo.isConnected,
    }));
  };

  render() {
    const { theme } = this.props;
    return (
      <ApplicationProvider {...eva} theme={eva[theme]}>
        <Toast ref={(ref) => Toast.setRef(ref)} />
        <IconRegistry icons={EvaIconsPack} />
        <SafeAreaView style={styles.container}>
          {this.state.isConnected ? (
            <RootNavigator />
          ) : (
            <View style={styles.notConnectedContainer}>
              <Text style={styles.notConnectedText} status="danger">
                We are sorry, but seems like you are not connected to the
                internet. The app will automatically reload once you are online
              </Text>
            </View>
          )}
        </SafeAreaView>
      </ApplicationProvider>
    );
  }
}

const mapStateToProps = (state) => ({
  theme: state.settingsReducer.theme,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(App);

const styles = StyleSheet.create({
  container: { flex: 1 },
  notConnectedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notConnectedText: {
    margin: 20,
    alignSelf: "center",
    textAlign: "center",
  },
});
