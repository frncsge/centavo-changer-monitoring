import supabase from "../../../config/supabaseConfig.js";

async function checkUserAuth() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const successMessage = document.getElementById("success");
  const failedMessage = document.getElementById("failed");

  if (session) {
    successMessage.style.display = "block";
  } else {
    failedMessage.style.display = "block";
  }
}

checkUserAuth();
