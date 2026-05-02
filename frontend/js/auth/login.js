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

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    displayMessage.textContent = error.message;
    return;
  }

  displayMessage.textContent =
    "Signup successfull! Check your email to verify your account";
    
  console.log("User:", data.user);
}

document.getElementById("login-btn").addEventListener("click", login);
