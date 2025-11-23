import { apiFetch } from "../fetch.js";
import { ENDPOINTS } from "../constants.js";

export async function placeBid(listingId, amount) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User must be logged in to place bids");
  }

  return await apiFetch(ENDPOINTS.listings.bid(listingId), {
    method: "POST",
    body: JSON.stringify({
      amount: Number(amount),
    }),
  });
}
