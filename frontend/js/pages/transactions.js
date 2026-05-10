import { checkUserAuth } from "../auth/session.js";
import { loadTransactions } from "../loadTransactions.js";

window.addEventListener("DOMContentLoaded", async () => {
  // check if user is logged in
  const isLoggedIn = await checkUserAuth();

  if (!isLoggedIn) {
    window.location.replace("http://127.0.0.1:5501/frontend/html/login.html");
  }

  await loadTransactions();
});
