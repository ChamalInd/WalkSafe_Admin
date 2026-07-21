import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB9CR_nRVaWCq97xnGcF6JQen53r5jOYS8",
  authDomain: "walksafe-a41b3.firebaseapp.com",
  projectId: "walksafe-a41b3",
  storageBucket: "walksafe-a41b3.firebasestorage.app",
  messagingSenderId: "326854952183",
  appId: "1:326854952183:web:9ed98a05be8ff3d6df3ff2",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
