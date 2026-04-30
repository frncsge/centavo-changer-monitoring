import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { auth } from "../../config/firebaseConfig.js";
import { getFirebaseErrorMessages } from "./firebase.js";

async function login() {
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // html element for displaying login response/message
  const displayMessage = document.getElementById("message");

  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const user = userCred.user;

    if (!user.emailVerified) {
      displayMessage.textContent = "Please verify your email first";
      return;
    }

    displayMessage.textContent = "Login successful";

    console.log("User:", user);

    const token = await user.getIdToken();
    console.log("Firebase token:", token);
  } catch (error) {
    const errorMessage = getFirebaseErrorMessages(error.code);
    console.error("Login error:", error.message);
    document.getElementById("message").textContent = errorMessage;
  }
}

document.getElementById("login-btn").addEventListener("click", login);
