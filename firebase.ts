import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA2IE49-TU7JLSch5Iy_t_3dJlDHLtf35Y",
  authDomain: "docuchat-a26f2.firebaseapp.com",
  projectId: "docuchat-a26f2",
  storageBucket: "docuchat-a26f2.firebasestorage.app",
  messagingSenderId: "371248420127",
  appId: "1:371248420127:web:a0b5763e9c04c782d28c2a",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };