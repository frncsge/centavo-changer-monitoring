import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { auth } from "../../../config/firebaseConfig.js";
import { getFirebaseErrorMessages } from "../firebase.js";

// function for login
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // html element for displaying login response/message
  const displayMessage = document.querySelector(".auth-message-display");

  if (!email || !password) {
    displayMessage.textContent = "Email and password are required";
    return;
  }

  try {
    // sign in with firebase
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const user = userCred.user;

    // if email is not verified, prohibit from loging in
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
    displayMessage.textContent = errorMessage;
  }
}

document.getElementById("login-btn").addEventListener("click", login);
