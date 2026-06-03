import { authFetch } from "./authFetch.js";
import { getMachines } from "./machines.js";
import { renderPagination } from "../ui/pagination.js";

export async function loadTransactions() {
  try {
    const tableBody = document.getElementById("transactionTable");

    if (!tableBody) {
      console.error("No tbody found!");
      return;
    }

    // Clear old data
    tableBody.innerHTML = "";

    // fetch machines first
    const machines = await getMachines();

    // then read the params from URL
    const params = new URLSearchParams(window.location.search);

    const machineId = Number(params.get("machineId"));
    const currentPage = Number(params.get("page")) || 1;
    const pageSize = 8;

    const res = await authFetch(
      `/machines/${machines[0].machine_id}/transactions?page=${currentPage}&limit=${pageSize}`,
    );

    if (res.status === 401) {
      console.log(res);
      window.location.replace("http://127.0.0.1:5501/frontend/html/login.html");
      return;
    }

    if (!res.ok) {
      console.error("Fetch failed:", res.status, res.statusText);
      return;
    }

    const data = await res.json();
    const { totalCount, transactions } = data;

    // console.log("Total count of transactions fetched:", totalCount);
    // console.log("Transactions fetched:", transactions);

    // render the transactions
    transactions.forEach((txn) => {
      const row = document.createElement("tr");

      // Compute peso value (25 cents * count)
      const pesoValue = (txn.centavos_25_inserted * 0.25).toFixed(2);

      // Example logic for coins dispensed
      let dispensedHTML = "";

      txn.dispensed.forEach((item) => {
        dispensedHTML += `<span class="tag">₱${item.peso_value} × ${item.quantity}</span>`;
      });

      row.innerHTML = `
                <td>${txn.transaction_id}</td>
                <td>${txn.centavos_25_inserted}</td>
                <td class="peso">₱${pesoValue}</td>
                <td>${dispensedHTML}</td>
                <td>${new Date(txn.transaction_date_time).toLocaleString(
                  "en-PH",
                  {
                    dateStyle: "medium",
                    timeStyle: "short",
                  },
                )}</td>
                <td><span class="status">completed</span></td>
                <td class="actions">✏️ 🗑️</td>
            `;

      tableBody.appendChild(row);
    });

    // then render the pagination buttons
    const container = document.getElementById("pagination");
    renderPagination({ container, totalCount, pageSize, currentPage });

    // attach event listener to container
    container.addEventListener("click", (event) => {
      const btn = event.target;

      if (btn.tagName !== "BUTTON") return;

      const page = Number(btn.dataset.page);

      // go to page
      const params = new URLSearchParams(window.location.search);

      if (page === 1) {
        params.delete("page");
      } else {
        params.set("page", page);
      }

      window.location.search = params.toString();
    });
  } catch (err) {
    console.error("Error loading transactions:", err);
  }
}
