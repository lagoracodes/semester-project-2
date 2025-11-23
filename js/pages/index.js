import { getListing } from "../api/listings/get.js";
import { calculateDaysLeft, getHighestBid } from "../utils/listing.js";

const FEATURED_IDS = [
  "7bacb71e-c23f-4208-beb9-bb96c4f63825",
  "feaa97a5-1826-4347-a2bc-7466e238f80b",
  "352b269e-c377-49a2-a78d-ecd2ef36aad5",
];

function populateFeaturedListing(containerId, listing) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const daysLeft = calculateDaysLeft(listing.endsAt);
  const highestBid = getHighestBid(listing.bids, listing.price || 0);

  let bidCount = 0;
  if (listing.bids && listing.bids.length) {
    bidCount = listing.bids.length;
  }

  let imageUrl = "";
  if (listing.media && listing.media[0] && listing.media[0].url) {
    imageUrl = listing.media[0].url;
  }

  let imageAlt = listing.title || "";
  if (listing.media && listing.media[0] && listing.media[0].alt) {
    imageAlt = listing.media[0].alt;
  }

  const imageDiv = container.querySelector("a > div");
  if (imageDiv && imageUrl) {
    imageDiv.innerHTML = `<img src="${imageUrl}" alt="${imageAlt}" class="w-full h-full object-cover" />`;
  }

  const daysLeftEl = container.querySelector("p.font-lato.italic.text-accent");
  if (daysLeftEl) {
    daysLeftEl.textContent = `${daysLeft} ${
      daysLeft === 1 ? "day" : "days"
    } left`;
  }

  const titleEl = container.querySelector("h4");
  if (titleEl) {
    titleEl.textContent = listing.title || "";
  }

  const bidInfoEl = container.querySelector(
    "p.font-lato.font-medium.text-black"
  );
  if (bidInfoEl) {
    bidInfoEl.textContent = `${highestBid} Points (${bidCount} ${
      bidCount === 1 ? "bid" : "bids"
    })`;
  }

  const links = container.querySelectorAll("a");
  links.forEach((link) => {
    link.href = `pages/current-listing.html?id=${listing.id}`;
  });
}

export async function initFeaturedListings() {
  const containers = [
    "featured-listing-1",
    "featured-listing-2",
    "featured-listing-3",
  ];

  for (let i = 0; i < FEATURED_IDS.length; i++) {
    const container = document.getElementById(containers[i]);
    if (!container) continue;

    const originalHTML = container.innerHTML;

    try {
      const response = await getListing(FEATURED_IDS[i], { _bids: true });
      const listing = response.data || response;
      if (listing && listing.id) {
        container.innerHTML = originalHTML;
        populateFeaturedListing(containers[i], listing);
      }
    } catch (error) {
      console.error("Failed to load featured listing:", error);
      container.innerHTML = originalHTML;
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFeaturedListings);
} else {
  initFeaturedListings();
}
