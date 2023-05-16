import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getAuth} from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCrFi7Y61H0okhxz5uU9zEJ2htkZqekrNo",
  authDomain: "ecommerce-852bf.firebaseapp.com",
  projectId: "ecommerce-852bf",
  storageBucket: "ecommerce-852bf.appspot.com",
  messagingSenderId: "99313767871",
  appId: "1:99313767871:web:7826b0fd00c5822b627d0a",
  measurementId: "G-1TLDR2TDEQ"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const db = getFirestore(app)