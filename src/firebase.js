// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_KexscwPu8ypOxnIQ-BUxtJ4lZZWSmcw",
  authDomain: "courses-manager-c2fdb.firebaseapp.com",
  projectId: "courses-manager-c2fdb",
  storageBucket: "courses-manager-c2fdb.firebasestorage.app", // double-check this if you run into issues; usually it is "courses-manager-c2fdb.appspot.com"
  messagingSenderId: "939987025121",
  appId: "1:939987025121:web:9a8f9bb6d73a5ae6370ba0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and export it for use in your app
const db = getFirestore(app);

export { db };
