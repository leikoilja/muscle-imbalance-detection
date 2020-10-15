import * as React from "react";

import {
  Text,
  Layout,
  Divider,
  Button,
  Avatar,
  List,
  ListItem,
} from "@ui-kitten/components";
import { logoutUser } from "../../state/user-auth/actions";
import styles from "./styles";
import { connect } from "react-redux";
import { Image, View } from "react-native";

class ProfileScreen extends React.Component {
  onLogout = async () => {
    const { logoutUser } = this.props;
    await logoutUser();
  };

  renderItem = ({ item, index }) => (
    <ListItem title={item.value} description={item.title} />
  );

  render() {
    const { user, device } = this.props;
    const data = [
      {
        title: "Full Name",
        value: user.fullName,
      },
      {
        title: "Email",
        value: user.user.email,
      },
      {
        title: "Role",
        value: user.isDoctor ? "Doctor" : "Patient",
      },
      {
        title: "UID",
        value: user.user.uid,
      },
      {
        title: "Last paired BT device",
        value: device.name ? `${device.name}(${device.address})` : "None",
      },
    ];
    return (
      <Layout style={styles.container}>
        <View style={styles.box}>
          <Avatar
            style={styles.profileImage}
            source={require("../../assets/images/avatar.png")}
          />
        </View>
        <View style={styles.listContainer}>
          <List
            data={data}
            ItemSeparatorComponent={Divider}
            renderItem={this.renderItem}
          />
        </View>
        <Button
          style={styles.button}
          testID="button-logout"
          onPress={this.onLogout}
        >
          Log out
        </Button>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.userAuth.user,
  device: state.settingsReducer.bt.device,
});

const mapDispatchToProps = {
  logoutUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
