// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUJS_7ntfcG6h-eb1e8A6cThkrrELe6wU",
  authDomain: "compete-ce97a.firebaseapp.com",
  projectId: "compete-ce97a",
  storageBucket: "compete-ce97a.appspot.com",
  messagingSenderId: "437485322183",
  appId: "1:437485322183:web:8b684cf624f3a19b00e3e2",
  measurementId: "G-RQF9CP2E2K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);