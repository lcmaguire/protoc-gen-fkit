
  
// Import the functions you need from the SDKs you need
import { initializeApp } from "@firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJur5Wx_3dCqtzv2WcX1jX1aQvxf5Fpvo",
  authDomain: "pbcc-test-env.firebaseapp.com",
  projectId: "pbcc-test-env",
  storageBucket: "pbcc-test-env.appspot.com",
  messagingSenderId: "3887924007",
  appId: "1:3887924007:web:d257d7f09636f9ed251f02",
  measurementId: "G-VXNVGK81PR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize firebase authentication.
const auth = getAuth(app);

// Initialzie firestore db.
const db = getFirestore(app);

export {app, auth, db};

