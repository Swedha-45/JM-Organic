
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMt0E2pjNdW-5fwqQ7IOVVA-Nt5VDAm8o",
  authDomain: "jmorganic.firebaseapp.com",
  projectId: "jmorganic",
  storageBucket: "jmorganic.firebasestorage.app",
  messagingSenderId: "632810157378",
  appId: "1:632810157378:web:7a7f96c6fa64c3e81084db"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export const googleClientId = "632810157378-25flsko570pmuu86nrtces6k7k0j8sab.apps.googleusercontent.com";

// Export services
export { app, auth, db, storage };