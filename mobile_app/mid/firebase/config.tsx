import * as firebase from "firebase";
import "@firebase/auth";
import "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCPCyFcDib1pB0zmGLjskurxKoskrkf0to",
  authDomain: "muscle-imbalance-detection.firebaseapp.com",
  databaseURL: "https://muscle-imbalance-detection.firebaseio.com",
  projectId: "muscle-imbalance-detection",
  storageBucket: "muscle-imbalance-detection.appspot.com",
  messagingSenderId: "422197975683",
  appId: "1:422197975683:web:5c63aa7431223e6cb0d9b6",
  measurementId: "G-YX9PFTQLTC",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.firestore();
}

export { firebase };
