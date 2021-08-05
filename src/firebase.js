import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAys6IeLE5fXk_A6ZntNvDCnzBmPMVSCtg",
  authDomain: "tasksforyourday.firebaseapp.com",
  projectId: "tasksforyourday",
  storageBucket: "tasksforyourday.appspot.com",
  messagingSenderId: "172853848803",
  appId: "1:172853848803:web:c883d5cf1e00464688b3d6",
  measurementId: "G-NM9NK72BQ7",
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

//firebase.analytics();

export { db, auth };
