// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBtN5tl8dtY1xlVfMsnQ9MSqlsoy1C5KJA",
  authDomain: "bau-app-9f43d.firebaseapp.com",
  projectId: "bau-app-9f43d",
  storageBucket: "bau-app-9f43d.appspot.com",
  messagingSenderId: "737252757549",
  appId: "1:737252757549:web:407702d1eb57d8f13528a4",
  measurementId: "G-3M7NJ71K0L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);