import { checkUserAuth } from "../auth/session.js";
import { authFetch } from "../api/authFetch.js";

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await authFetch("/machine-storage");

    // if user is unauthenticated
    if (res.status === 401) {
      window.location.replace("http://127.0.0.1:5501/frontend/html/login.html");
      return;
    }

    if (!res.ok) {
      console.error(
        "Machine storage fetch failed:",
        res.status,
        res.statusText,
      );
      return;
    }

    const data = await res.json();
    const { storage } = data;

    console.log("Storage: ", storage);
  } catch (error) {
    console.error("Error loading transactions:", err);
  }
});
