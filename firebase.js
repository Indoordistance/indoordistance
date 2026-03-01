// ===============================
// 🔥 FIREBASE SETUP
// ===============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "DIN_API_KEY",
  authDomain: "DIN_AUTH_DOMAIN",
  projectId: "DIN_PROJECT_ID",
  storageBucket: "DIN_STORAGE",
  messagingSenderId: "DIN_SENDER_ID",
  appId: "DIN_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// ===============================
// 🔥 NÄR SIDAN LADDAS
// ===============================

document.addEventListener("DOMContentLoaded", () => {

  setupRegister();
  setupLogin();
  setupNavbar();
  setupAccountPage();
  setupLogout();
  setupPasswordReset();

});


// ===============================
// 🔥 REGISTRERA
// ===============================

function setupRegister() {
  const registerBtn = document.getElementById("registerBtn");
  if (!registerBtn) return;

  registerBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      alert("Konto skapat! Verifieringsmail skickat.");
      window.location.href = "konto.html";
    } catch (error) {
      alert(error.message);
    }
  });
}


// ===============================
// 🔥 LOGGA IN
// ===============================

function setupLogin() {
  const loginBtn = document.getElementById("loginBtn");
  if (!loginBtn) return;

  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "konto.html";
    } catch (error) {
      alert(error.message);
    }
  });
}


// ===============================
// 🔥 NAVBAR
// ===============================

function setupNavbar() {
  const loginLink = document.getElementById("loginLink");
  const registerLink = document.getElementById("registerLink");
  const accountLink = document.getElementById("accountLink");
  const logoutLink = document.getElementById("logoutLink");

  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (loginLink) loginLink.style.display = "none";
      if (registerLink) registerLink.style.display = "none";
      if (accountLink) accountLink.style.display = "inline";
      if (logoutLink) logoutLink.style.display = "inline";
    } else {
      if (loginLink) loginLink.style.display = "inline";
      if (registerLink) registerLink.style.display = "inline";
      if (accountLink) accountLink.style.display = "none";
      if (logoutLink) logoutLink.style.display = "none";
    }
  });
}


// ===============================
// 🔥 KONTO-SIDA
// ===============================

function setupAccountPage() {

  const userEmail = document.getElementById("userEmail");
  const userUID = document.getElementById("userUID");
  const verifyStatus = document.getElementById("verifyStatus");
  const verifyBtn = document.getElementById("verifyBtn");

  if (!userEmail && !userUID) return;

  onAuthStateChanged(auth, (user) => {

    if (!user) {
      window.location.href = "login.html";
      return;
    }

    if (userEmail) userEmail.textContent = user.email;
    if (userUID) userUID.textContent = user.uid;

    // Mail verifiering status
    if (verifyStatus) {
      if (user.emailVerified) {
        verifyStatus.textContent = "Verifierad ✅";
        verifyStatus.style.color = "green";
      } else {
        verifyStatus.textContent = "Ej verifierad ❌";
        verifyStatus.style.color = "red";

        if (verifyBtn) {
          verifyBtn.style.display = "inline";
          verifyBtn.addEventListener("click", async () => {
            await sendEmailVerification(user);
            alert("Verifieringsmail skickat!");
          });
        }
      }
    }

  });
}


// ===============================
// 🔥 LÖSENORD ÅTERSTÄLLNING
// ===============================

function setupPasswordReset() {
  const resetBtn = document.getElementById("resetPasswordBtn");
  if (!resetBtn) return;

  resetBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) return;

    await sendPasswordResetEmail(auth, user.email);
    alert("Återställningsmail skickat!");
  });
}


// ===============================
// 🔥 LOGGA UT
// ===============================

function setupLogout() {
  const logoutLink = document.getElementById("logoutLink");
  if (!logoutLink) return;

  logoutLink.addEventListener("click", async (e) => {
    e.preventDefault();
    await signOut(auth);
    window.location.href = "index.html";
  });
}
