// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDrOCcoZbBVXCFfImSrJyfBFjCGMNOj98",
  authDomain: "smarthome-4d3c6.firebaseapp.com",
  databaseURL: "https://smarthome-4d3c6-default-rtdb.firebaseio.com",
  projectId: "smarthome-4d3c6",
  storageBucket: "smarthome-4d3c6.firebasestorage.app",
  messagingSenderId: "1082386485558",
  appId: "1:1082386485558:web:bf769689484be8bf586397",
  measurementId: "G-P7W0P8MHD2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export { app, analytics, database };
