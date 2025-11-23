import { API_BASE_URL } from "./constants.js";
import { getHeaders } from "./header.js";

export async function apiFetch(endpoint, options = {}) {
  const url = API_BASE_URL + endpoint;
  const token = localStorage.getItem("token");

  const defaultOptions = {
    headers: getHeaders(token),
  };

  const fetchOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, fetchOptions);
    const data = await response.json();

    if (!response.ok) {
      let errorMessage = "An error occurred";
      if (data.errors && data.errors[0] && data.errors[0].message) {
        errorMessage = data.errors[0].message;
      }
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}
