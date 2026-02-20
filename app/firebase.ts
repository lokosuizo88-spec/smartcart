// app/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = 
{   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
       authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,   
          storageBucket: "smartcart-d39cf.firebasestorage.app",   
          messagingSenderId: "366415990733",   
          appId: "1:366415990733:web:7ddf8c0b5b84c040ee7e84",


};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);