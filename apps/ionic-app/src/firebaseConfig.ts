import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDQLYOmNPh6DfwENG7wGs0wUfI_quUPg7E",
  authDomain: "personalperformgm.firebaseapp.com",
  projectId: "personalperformgm",
  storageBucket: "personalperformgm.firebasestorage.app",
  messagingSenderId: "295138056608",
  appId: "1:295138056608:web:6f5258c1165de664472cc5",
  measurementId: "G-TQRSQ1LZMB"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);


export default app;

