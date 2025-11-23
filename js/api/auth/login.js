import { apiFetch } from "../fetch.js";
import { ENDPOINTS } from "../constants.js";

export async function login(email, password) {
  const response = await apiFetch(ENDPOINTS.auth.login, {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const userData = response.data;
  const token = userData.accessToken;
  
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(userData));

  return userData;
}

