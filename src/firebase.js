import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBQM5gssjfmb0tr3po99WAW2lPpr__woto",
  authDomain: "goteamfinder.firebaseapp.com",
  databaseURL: "https://goteamfinder.firebaseio.com",
  projectId: "goteamfinder",
  storageBucket: "goteamfinder.appspot.com",
  messagingSenderId: "21136843178",
  appId: "1:21136843178:web:005df34c35617ec3c04bd3",
  measurementId: "G-VV51HLWHC2",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
