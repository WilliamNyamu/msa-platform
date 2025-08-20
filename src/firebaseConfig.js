// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcRwfCvouvfRfhCfYdj1iAufMw11xlcCw",
  authDomain: "msa-bda3e.firebaseapp.com",
  projectId: "msa-bda3e",
  storageBucket: "msa-bda3e.firebasestorage.app",
  messagingSenderId: "71999348376",
  appId: "1:71999348376:web:81e65006f194e445d9faed",
  measurementId: "G-5M3SWVMNFW"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const database = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

//Initialize Firebase Analytics
const analytics = getAnalytics(app)