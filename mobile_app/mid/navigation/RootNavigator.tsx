import React, { Component } from "react";

import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen, RegistrationScreen } from "../screens";
import { NavigationContainer } from "@react-navigation/native";
import { connect } from "react-redux";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import BottomTabNavigator from "./BottomTabNavigator";
import { RootStackParamList } from "./types";
import NotFoundScreen from "../screens/NotFoundScreen";

const RootStack = createStackNavigator<RootStackParamList>();

class RootNavigator extends Component {
  authScreens = {
    Login: LoginScreen,
    Registration: RegistrationScreen,
    NotFoundScreen: NotFoundScreen,
  };

  userScreens = {
    BottomTabNavigator: BottomTabNavigator,
    NotFoundScreen: NotFoundScreen,
  };

  render() {
    const { loggedIn, isFetching } = this.props.auth;
    if (isFetching) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    return (
      <NavigationContainer>
        <RootStack.Navigator>
          {Object.entries({
            ...(loggedIn ? this.userScreens : this.authScreens),
          }).map(([name, component]) => (
            <RootStack.Screen key={name} name={name} component={component} />
          ))}
        </RootStack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

const mapStateToProps = (state) => ({
  auth: state.userAuth,
});

export default connect(mapStateToProps)(RootNavigator);
