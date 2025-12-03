import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCU27JvgcixdoiU5VUpwNwLf45f5fxG6qk",
  authDomain: "studentwelcomehub.firebaseapp.com",
  projectId: "studentwelcomehub",
  storageBucket: "studentwelcomehub.firebasestorage.app",
  messagingSenderId: "394474389042",
  appId: "1:394474389042:web:a510d50169062a4516462b",
  measurementId: "G-4BB0DKM9ZX"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
