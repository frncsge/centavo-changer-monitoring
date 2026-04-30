import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { auth } from "../../../config/firebaseConfig.js";

async function resetPassword() {
  const email = document.getElementById("email").value?.trim();

  // html element for displaying login response/message
  const displayMessage = document.querySelector(".auth-message-display");

  if (!email) {
    displayMessage.textContent = "Email is required";
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    displayMessage.textContent = "Password reset email sent!";
  } catch (error) {
    const errorMessage = getFirebaseErrorMessages(error.code);

    console.error("Login error:", error.message);
    displayMessage.textContent = errorMessage;
  }
}

document
  .getElementById("forgot-password-btn")
  .addEventListener("click", resetPassword);
