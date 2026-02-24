import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCCIg1BpgV5Z6-t8ME-cHKi9nDE0xz5SSQ",
  authDomain: "booking-appointments-57654.firebaseapp.com",
  projectId: "booking-appointments-57654",
  storageBucket: "booking-appointments-57654.firebasestorage.app",
  messagingSenderId: "913243275697",
  appId: "1:913243275697:web:e52b02fc3f7b4abff57d90",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
