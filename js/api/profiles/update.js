import { apiFetch } from "../fetch.js";
import { ENDPOINTS } from "../constants.js";

export async function updateProfile(name, profileData) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User must be logged in");
  }

  return await apiFetch(ENDPOINTS.profiles.update(name), {
    method: "PUT",
    body: JSON.stringify(profileData),
  });
}
