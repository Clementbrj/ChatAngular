import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBNJqtaWOJjxim1VFy0JQR1RB58mIFZBIE",
    authDomain: "chat-devoir.firebaseapp.com",
    projectId: "chat-devoir",
    storageBucket: "chat-devoir.firebasestorage.app",
    messagingSenderId: "674067734632",
    appId: "1:674067734632:web:57938066d55bab66bc5bdd",
    measurementId: "G-ZZMFF3MYKG"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
  