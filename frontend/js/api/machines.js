import { authFetch } from "./authFetch.js";

export const getMachines = async () => {
  const cachedMachines = sessionStorage.getItem("machines");

  if (cachedMachines) {
    return JSON.parse(cachedMachines);
  }

  const response = await authFetch("/machines");

  if (response.status === 401) {
    window.location.replace("http://127.0.0.1:5501/frontend/html/login.html");
    return;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch machines");
  }

  const data = await response.json();

  sessionStorage.setItem("machines", JSON.stringify(data.machines));

  return data.machines;
};
