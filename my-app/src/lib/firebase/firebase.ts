
  
// Import the functions you need from the SDKs you need
import { initializeApp } from "@firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_bANiUo0BkBJM5eujUNc7c3THN9Pf3n0",
  authDomain: "protofkitexample.firebaseapp.com",
  projectId: "protofkitexample",
  storageBucket: "protofkitexample.appspot.com",
  messagingSenderId: "596904149028",
  appId: "1:596904149028:web:7d754a3caae8d84d2e58b1"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize firebase authentication.
const auth = getAuth(app);

// Initialzie firestore db.
const db = getFirestore(app);

export {app, auth, db};

