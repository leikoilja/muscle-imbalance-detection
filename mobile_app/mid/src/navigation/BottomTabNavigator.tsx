import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import TabTwoScreen from "../screens/TabTwoScreen";
import { BottomTabParamList, TabOneParamList, TabTwoParamList } from "./types";
import HomeScreen from "../screens/HomeScreen/HomeScreen";
import { TouchableOpacity, View } from "react-native";

const BottomTab = createBottomTabNavigator<BottomTabParamList>();
const TabOneStack = createStackNavigator<TabOneParamList>();
const TabTwoStack = createStackNavigator<TabTwoParamList>();

function TabBarIcon(props: { name: string; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

function SettingsButton(navigate) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingRight: 10,
        width: 120,
      }}
    >
      <TouchableOpacity onPress={() => navigate("Settings")}>
        <TabBarIcon name="ios-settings" />
      </TouchableOpacity>
    </View>
  );
}

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}
    >
      <BottomTab.Screen
        name="Data & Analysis"
        component={TabOneNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-stats" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="My Profile"
        component={TabTwoNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-body" color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

function TabOneNavigator({ navigation }) {
  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: "Muscle Imbalance Detection",
          headerRight: () => SettingsButton(navigation.navigate),
        }}
      />
    </TabOneStack.Navigator>
  );
}

function TabTwoNavigator({ navigation }) {
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name="TabTwoScreen"
        component={TabTwoScreen}
        options={{
          title: "My Profile",
          headerRight: () => SettingsButton(navigation.navigate),
        }}
      />
    </TabTwoStack.Navigator>
  );
}
