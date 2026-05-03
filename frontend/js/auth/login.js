import supabase from "../../../config/supabaseConfig.js";

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

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    displayMessage.textContent = error.message;
    return;
  }

  console.log("Logged in user:", data.user);

  window.location.href =
    "http://127.0.0.1:5501/frontend/html/dashboard.html";
}

document.getElementById("login-btn").addEventListener("click", login);
