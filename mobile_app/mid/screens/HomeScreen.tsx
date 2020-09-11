import * as React from "react";
import { StyleSheet } from "react-native";

import { Text, View } from "react-native";
import { connect } from "react-redux";
import { watchPersonData } from "../state/store";

const mapStateToProps = (state) => {
  return {
    personData: state.personData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    watchPersonData: () => dispatch(watchPersonData()),
  };
};

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.props.watchPersonData();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>HELP</Text>
        <Text>{this.props.personData.firstName}</Text>
        <Text>{this.props.personData.lastName}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
