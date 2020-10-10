import { firebase } from "../firebase/config";

const setup = async () => {
  await firebase.firestore().enableNetwork();
};

module.exports = setup;
