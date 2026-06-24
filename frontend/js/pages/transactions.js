import { checkUserAuth } from "/js/auth/session.js";
import { loadTransactions } from "/js/api/loadTransactions.js";

window.addEventListener("DOMContentLoaded", async () => {
  await loadTransactions();
});