import { firebase } from "../firebase/config";

const teardown = async () => {
  await firebase.firestore().disableNetwork();
};

module.exports = teardown;
