// Firebase Configuration
// Replace these values with your Firebase project credentials
// Get these from: Firebase Console > Project Settings > General > Your apps

const firebaseConfig = {
    apiKey: "AIzaSyDKTAfnPYCP4oCExNHLesvWqA9DIdlokgw",
    authDomain: "poornimachemdata.firebaseapp.com",
    databaseURL: "https://poornimachemdata-default-rtdb.firebaseio.com",
    projectId: "poornimachemdata",
    storageBucket: "poornimachemdata.firebasestorage.app",
    messagingSenderId: "551476976744",
    appId: "1:551476976744:web:9a350bc22c258a8e346fdd"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();
