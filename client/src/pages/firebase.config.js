// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB32Jrvpred1l8T5575fQ7nAoEPUSyvreU",
  authDomain: "otp-project-408e2.firebaseapp.com",
  projectId: "otp-project-408e2",
  storageBucket: "otp-project-408e2.appspot.com",
  messagingSenderId: "549783930663",
  appId: "1:549783930663:web:ff7efef0492e4640118b02",
  measurementId: "G-B8TR1J06GV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the authentication instance
export const auth = getAuth(app);
