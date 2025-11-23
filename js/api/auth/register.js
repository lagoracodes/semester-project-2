import { apiFetch } from "../fetch.js";
import { ENDPOINTS } from "../constants.js";

export async function register(name, email, password) {
  const data = await apiFetch(ENDPOINTS.auth.register, {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  return data;
}

