import { apiFetch } from "../fetch.js";
import { ENDPOINTS } from "../constants.js";

export async function getProfile(name) {
  return await apiFetch(ENDPOINTS.profiles.single(name));
}
