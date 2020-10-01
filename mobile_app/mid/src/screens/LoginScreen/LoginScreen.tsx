import React, { useState, Component } from "react";
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styles from "./styles";
import { loginUser } from "../../state/user-auth/actions";
import { connect } from "react-redux";

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
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <Image
          testID="form-logo"
          style={styles.logo}
          source={require("../../assets/images/logo.png")}
        />
        <Text testID="form-desc" style={styles.demoCredentials}>
          During development and testing you can use the following credentials
          (email/password): {"\n"}user@mid.com/password or
          doctor@mid.com/password
        </Text>
        <TextInput
          testID="form-email-input"
          autoCapitalize="none"
          autoCorrect={false}
          value={emailValue}
          onChangeText={(e) => this.onChange(e, "email")}
          keyboardType="email-address"
          placeholder="Email address"
          style={styles.input}
        />
        <TextInput
          testID="form-password-input"
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          value={passwordValue}
          onChangeText={(e) => this.onChange(e, "password")}
          placeholder="Password"
        />
        <TouchableOpacity
          testID="form-login-button"
          style={styles.button}
          onPress={this.onLoginPress}
        >
          <Text style={styles.buttonTitle}>Log in</Text>
        </TouchableOpacity>
        <View style={styles.footerView}>
          <Text style={styles.footerText} testID="form-footer-desc">
            Don't have an account?{" "}
            <Text
              testID="form-footer-button"
              onPress={this.onFooterLinkPress}
              style={styles.footerLink}
            >
              Sign up
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
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
