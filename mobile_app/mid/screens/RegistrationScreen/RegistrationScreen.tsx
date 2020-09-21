import React, { useState, Component } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { registerUser } from "../../state/user-auth/actions";
import styles from "./styles";
import { connect } from "react-redux";

class RegistrationScreen extends Component {
  state = {
    fullNameValue: "",
    emailValue: "",
    passwordValue: "",
    confirmPasswordValue: "",
  };

  onChange = (e, type) => {
    this.setState({ [`${type}Value`]: e });
  };

  onFooterLinkPress = () => {
    const { navigation } = this.props;
    navigation.navigate("Login");
  };

  onRegisterPress = async () => {
    const { registerUser, navigation } = this.props;
    const response = await registerUser(
      this.state.emailValue,
      this.state.passwordValue,
      this.state.fullNameValue
    );
  };

  render() {
    const {
      emailValue,
      passwordValue,
      confirmPasswordValue,
      fullNameValue,
    } = this.state;
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView
          style={{ flex: 1, width: "100%" }}
          keyboardShouldPersistTaps="always"
        >
          <Image
            style={styles.logo}
            source={require("../../assets/images/logo.png")}
          />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => this.onChange(text, "fullName")}
            value={fullNameValue}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => this.onChange(text, "email")}
            value={emailValue}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholderTextColor="#aaaaaa"
            secureTextEntry
            placeholder="Password"
            onChangeText={(text) => this.onChange(text, "password")}
            value={passwordValue}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholderTextColor="#aaaaaa"
            secureTextEntry
            placeholder="Confirm Password"
            onChangeText={(text) => this.onChange(text, "confirmPassword")}
            value={confirmPasswordValue}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={this.onRegisterPress}
          >
            <Text style={styles.buttonTitle}>Create account</Text>
          </TouchableOpacity>
          <View style={styles.footerView}>
            <Text style={styles.footerText}>
              Already got an account?{" "}
              <Text onPress={this.onFooterLinkPress} style={styles.footerLink}>
                Log in
              </Text>
            </Text>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.userAuth,
});

const mapDispatchToProps = {
  registerUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationScreen);
