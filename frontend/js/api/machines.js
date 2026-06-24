import { authFetch } from "/js/api/authFetch.js";

export const getMachines = async () => {
  const response = await authFetch("/machines");

  if (response.status === 401) {
    window.location.replace("/html/login.html");
    return;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch machines");
  }

  const data = await response.json();

  return data.machines;
};
