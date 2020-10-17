import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
} from "@ui-kitten/components";
import { BottomTabParamList, TabOneParamList, TabTwoParamList } from "./types";

import ProfileScreen from "../screens/ProfileScreen/ProfileScreen";
import DataScreen from "../screens/DataScreen/DataScreen";
import SettingsScreen from "../screens/SettingsScreen/SettingsScreen";
import BluetoothSettingScreen from "../screens/BluetoothSettingScreen/BluetoothSettingScreen";
import ThemeSettingScreen from "../screens/ThemeSettingScreen/ThemeSettingScreen";
import MeasurementsScreen from "../screens/MeasurementsScreen/MeasurementsScreen";

const BottomTab = createBottomTabNavigator<BottomTabParamList>();
const DataStack = createStackNavigator<TabOneParamList>();
const ProfileStack = createStackNavigator<TabTwoParamList>();
const SettingsStack = createStackNavigator<TabTwoParamList>();

const PersonIcon = (props) => <Icon {...props} name="person-outline" />;
const GearIcon = (props) => <Icon {...props} name="settings-outline" />;
const DataIcon = (props) => <Icon {...props} name="activity-outline" />;

const BottomTabBar = ({ navigation, state }) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={(index) => navigation.navigate(state.routeNames[index])}
  >
    <BottomNavigationTab title="DATA & ANALYSIS" icon={DataIcon} />
    <BottomNavigationTab title="PROFILE" icon={PersonIcon} />
    <BottomNavigationTab title="SETTINGS" icon={GearIcon} />
  </BottomNavigation>
);

export default function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      tabBar={(props) => <BottomTabBar {...props} />}
    >
      <BottomTab.Screen name="Data & Analysis" component={TabOneNavigator} />
      <BottomTab.Screen name="My Profile" component={TabTwoNavigator} />
      <BottomTab.Screen name="Settings" component={TabThreeNavigator} />
    </BottomTab.Navigator>
  );
}

function TabOneNavigator({ navigation }) {
  return (
    <DataStack.Navigator>
      <DataStack.Screen name="DataScreen" component={DataScreen} />
      <DataStack.Screen
        name="MeasurementsScreen"
        component={MeasurementsScreen}
      />
    </DataStack.Navigator>
  );
}

function TabTwoNavigator({ navigation }) {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />
    </ProfileStack.Navigator>
  );
}

function TabThreeNavigator({ navigation }) {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="SettingsScreen" component={SettingsScreen} />
      <SettingsStack.Screen
        name="BluetoothSettingScreen"
        component={BluetoothSettingScreen}
      />
      <SettingsStack.Screen
        name="ThemeSettingScreen"
        component={ThemeSettingScreen}
      />
    </SettingsStack.Navigator>
  );
}
