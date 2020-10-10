import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  settingBlock: {
    flex: 1,
  },
  settingTitle: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  settingTitleText: {
    fontWeight: "bold",
  },
  settingBody: {
    flex: 1,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  settingNotSupported: {
    color: "red",
  },
});
