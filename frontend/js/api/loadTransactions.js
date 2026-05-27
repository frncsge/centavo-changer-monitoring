import { authFetch } from "./authFetch.js";

export async function loadTransactions() {
  try {
    const tableBody = document.getElementById("transactionTable");

    if (!tableBody) {
      console.error("No tbody found!");
      return;
    }

    // Clear old data
    tableBody.innerHTML = "";

    const res = await authFetch("/transactions");

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
    const transactions = data.transactions;

    console.log("Transactions fetched:", transactions);

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
  } catch (err) {
    console.error("Error loading transactions:", err);
  }
}
