async function loadTransactions() {
    try {
        const tableBody = document.getElementById("transactionTable");

        if (!tableBody) {
            console.error("No tbody found!");
            return;
        }

        // Clear old data
        tableBody.innerHTML = "";

        const res = await fetch("http://localhost:3000/api/transactions");

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

            dispensedHTML += `<span class="tag">₱${txn.peso_value} × ${txn.quantity}</span>`;

            row.innerHTML = `
                <td>${txn.transaction_id}</td>
                <td>${txn.centavos_25_inserted}</td>
                <td class="peso">₱${pesoValue}</td>
                <td>${dispensedHTML}</td>
                <td>${txn.transaction_date_time}</td>
                <td><span class="status">completed</span></td>
                <td class="actions">✏️ 🗑️</td>
            `;

            tableBody.appendChild(row);
        });

    } catch (err) {
        console.error("Error loading transactions:", err);
    }
}

// Run after page loads
window.onload = loadTransactions;