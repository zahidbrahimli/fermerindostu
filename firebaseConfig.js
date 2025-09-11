// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpWjiImJmpp3dCzEmcqEGGrObzZw9E9gc",
  authDomain: "fermerindostu-deaa0.firebaseapp.com",
  projectId: "fermerindostu-deaa0",
  storageBucket: "fermerindostu-deaa0.firebasestorage.app",
  messagingSenderId: "1068010185412",
  appId: "1:1068010185412:web:3dd4ee449b0109c8aedf91",
  measurementId: "G-XL1K0T22V8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
