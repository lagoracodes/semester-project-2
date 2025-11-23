import { apiFetch } from "../fetch.js";
import { ENDPOINTS } from "../constants.js";

export async function listListings(options = {}) {
  const queryParams = new URLSearchParams();

  if (options._seller) queryParams.append("_seller", "true");
  if (options._bids) queryParams.append("_bids", "true");
  if (options._tag) queryParams.append("_tag", options._tag);
  if (options._active !== undefined)
    queryParams.append("_active", options._active.toString());

  const endpoint =
    ENDPOINTS.listings.list +
    (queryParams.toString() ? `?${queryParams.toString()}` : "");
  return await apiFetch(endpoint);
}
