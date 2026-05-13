import { getAccessToken } from "../auth/session.js";

export async function authFetch(url, options = {}) {
  const token = await getAccessToken();

  return fetch(url, {
    ...options,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
}


