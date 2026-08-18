// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
apiKey: "AIzaSyBnu5KnU2dFV0y-jmZ4QqLxx7GupJb_XjU",
  authDomain: "product-app-with-firebase.firebaseapp.com",
  projectId:"product-app-with-firebase",
  storageBucket: "product-app-with-firebase.firebasestorage.app",
  messagingSenderId: "701998749516",
  appId:"1:701998749516:web:4f24772b69f8465fd2a1e9",
};



const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;