import { checkUserAuth } from "../auth/session.js";

window.addEventListener("DOMContentLoaded", async () => {
  // check if user is logged in
  const isLoggedIn = await checkUserAuth();

  if (!isLoggedIn) {
    window.location.replace("http://127.0.0.1:5501/frontend/html/login.html");
  }

  const weeklyCtx = document.getElementById("weeklyTransactionsChart");

  new Chart(weeklyCtx, {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Transactions",
          data: [34, 42, 39, 58, 71, 65, 47],
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59,130,246,.15)",
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });

  const coinCtx = document.getElementById("coinDistributionChart");

  new Chart(coinCtx, {
    type: "doughnut",
    data: {
      labels: ["₱1", "₱5", "₱10", "₱20"],
      datasets: [
        {
          data: [55, 25, 15, 5],
        },
      ],
    },
    options: {
      responsive: true,
    },
  });

  const activityCtx = document.getElementById("activityChart");

  new Chart(activityCtx, {
    type: "bar",
    data: {
      labels: ["Transactions", "Refills", "Adjustments"],
      datasets: [
        {
          label: "Count",
          data: [420, 12, 7],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
});
