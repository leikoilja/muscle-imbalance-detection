import React, { Component } from "react";

import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen, RegistrationScreen, SettingsScreen } from "../screens";
import { NavigationContainer } from "@react-navigation/native";
import { connect } from "react-redux";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import BottomTabNavigator from "./BottomTabNavigator";
import { RootStackParamList } from "./types";

const RootStack = createStackNavigator<RootStackParamList>();

class RootNavigator extends Component {
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
        <RootStack.Navigator
          headerMode={false}
          // screenOptions={{
          //   headerShown: false,
          // }}
        >
          {loggedIn ? (
            <>
              <RootStack.Screen name="Home" component={BottomTabNavigator} />
              <RootStack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                  headerBackTitle: "Back",
                  headerShown: true,
                  title: "Settings",
                }}
              />
            </>
          ) : (
            // User is not signed in
            <>
              <RootStack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                  title: "Login",
                }}
              />
              <RootStack.Screen
                name="Registration"
                component={RegistrationScreen}
                options={{
                  title: "Registration",
                }}
              />
            </>
          )}
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
