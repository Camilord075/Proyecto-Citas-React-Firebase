import app from'firebase/app'
import'firebase/firestore'
import'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCuOnLmZd8pA7XrhswFXyCJy33hA2seozE",
  authDomain: "actividad1corte3.firebaseapp.com",
  projectId: "actividad1corte3",
  storageBucket: "actividad1corte3.firebasestorage.app",
  messagingSenderId: "369157077374",
  appId: "1:369157077374:web:580568f6443576a289db2f"
};

// Initialize Firebase
app.initializeApp(firebaseConfig);

const db=app.firestore()
const auth=app.auth()

export {db, auth}