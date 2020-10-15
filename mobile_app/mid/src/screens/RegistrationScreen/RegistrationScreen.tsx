import React, { useState, Component } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { registerUser } from "../../state/user-auth/actions";
import styles from "./styles";
import { connect } from "react-redux";
import {
  Input,
  Button,
  ButtonGroup,
  Layout,
  Text,
} from "@ui-kitten/components";

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
    const { registerUser } = this.props;
    await registerUser(
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
      <Layout style={styles.container}>
        <KeyboardAwareScrollView contentContainerStyle={styles.container}>
          <Input
            testID="form-fullName-input"
            style={styles.input}
            placeholder="Full Name"
            onChangeText={(text) => this.onChange(text, "fullName")}
            value={fullNameValue}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <Input
            testID="form-email-input"
            style={styles.input}
            placeholder="E-mail"
            onChangeText={(text) => this.onChange(text, "email")}
            value={emailValue}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <Input
            testID="form-password-input"
            style={styles.input}
            secureTextEntry
            placeholder="Password"
            onChangeText={(text) => this.onChange(text, "password")}
            value={passwordValue}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <Input
            testID="form-confirmPassword-input"
            style={styles.input}
            secureTextEntry
            placeholder="Confirm Password"
            onChangeText={(text) => this.onChange(text, "confirmPassword")}
            value={confirmPasswordValue}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <ButtonGroup>
            <Button onPress={this.onRegisterPress}>Create an account</Button>
            <Button onPress={this.onFooterLinkPress}>Back to log in</Button>
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
  registerUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationScreen);
