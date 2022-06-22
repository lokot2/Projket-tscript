import firebase from "firebase";

const config = {
  apiKey: "AIzaSyD8X9c9ghKTJmA9cnbYmIdPuv7AN1mWkH0",
  authDomain: "notes-a5d00.firebaseapp.com",
  projectId: "notes-a5d00",
  databaseURL: "notes-a5d00",
  storageBucket: "notes-a5d00.appspot.com",
  messagingSenderId: "282778070093",
  appId: "1:282778070093:web:1adc0ce4de2629fae48004",
  measurementId: "G-TMTFWM9VQ5",
};
// @ts-ignore
const firebaseApp = firebase.initializeApp(config);
// @ts-ignore
const db = firebaseApp.firestore();

export const saveInFirestore = false;
export { db };
