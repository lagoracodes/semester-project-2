export const API_BASE_URL = "https://v2.api.noroff.dev";
export const API_KEY = "3f82381e-576b-44a1-ac73-235f6bd790c5";

export const ENDPOINTS = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
  },
  listings: {
    list: "/auction/listings",
    single: (id) => `/auction/listings/${id}`,
    create: "/auction/listings",
    update: (id) => `/auction/listings/${id}`,
    delete: (id) => `/auction/listings/${id}`,
    bid: (id) => `/auction/listings/${id}/bids`,
    search: "/auction/listings/search",
  },
  profiles: {
    list: "/auction/profiles",
    single: (name) => `/auction/profiles/${name}`,
    update: (name) => `/auction/profiles/${name}`,
    listings: (name) => `/auction/profiles/${name}/listings`,
    bids: (name) => `/auction/profiles/${name}/bids`,
    wins: (name) => `/auction/profiles/${name}/wins`,
    search: "/auction/profiles/search",
  },
};
