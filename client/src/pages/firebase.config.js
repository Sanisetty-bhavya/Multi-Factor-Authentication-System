// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  // add your firebase config
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the authentication instance
export const auth = getAuth(app);
