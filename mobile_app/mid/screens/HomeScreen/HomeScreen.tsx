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

  render() {
    const { user } = this.props.auth;

    return (
      <View style={styles.container}>
        <Text>Welcome, {user.fullName} </Text>
        {user.isDoctor && <Text>You are doctor!</Text>}
        <TouchableOpacity style={styles.button} onPress={this.onLogout}>
          <Text style={styles.buttonTitle}>Log out</Text>
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
