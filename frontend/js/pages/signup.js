import supabase from "/config/supabaseClient.js";

async function signup() {
  const accName = document.getElementById("account-name").value?.trim();
  const email = document.getElementById("email").value?.trim();
  const password = document.getElementById("password").value?.trim();

  // html element for displaying login response/message
  const displayMessage = document.querySelector(".auth-message-display");

  // check if an input field is empty
  if (!accName || !email || !password) {
    displayMessage.textContent = "All input fields are required";
    return;
  }

  // signup using supabase auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "/frontend/html/verificationMessage.html",
    },
  });

  if (error) {
    displayMessage.textContent = error.message;
    return;
  }

  if (data.user) {
    const { error: insertError } = await supabase.from("admins").insert({
      supabase_uid: data.user.id,
      account_name: accName,
    });

    if (insertError) {
      displayMessage.textContent = insertError.message;
      return;
    }
  }

  displayMessage.textContent =
    "Signup successfull! Check your email to verify your account";

  console.log("User:", data.user);
}

document.getElementById("signup-btn").addEventListener("click", signup);
