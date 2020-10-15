import React, { useState, Component } from "react";
import { Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styles from "./styles";
import { loginUser } from "../../state/user-auth/actions";
import { connect } from "react-redux";
import {
  Input,
  Button,
  ButtonGroup,
  Layout,
  Text,
} from "@ui-kitten/components";

class LoginScreen extends Component {
  state = {
    emailValue: "user@mid.com",
    passwordValue: "password",
  };

  twoButtonAlert = (text: string) => {
    const { navigation } = this.props;
    Alert.alert(
      "Authentication error",
      text,
      [
        { text: "OK", onPress: () => console.log("OK Pressed") },
        {
          text: "Register",
          onPress: () => navigation.navigate("Registration"),
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };

  onLoginPress = async () => {
    const { loginUser } = this.props;
    await loginUser(this.state.emailValue, this.state.passwordValue);
  };

  componentDidMount() {
    const { hasError, errorMessage, loggedIn } = this.props.auth;
    if (hasError) {
      this.twoButtonAlert(errorMessage);
    }
    if (loggedIn) {
      const { navigation } = this.props;
      navigation.navigate("Home");
    }
  }

  onChange = (e, type) => {
    this.setState({ [`${type}Value`]: e });
  };

  onFooterLinkPress = () => {
    const { navigation } = this.props;
    navigation.navigate("Registration");
  };

  render() {
    const { emailValue, passwordValue } = this.state;
    return (
      <Layout style={styles.container}>
        <KeyboardAwareScrollView contentContainerStyle={styles.container}>
          <Text testID="form-desc" category="p1" style={styles.descText}>
            During development and testing you can use the following credentials
            (email/password): {"\n"}user@mid.com/password or
            doctor@mid.com/password
          </Text>
          <Input
            testID="form-email-input"
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            value={emailValue}
            onChangeText={(e) => this.onChange(e, "email")}
            keyboardType="email-address"
            placeholder="Email address"
          />
          <Input
            testID="form-password-input"
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
            value={passwordValue}
            onChangeText={(e) => this.onChange(e, "password")}
            placeholder="Password"
          />
          <ButtonGroup>
            <Button onPress={this.onLoginPress} style={styles.button}>
              Sign In
            </Button>
            <Button onPress={this.onFooterLinkPress} style={styles.button}>
              Sign Up
            </Button>
          </ButtonGroup>
        </KeyboardAwareScrollView>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.userAuth,
});

const mapDispatchToProps = {
  loginUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
