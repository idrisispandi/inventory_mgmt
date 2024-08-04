// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore" ; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7YoGdvDmkE_JEEEdcpIdaM6vwIMq4AxU",
  authDomain: "inventory-management-4ad28.firebaseapp.com",
  projectId: "inventory-management-4ad28",
  storageBucket: "inventory-management-4ad28.appspot.com",
  messagingSenderId: "735216720535",
  appId: "1:735216720535:web:ca43f18badb94ff272e7d2",
  measurementId: "G-5P06REQ92Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export{firestore}