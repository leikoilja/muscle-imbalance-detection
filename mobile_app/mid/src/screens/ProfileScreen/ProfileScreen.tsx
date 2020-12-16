import * as React from "react";

import {
  Layout,
  Divider,
  Button,
  Avatar,
  List,
  ListItem,
  Icon,
} from "@ui-kitten/components";
import {
  logoutUser,
  removeAllMeasurements,
} from "../../state/user-auth/actions";
import { removeBtDevice } from "../../state/settings/actions";
import styles from "./styles";
import { connect } from "react-redux";
import { Image, View } from "react-native";

const RemoveIcon = (props) => <Icon {...props} name="close-outline" />;

class ProfileScreen extends React.Component {
  onLogout = async () => {
    const { logoutUser } = this.props;
    await logoutUser();
  };

  renderClearMeasurementsButtonAccessory = (props) => (
    <Button
      style={styles.clearBtButton}
      accessoryLeft={RemoveIcon}
      onPress={this.props.removeAllMeasurements}
      size="small"
    >
      Clear all
    </Button>
  );

  renderClearBtButtonAccessory = (props) => (
    <Button
      style={styles.clearBtButton}
      accessoryLeft={RemoveIcon}
      onPress={this.props.removeBtDevice}
      size="small"
    >
      Clear
    </Button>
  );

  renderItem = ({ item, index }) => (
    <ListItem
      title={item.value}
      description={item.title}
      accessoryRight={item.accessoryRight}
    />
  );

  render() {
    const { user, device, measurements } = this.props;
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
        title: "User saved measurements",
        value: measurements[0] ? `${measurements.length}` : "None",
        accessoryRight: measurements[0]
          ? this.renderClearMeasurementsButtonAccessory
          : null,
      },
      {
        title: "Last paired BT device",
        value: device.name ? `${device.name}(${device.address})` : "None",
        accessoryRight: device.name ? this.renderClearBtButtonAccessory : null,
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
  measurements: state.userAuth.measurements,
});

const mapDispatchToProps = {
  logoutUser,
  removeBtDevice,
  removeAllMeasurements,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
