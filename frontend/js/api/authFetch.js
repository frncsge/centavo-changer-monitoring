import { getAccessToken } from "../auth/session.js";

export async function authFetch(url, options = {}) {
  const token = await getAccessToken();

  return fetch(`http://localhost:3000/api${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
}
