import firebase from "firebase/compat/app";
import "firebase/compat/firestore"; // Correct import for Firestore
import "firebase/compat/auth"; // Import Auth
import "firebase/compat/storage"; // Import Storage

const firebaseConfig = {
    apiKey: "AIzaSyBrcyj5ekx6n2-6qZ-6_4q6jV_HpVKfCsg",
    authDomain: "auratracker-f9821.firebaseapp.com",
    projectId: "auratracker-f9821",
    storageBucket: "auratracker-f9821.appspot.com", // Corrected storage bucket domain
    messagingSenderId: "846943751457",
    appId: "1:846943751457:web:c17b985977fa2690a94260",
    measurementId: "G-59CFC4MGP5",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore, Auth, Provider, and Storage
const db = firebase.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();

export { auth, provider, storage };
export default db;
