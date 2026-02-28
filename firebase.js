// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Din config (exakt som du skickade)
const firebaseConfig = {
  apiKey: "AIzaSyChckiB5mOS5qHPh_LKTBj9x8wxCq0EPdo",
  authDomain: "indoor-distance-f7757.firebaseapp.com",
  projectId: "indoor-distance-f7757",
  storageBucket: "indoor-distance-f7757.firebasestorage.app",
  messagingSenderId: "827100524255",
  appId: "1:827100524255:web:37260d1aea0b258afe836a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// REGISTRERA
window.registerUser = function(email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch(error => alert(error.message));
}

// LOGGA IN
window.loginUser = function(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch(error => alert(error.message));
}

// SKYDDADE SIDOR
window.protectPage = function() {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "login.html";
    }
  });
}

// LOGGA UT
window.logoutUser = function() {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
}
