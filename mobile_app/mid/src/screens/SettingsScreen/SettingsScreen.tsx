import * as React from 'react';

import { Platform } from 'react-native';

import {
  Button,
  Layout,
  Text,
  Divider,
  Menu,
  MenuItem,
} from '@ui-kitten/components';
import styles from './styles';

export default function SettingsScreen({ navigation }) {
  const onBluetoothSettingPress = () => {
    navigation.navigate('BluetoothSettingScreen');
  };

  const onThemeSettingPress = () => {
    navigation.navigate('ThemeSettingScreen');
  };

  return (
    <Layout style={styles.container}>
      <Text category="h6" style={styles.title}>
        Settings
      </Text>
      <Menu>
        <MenuItem title="Bluetooth" onPress={onBluetoothSettingPress} />
        <MenuItem title="UI Theme" onPress={onThemeSettingPress} />
      </Menu>
    </Layout>
  );
}
