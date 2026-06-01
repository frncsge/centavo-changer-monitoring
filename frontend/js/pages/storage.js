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
  <p>Current Stock: <span>${item.quantity}</span></p>

  <div class="card-actions">
    <button class="refill-btn" data-coin="${item.peso_value}">
      Refill
    </button>

    <button class="edit-btn" data-coin="${item.peso_value}">
      Edit
    </button>
  </div>
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
    // Refill
    if (e.target.classList.contains("refill-btn")) {
      selectedCard = e.target.closest(".refill-card");
      modalMode = "refill";

      modalTitle.textContent = `Refill ${e.target.dataset.coin}`;
      selectedPesoValue = e.target.dataset.coin;

      refillInput.value = 0;

      modal.classList.add("show");
    }

    // Edit
    if (e.target.classList.contains("edit-btn")) {
      selectedCard = e.target.closest(".refill-card");
      modalMode = "edit";

      const currentStock = selectedCard.querySelector("span").textContent;

      modalTitle.textContent = `Edit ${e.target.dataset.coin} Stock`;

      refillInput.value = currentStock;

      modal.classList.add("show");
    }
  });

  // Close modal
  closeModal.addEventListener("click", () => {
    modal.classList.remove("show");
  });

  // Save refill
  document.getElementById("saveRefill").addEventListener("click", async () => {
    if (!selectedCard) return;

    const stockSpan = selectedCard.querySelector("span");
    const value = Number(refillInput.value);

    if (modalMode === "refill") {
      const res = await authFetch("/machine-storage", {
        method: "POST",
        body: JSON.stringify({
          refillData: [{ pesoValue: selectedPesoValue, quantity: value }],
        }),
      });

      if (res.status === 401) {
        window.location.replace(
          "http://127.0.0.1:5501/frontend/html/login.html",
        );
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert(data.message);

      const currentStock = Number(stockSpan.textContent);
      stockSpan.textContent = currentStock + value;
    }

    if (modalMode === "edit") {
      stockSpan.textContent = value;
    }

    modal.classList.remove("show");
  });
});
