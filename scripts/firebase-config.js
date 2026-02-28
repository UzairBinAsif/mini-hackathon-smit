// ============================================================
// Unified Firebase Configuration & Utilities
// ============================================================

// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  deleteUser,
  signOut
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  query,
  getDocs,
  updateDoc,
  deleteDoc,
  getDoc,
  addDoc,
  serverTimestamp,
  Timestamp,
  where
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYCVkHnmxj3hhV_sU4oiOVAc8Q7XJrqDQ",
  authDomain: "mini-hackathon-smit-ed8b1.firebaseapp.com",
  projectId: "mini-hackathon-smit-ed8b1",
  storageBucket: "mini-hackathon-smit-ed8b1.firebasestorage.app",
  messagingSenderId: "665917112342",
  appId: "1:665917112342:web:7c29fe220499a3ddadf537"
};

// Initialize Firebase (single initialization)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);



// ============ Authentication Helpers ============

// Check authentication state and redirect
const getCurrentState = (redirectPath = "/index.html") => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (window.location.pathname !== redirectPath) {
        window.location.href = redirectPath;
      }
    } else {
      window.location.pathname = "/pages/signup.html";
    }
  });
}

// Sign Up with email/password
const signupHandler = (userName, email, password) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      addData("users", user.uid, {
        userName: userName,
        email: email,
        pass: password
      });
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.code
      });
    });
}

// Login with email/password
const loginHandler = (email, password) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      Swal.fire({
        title: "Login Success!",
        html: "Redirecting you to Home page in a sec.",
        icon: "success",
        timer: 5000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
        willClose: () => {
          clearInterval(timerInterval);
        }
      });
      setTimeout(() => {
        window.location.pathname = "index.html";
      }, 5000);
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.code
      });
    });
}

// Logout
const logoutHandler = async () => {
  try {
    await signOut(auth);
    window.location.pathname = "/pages/login.html";
  } catch (error) {
    console.error("Logout error:", error);
  }
}

// ============ Firestore CRUD Operations ============

// Create/Add document
const addData = async (collectionName, docId, data) => {
  try {
    await setDoc(doc(db, collectionName, docId), data);
    return true;
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
}

// Read document by ID
const getDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
}

// Read all documents from collection
const getData = async (collectionName) => {
  try {
    const q = query(collection(db, collectionName));
    const querySnapshot = await getDocs(q);
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    return documents;
  } catch (error) {
    console.error("Error getting documents:", error);
    throw error;
  }
}

// Query documents with where clause
const queryData = async (collectionName, field, operator, value) => {
  try {
    const q = query(collection(db, collectionName), where(field, operator, value));
    const querySnapshot = await getDocs(q);
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    return documents;
  } catch (error) {
    console.error("Error querying documents:", error);
    throw error;
  }
}

// Update document
const updateData = async (collectionName, docId, data) => {
  try {
    await updateDoc(doc(db, collectionName, docId), data);
    return true;
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
}

// Delete document
const deleteData = async (collectionName, docId) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    return true;
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
}

// Delete user account
const deleteUserData = async (collectionName, userId) => {
  const user = auth.currentUser;
  if (user && user.uid === userId) {
    try {
      await deleteDoc(doc(db, collectionName, userId));
      await deleteUser(user);
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  } else {
    throw new Error("You can delete yourself only, not others!");
  }
}

// ============ Export Everything ============
export {
  auth,
  db,
  getCurrentState,
  signupHandler as signup,
  loginHandler as login,
  logoutHandler as logout,
  addData,
  getDocument,
  getData,
  queryData,
  updateData,
  deleteData,
  deleteUserData,
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
  query,
  getDocs,
  updateDoc,
  deleteDoc,
  where,
  serverTimestamp,
  Timestamp,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
};
