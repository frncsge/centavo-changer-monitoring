import { checkUserAuth } from "../auth/session.js";
import { loadTransactions } from "../api/loadTransactions.js";

window.addEventListener("DOMContentLoaded", async () => {
  await loadTransactions();
});