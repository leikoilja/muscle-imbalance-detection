# MID (Muscle Imbalance Detection) mobile app

We are using [React Native](https://reactnative.dev/) framework managed by [Expo](https://expo.io/) for mobile development.

## Requirements
- React Native SDK [38.0.2](https://github.com/expo/react-native/archive/sdk-38.0.2.tar.gz)
- Android Studio for android emulator or Xcode for iPhone simulator
- Physical Android or iOS device

## How to setup
1. Install `expo-cli` by following the official [tutorial](https://docs.expo.io/get-started/installation/). Note that you might need to install/upgrade Node.js version as tutorial says.
2. Navigate to the app's root directory and run
```bash
npm start
```
to launch `expo-cli` and follow it's instructions to launch emulator/simulator.

3. To support cloud stored values add your firebase configuration file under `src/firebase/config.tsx` in the
   following format:
```bash
import * as firebase from "firebase";
import "@firebase/auth";
import "@firebase/firestore";

const firebaseConfig = {
  apiKey: "<API-KEY>",
  authDomain: "<APP-NAME>.firebaseapp.com",
  databaseURL: "https://<APP-NAME>.firebaseio.com",
  projectId: "<APP-NAME>",
  storageBucket: "<APP-NAME>.appspot.com",
  messagingSenderId: "<MESSAGING-SENDER-ID>",
  appId: "<APP-ID>",
  measurementId: "<MEASUREMENT-ID>",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.firestore();
}

export { firebase };
```

## Screenshoots

<p float="left">
<img src="../images/mobile_app_screenshoots/graph-screen.jpg" width="200">
<img src="../images/mobile_app_screenshoots/analytics-insights.jpg" width="200">
<img src="../images/mobile_app_screenshoots/profile-screen.jpg" width="200">
</p>

## How to contribute
- Write the code
- Open a pull request [here](https://github.com/leikoilja/muscle-imbalance-detection/pulls).

### References
- [React-Native + Redux + Typescript Guide](https://medium.com/@killerchip0/react-native-redux-typescript-guide-f251db03428f)
- [React-Native + Redux + Firebase](https://itnext.io/simple-firebase-redux-integration-in-react-native-32f848deff3a)