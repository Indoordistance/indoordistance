// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Firebase config
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

// Vänta tills sidan laddat
document.addEventListener("DOMContentLoaded", () => {

  // ========== REGISTRERA ==========
  const registerBtn = document.getElementById("registerBtn");
  if (registerBtn) {
    registerBtn.addEventListener("click", async () => {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Konto skapat!");
        window.location.href = "dashboard.html";
      } catch (error) {
        alert(error.message);
      }
    });
  }

  // ========== LOGGA IN ==========
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "dashboard.html";
      } catch (error) {
        alert(error.message);
      }
    });
  }

  // ========== NAVBAR ==========
  const loginLink = document.getElementById("loginLink");
  const registerLink = document.getElementById("registerLink");
  const dashboardLink = document.getElementById("dashboardLink");
  const logoutLink = document.getElementById("logoutLink");

  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (loginLink) loginLink.style.display = "none";
      if (registerLink) registerLink.style.display = "none";
      if (dashboardLink) dashboardLink.style.display = "inline";
      if (logoutLink) logoutLink.style.display = "inline";
    } else {
      if (loginLink) loginLink.style.display = "inline";
      if (registerLink) registerLink.style.display = "inline";
      if (dashboardLink) dashboardLink.style.display = "none";
      if (logoutLink) logoutLink.style.display = "none";
    }
  });

  // ========== LOGGA UT ==========
  if (logoutLink) {
    logoutLink.addEventListener("click", async (e) => {
      e.preventDefault();
      await signOut(auth);
      window.location.href = "index.html";
    });
  }

});
