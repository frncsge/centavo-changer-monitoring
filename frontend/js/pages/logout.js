import supabase from "../../../config/supabaseConfig.js";

document.getElementById("logout-btn").addEventListener("click", async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout failed:", error.message);
    return;
  }

  window.location.href = "http://127.0.0.1:5501/frontend/html/login.html";
});
