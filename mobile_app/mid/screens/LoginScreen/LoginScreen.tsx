import React, { useState, Component } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styles from "./styles";
import { loginUser } from "../../state/user-auth/actions";
import { connect } from "react-redux";

class LoginScreen extends Component {
  state = {
    emailValue: "user@mid.com",
    passwordValue: "password",
  };

  onLoginPress = async () => {
    const { loginUser } = this.props;
    const response = await loginUser(
      this.state.emailValue,
      this.state.passwordValue
    );
  };

  componentDidMount() {
    const { hasError, errorMessage, loggedIn } = this.props.auth;
    if (hasError) {
      alert(errorMessage);
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
          style={styles.logo}
          source={require("../../assets/images/logo.png")}
        />
        <Text style={styles.demoCredentials}>
          During development and testing you can use the following credentials
          (email/password): {"\n"}user@mid.com/password or
          doctor@mid.com/password
        </Text>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          value={emailValue}
          onChangeText={(e) => this.onChange(e, "email")}
          keyboardType="email-address"
          placeholder="Email address"
          style={styles.input}
        />
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          value={passwordValue}
          onChangeText={(e) => this.onChange(e, "password")}
          placeholder="Password"
        />
        <TouchableOpacity style={styles.button} onPress={this.onLoginPress}>
          <Text style={styles.buttonTitle}>Log in</Text>
        </TouchableOpacity>
        <View style={styles.footerView}>
          <Text style={styles.footerText}>
            Don't have an account?{" "}
            <Text onPress={this.onFooterLinkPress} style={styles.footerLink}>
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
