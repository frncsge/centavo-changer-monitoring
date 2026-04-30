import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { auth } from "../../../config/firebaseConfig.js";
import { getFirebaseErrorMessages } from "../firebase.js";

async function signup() {
  const email = document.getElementById("email").value?.trim();
  const password = document.getElementById("password").value?.trim();

  // html element for displaying login response/message
  const displayMessage = document.querySelector(".auth-message-display");

  if (!email || !password) {
    displayMessage.textContent = "Username, email and password are required";
    return;
  }

  try {
    // create user
    const userCred = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCred.user;

    // send verification email
    await sendEmailVerification(user);

    displayMessage.textContent =
      "Account created! Please check your email to verify your account.";

    console.log("User created:", user.uid);
  } catch (error) {
    const errorMessage = getFirebaseErrorMessages(error.code);

    console.error("Login error:", error.message);
    displayMessage.textContent = errorMessage;
  }
}

document.getElementById("signup-btn").addEventListener("click", signup);
