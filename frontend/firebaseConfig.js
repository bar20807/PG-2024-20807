// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgf0tPtUMW3-HxtD2jZNmlQef8GFWO7gw",
  authDomain: "goldenfy-images.firebaseapp.com",
  projectId: "goldenfy-images",
  storageBucket: "goldenfy-images.appspot.com",
  messagingSenderId: "943428305134",
  appId: "1:943428305134:web:fd9a9ce03a874e4ceb33ff",
  measurementId: "G-XSX70RT72Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
