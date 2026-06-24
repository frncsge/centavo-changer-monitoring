import { checkUserAuth } from "/js/auth/session.js";

window.addEventListener("DOMContentLoaded", async () => {
  const isLoggedIn = await checkUserAuth();

  console.log(isLoggedIn);

  document.getElementById("success").style.display = isLoggedIn
    ? "block"
    : "none";

  document.getElementById("failed").style.display = isLoggedIn
    ? "none"
    : "block";
});
