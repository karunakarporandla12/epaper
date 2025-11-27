// Import the functions you need from the SDKs you need

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXNbkFbguGBjUQx4pI-dGqI-3_kory0l4",
  authDomain: "epaper-8451e.firebaseapp.com",
  projectId: "epaper-8451e",
  storageBucket: "epaper-8451e.firebasestorage.app",
  messagingSenderId: "918859847700",
  appId: "1:918859847700:web:1049170d2546380a886f01",
  storageBucket: 'epaper-8451e.appspot.com', // ✅ IMPORTANT: use appspot.com
  measurementId: "G-YXD26J84M8"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
