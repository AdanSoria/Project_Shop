import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBLPdnNiZq8YExY4Zx2C6uPAZaixykPsb8",
  authDomain: "projectfinal-d7257.firebaseapp.com",
  projectId: "projectfinal-d7257",
  storageBucket: "projectfinal-d7257.firebasestorage.app",
  messagingSenderId: "387161791193",
  appId: "1:387161791193:web:ecfca063e467cac8f1bcc8",
  measurementId: "G-E3G4FFHL40"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };
