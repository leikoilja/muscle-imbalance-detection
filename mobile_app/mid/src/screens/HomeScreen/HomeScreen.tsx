import * as React from "react";

import { Text, View, TouchableOpacity } from "react-native";
import styles from "./styles";
import { connect } from "react-redux";
import { logoutUser } from "../../state/user-auth/actions";

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
        <TouchableOpacity style={styles.button} onPress={this.onLogout}>
          <Text style={styles.buttonTitle}>Log out</Text>
        </TouchableOpacity>
        <Text>
          Looks like you have no Bluetooth module setup, please go to 'My
          Profile' and navigate to 'Settings' to do so!
        </Text>
        <TouchableOpacity style={styles.button} onPress={this.onSettings}>
          <Text style={styles.buttonTitle}>Settings</Text>
        </TouchableOpacity>
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
