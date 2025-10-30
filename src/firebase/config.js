import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJtYHMI1jiTC93hdXhWFQ6dCghHGeH-DI",
  authDomain: "trello-demo-7b8c6.firebaseapp.com",
  projectId: "trello-demo-7b8c6",
  storageBucket: "trello-demo-7b8c6.firebasestorage.app",
  messagingSenderId: "608940342813",
  appId: "1:608940342813:web:51a0f42967b4b77c3ed0f4",
  measurementId: "G-K3DNVFMQRM",
};

//initialize app
const app = initializeApp(firebaseConfig);

//initialize firestore
export const db = getFirestore(app);

//initialize firebase auth
export const auth = getAuth();
