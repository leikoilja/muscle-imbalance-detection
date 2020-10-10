import * as React from "react";

import { Text, View, TouchableOpacity } from "react-native";
import styles from "./styles";
import { connect } from "react-redux";
import { logoutUser } from "../../state/user-auth/actions";
import Button from "../../components/Button";

class HomeScreen extends React.Component {
  onLogout = async () => {
    const { logoutUser } = this.props;
    await logoutUser();
  };

  onSettings = () => {
    const { navigation } = this.props;
    navigation.navigate("Settings");
  };

  render() {
    const { user } = this.props.auth;

    return (
      <View style={styles.container}>
        <Text testID="welcome-text">Welcome, {user.fullName} </Text>
        {user.isDoctor && <Text testID="doctor-info">You are doctor!</Text>}
        <Button
          style={{ width: "50%" }}
          onPress={this.onLogout}
          text="Log out"
        />
        <Text>
          Looks like you have no Bluetooth module setup, please go to 'My
          Profile' and navigate to 'Settings' to do so!
        </Text>
        <Button
          style={{ width: "50%" }}
          onPress={this.onSettings}
          text="Settings"
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.userAuth,
});

const mapDispatchToProps = {
  logoutUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
