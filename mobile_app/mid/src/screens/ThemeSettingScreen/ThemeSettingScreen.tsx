import * as React from "react";

import {
  Layout,
  Toggle,
  Icon,
  TopNavigation,
  TopNavigationAction,
} from "@ui-kitten/components";
import styles from "./styles";
import { connect } from "react-redux";
import { changeTheme } from "../../state/settings/actions";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

class ThemeSettingScreen extends React.Component {
  onBackPress = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  onThemeChange = () => {
    const { theme } = this.props;
    const { changeTheme } = this.props;
    const changeThemeTo = theme == "light" ? "dark" : "light";
    changeTheme(changeThemeTo);
  };

  BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={this.onBackPress} />
  );
  render() {
    const { theme } = this.props;
    const isDarkTheme = theme == "dark" ? true : false;
    return (
      <Layout style={styles.container}>
        <TopNavigation accessoryLeft={this.BackAction} title="Go Back" />
        <Layout style={styles.main}>
          <Toggle checked={isDarkTheme} onChange={this.onThemeChange}>
            Dark mode
          </Toggle>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => ({
  theme: state.settingsReducer.theme,
});

const mapDispatchToProps = {
  changeTheme,
};

export default connect(mapStateToProps, mapDispatchToProps)(ThemeSettingScreen);
