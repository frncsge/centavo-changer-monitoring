import { checkUserAuth } from "../auth/session.js";
import { authFetch } from "../api/authFetch.js";

window.addEventListener("DOMContentLoaded", async () => {
  try {
    // fetch machine storage
    const res = await authFetch("/machine-storage");

    // if user is unauthenticated
    if (res.status === 401) {
      window.location.replace("http://127.0.0.1:5501/frontend/html/login.html");
      return;
    }

    // if response status is not OK
    if (!res.ok) {
      console.error(
        "Machine storage fetch failed:",
        res.status,
        res.statusText,
      );
      return;
    }

    // machine storage data
    const data = await res.json();
    const { storage } = data;

    console.log("storage:", storage);

    const refillCardsContainer = document.querySelector(".refill-cards");

    storage.forEach((item) => {
      const refillCard = `
      <div class="refill-card">
        <h4>₱${item.peso_value} Coin</h4>
        <p>Current Stock: <span>${item.quantity}</span></p>
        <button class="refill-btn" data-coin="₱${item.peso_value}">Refill</button>
      </div>
      `;

      refillCardsContainer.innerHTML += refillCard;
    });
  } catch (error) {
    console.error("Error loading transactions:", error);
  }
});
