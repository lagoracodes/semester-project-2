import { apiFetch } from "../fetch.js";
import { ENDPOINTS } from "../constants.js";

export async function createListing(listingData) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User must be logged in to create listings");
  }

  return await apiFetch(ENDPOINTS.listings.create, {
    method: "POST",
    body: JSON.stringify(listingData),
  });
}
