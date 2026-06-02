import { checkUserAuth } from "../auth/session.js";
import { authFetch } from "../api/authFetch.js";
import { getMachines } from "../api/machines.js";

window.addEventListener("DOMContentLoaded", async () => {
  try {
    // fetch machines first
    const machines = await getMachines();

    console.log("machine id:", machines[0].machine_id);

    // fetch machine storage
    const res = await authFetch(`/machines/${machines[0].machine_id}/storage`);

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
  <p>Current Stock: <span id="stock-${item.peso_value}">
    ${item.quantity}
  </span></p>
</div>
`;

      refillCardsContainer.innerHTML += refillCard;
    });
  } catch (error) {
    console.error("Error loading transactions:", error);
  }

  const modal = document.getElementById("refillModal");
  const modalTitle = document.getElementById("modalTitle");
  const refillInput = document.getElementById("refillInput");
  const closeModal = document.getElementById("closeModal");

  let selectedCard = null;
  let modalMode = "refill"; // refill or edit
  let selectedPesoValue = null;

  // Open modal
  document.addEventListener("click", (e) => {

document
  .getElementById("openRefillModal")
  .addEventListener("click", () => {
    modal.classList.add("show");
  });

document.getElementById("closeModal").addEventListener("click", () => {
  modal.classList.remove("show");
});
    
  });

  // Close modal
  closeModal.addEventListener("click", () => {
    modal.classList.remove("show");
  });

  // Save refill
  document.getElementById("saveRefill").addEventListener("click", async () => {
  const refillData = [
    {
      pesoValue: 1,
      quantity: Number(document.getElementById("coin1").value),
    },
    {
      pesoValue: 5,
      quantity: Number(document.getElementById("coin5").value),
    },
    {
      pesoValue: 10,
      quantity: Number(document.getElementById("coin10").value),
    },
    {
      pesoValue: 20,
      quantity: Number(document.getElementById("coin20").value),
    },
  ].filter((item) => item.quantity > 0);

  if (refillData.length === 0) {
    alert("Enter at least one refill quantity.");
    return;
  }

  const res = await authFetch("/machine-storage", {
    method: "POST",
    body: JSON.stringify({ refillData }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message);
    return;
  }

  alert(data.message);
  location.reload();
});
});
