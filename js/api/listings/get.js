import { apiFetch } from "../fetch.js";
import { ENDPOINTS } from "../constants.js";

export async function getListing(id, options = {}) {
  const queryParams = new URLSearchParams();

  if (options._seller) queryParams.append("_seller", "true");
  if (options._bids) queryParams.append("_bids", "true");

  const endpoint =
    ENDPOINTS.listings.single(id) +
    (queryParams.toString() ? `?${queryParams.toString()}` : "");
  return await apiFetch(endpoint);
}
