
  
// Import the functions you need from the SDKs you need
import { initializeApp } from "@firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "TODO REPLACE WITH YOUR VALUE",
  authDomain: "TODO REPLACE WITH YOUR VALUE",
  projectId: "TODO REPLACE WITH YOUR VALUE",
  storageBucket: "TODO REPLACE WITH YOUR VALUE",
  messagingSenderId: "TODO REPLACE WITH YOUR VALUE",
  appId: "TODO REPLACE WITH YOUR VALUE",
  measurementId: "TODO REPLACE WITH YOUR VALUE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export {app};

