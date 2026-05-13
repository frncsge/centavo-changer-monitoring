import supabase from "../../../config/supabaseClient.js";

document.getElementById("logout-btn").addEventListener("click", async () => {
  const confirmed = confirm("Are you sure you want to log out?");

  if (!confirmed) return;

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout failed:", error.message);
    return;
  }

  window.location.href = "http://127.0.0.1:5501/frontend/html/login.html";
});
