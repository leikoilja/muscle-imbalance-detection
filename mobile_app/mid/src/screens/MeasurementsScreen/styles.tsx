import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: { flex: 1 },
  list: { flex: 1 },
  descText: { alignSelf: "center", margin: 20 },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  buttonGroup: {
    flexDirection: "column",
  },
  button: {
    marginVertical: 3,
  },
  analyticModal: {
    width: "90%",
  },
  modalButton: { marginTop: 10 },
  modalTitle: { alignSelf: "center", marginBottom: 10 },
  spinnerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
