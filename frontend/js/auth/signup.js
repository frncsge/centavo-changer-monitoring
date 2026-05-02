import supabase from "../../../config/supabaseConfig.js";

async function signup() {
  const accName = document.getElementById("account-name").value?.trim();
  const email = document.getElementById("email").value?.trim();
  const password = document.getElementById("password").value?.trim();

  // html element for displaying login response/message
  const displayMessage = document.querySelector(".auth-message-display");

  if (!accName || !email || !password) {
    displayMessage.textContent = "All input fields are required";
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:
        "http://127.0.0.1:5501/frontend/html/verificationMessage.html",
    },
  });

  if (error) {
    displayMessage.textContent = error.message;
    return;
  }

  displayMessage.textContent =
    "Signup successfull! Check your email to verify your account";

  console.log("User:", data.user);
}

document.getElementById("signup-btn").addEventListener("click", signup);
