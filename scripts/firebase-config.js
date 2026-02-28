// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYCVkHnmxj3hhV_sU4oiOVAc8Q7XJrqDQ",
  authDomain: "mini-hackathon-smit-ed8b1.firebaseapp.com",
  projectId: "mini-hackathon-smit-ed8b1",
  storageBucket: "mini-hackathon-smit-ed8b1.firebasestorage.app",
  messagingSenderId: "665917112342",
  appId: "1:665917112342:web:7c29fe220499a3ddadf537"
};

// Initialize Firebase
let app = null;
let auth = null;
let db = null;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("Firebase partially initialized. Awaiting true config.");
} catch (error) {
    console.error("Firebase config is required.", error);
}

export { auth, db };
