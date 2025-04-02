// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_KexscwPu8ypOxnIQ-BUxtJ4lZZWSmcw",
  authDomain: "courses-manager-c2fdb.firebaseapp.com",
  projectId: "courses-manager-c2fdb",
  storageBucket: "courses-manager-c2fdb.appspot.com", // corrected here
  messagingSenderId: "939987025121",
  appId: "1:939987025121:web:9a8f9bb6d73a5ae6370ba0"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
