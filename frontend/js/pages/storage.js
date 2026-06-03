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
            </span>
          </p>
          <button class="adjust-btn" data-coin="${item.peso_value}">Adjust</button>
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
  const adjustModal = document.getElementById("adjustModal");
  const adjustTitle = document.getElementById("adjustTitle");
  const adjustLabel = document.getElementById("adjustLabel");
  const adjustInput = document.getElementById("adjustInput");
  const closeAdjustModal = document.getElementById("closeAdjustModal");

  let selectedCard = null;
  let modalMode = "refill"; // refill or edit
  let selectedPesoValue = null;

  // Open modal
  document.addEventListener("click", (e) => {
    document.getElementById("openRefillModal").addEventListener("click", () => {
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

  // Open Adjust modal when Adjust button is clicked
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("adjust-btn")) {
    selectedPesoValue = e.target.dataset.coin;

    adjustTitle.textContent = `Adjust ₱${selectedPesoValue} Coin Stock`;
    adjustLabel.textContent = `New quantity for ₱${selectedPesoValue}`;
    adjustInput.value = "";

    adjustModal.classList.add("show");
  }
});

// Close Adjust modal
closeAdjustModal.addEventListener("click", () => {
  adjustModal.classList.remove("show");
});

document.getElementById("saveAdjust").addEventListener("click", async () => {
  console.log("Save clicked");

  console.log("Peso:", selectedPesoValue);
  console.log("Quantity:", adjustInput.value);

  const newQuantity = Number(adjustInput.value);

  try {
    const res = await authFetch("/machine-storage/adjust", {
      method: "POST",
      body: JSON.stringify({
        pesoValue: Number(selectedPesoValue),
        quantity: newQuantity,
      }),
    });

    console.log("Status:", res.status);

    const data = await res.json();

    console.log(data);

  } catch (err) {
    console.error(err);
  }
});
});
