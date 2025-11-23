import { listListings } from "../api/listings/list.js";
import { calculateDaysLeft, getHighestBid } from "../utils/listing.js";

let allListings = [];
let originalListings = [];
let currentlyShown = 0;
const ITEMS_PER_PAGE = 9;

function sortListings(listings, sortBy) {
  const sorted = [...listings];

  switch (sortBy) {
    case "newest":
      sorted.sort((a, b) => {
        const dateA = new Date(a.created || a.updated);
        const dateB = new Date(b.created || b.updated);
        return dateB - dateA;
      });
      break;

    case "ending-soonest":
      sorted.sort((a, b) => {
        const dateA = new Date(a.endsAt);
        const dateB = new Date(b.endsAt);
        return dateA - dateB;
      });
      break;

    case "highest-bid":
      sorted.sort((a, b) => {
        const bidA = getHighestBid(a.bids, a.price || 0);
        const bidB = getHighestBid(b.bids, b.price || 0);
        return bidB - bidA;
      });
      break;

    case "most-bids":
      sorted.sort((a, b) => {
        let countA = 0;
        if (a.bids && a.bids.length) {
          countA = a.bids.length;
        }
        let countB = 0;
        if (b.bids && b.bids.length) {
          countB = b.bids.length;
        }
        return countB - countA;
      });
      break;

    default:
      break;
  }

  return sorted;
}

function renderListingCard(listing) {
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

  let imageAlt = listing.title;
  if (listing.media && listing.media[0] && listing.media[0].alt) {
    imageAlt = listing.media[0].alt;
  }

  return `
    <div class="flex justify-center lg:justify-start">
      <div class="flex flex-col items-start">
        <a href="current-listing.html?id=${listing.id}" class="cursor-pointer">
          <div
            class="w-[289px] h-[176px] bg-grey-medium rounded-[10px] shadow-[0px_0px_21px_rgba(0,0,0,0.25)] mb-[14px] hover:opacity-90 transition-opacity overflow-hidden"
          >
            ${
              imageUrl
                ? `<img src="${imageUrl}" alt="${imageAlt}" class="w-full h-full object-cover" />`
                : ""
            }
          </div>
        </a>
        <p
          class="font-lato italic text-accent text-[16px] lg:text-[18px] leading-[19px] lg:leading-[22px] mb-[8px] capitalize"
        >
          ${daysLeft} ${daysLeft === 1 ? "day" : "days"} left
        </p>
        <a href="current-listing.html?id=${listing.id}" class="cursor-pointer">
          <h3
            class="font-lato font-bold text-black text-[20px] lg:text-[24px] leading-[24px] lg:leading-[29px] capitalize mb-[8px] hover:text-accent transition-colors"
          >
            ${listing.title}
          </h3>
        </a>
        <p
          class="font-lato font-medium text-black text-[16px] lg:text-[18px] leading-[19px] lg:leading-[22px] mb-[8px]"
        >
          ${highestBid} Points (${bidCount} ${bidCount === 1 ? "bid" : "bids"})
        </p>
        <a href="current-listing.html?id=${listing.id}">
          <button
            class="bg-accent text-white font-lato font-medium text-[14px] lg:text-[18px] leading-[17px] lg:leading-[22px] rounded-[8px] lg:rounded-[10px] w-[122px] lg:w-[156px] h-[25px] lg:h-8 hover:bg-opacity-90 transition-colors"
          >
            Place A Bid
          </button>
        </a>
      </div>
    </div>
  `;
}

function renderListings(container, listings) {
  const listingsHTML = listings.map(renderListingCard).join("");
  container.innerHTML = listingsHTML;
}

function updateLoadMoreButton() {
  const loadMoreBtn = document.querySelector("#loadMoreBtn");

  if (loadMoreBtn) {
    if (currentlyShown >= allListings.length) {
      loadMoreBtn.style.display = "none";
    } else {
      loadMoreBtn.style.display = "block";
    }
  }
}

function loadMore() {
  const container = document.querySelector("#listingsContainer");
  if (!container) return;

  const nextBatch = allListings.slice(
    currentlyShown,
    currentlyShown + ITEMS_PER_PAGE
  );

  if (nextBatch.length === 0) {
    updateLoadMoreButton();
    return;
  }

  const newHTML = nextBatch.map(renderListingCard).join("");
  container.innerHTML += newHTML;

  currentlyShown += nextBatch.length;
  updateLoadMoreButton();
}

function filterListings(listings, searchQuery) {
  if (!searchQuery || searchQuery.trim() === "") {
    return listings;
  }

  const query = searchQuery.toLowerCase().trim();

  return listings.filter((listing) => {
    const title = listing.title ? listing.title.toLowerCase() : "";
    const description = listing.description
      ? listing.description.toLowerCase()
      : "";

    return title.includes(query) || description.includes(query);
  });
}

function handleSearch(searchQuery) {
  const container = document.querySelector("#listingsContainer");
  if (!container) return;

  const sortSelect = document.querySelector("#sort-select");
  let sortBy = "newest";
  if (sortSelect && sortSelect.value) {
    sortBy = sortSelect.value;
  }

  let filtered = filterListings(originalListings, searchQuery);
  allListings = sortListings(filtered, sortBy);
  currentlyShown = 0;

  if (allListings.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12">
        <p class="font-lato text-grey-dark text-lg">No listings found matching your search.</p>
      </div>
    `;
    updateLoadMoreButton();
    return;
  }

  const firstBatch = allListings.slice(0, ITEMS_PER_PAGE);
  renderListings(container, firstBatch);
  currentlyShown = firstBatch.length;

  updateLoadMoreButton();
}

function handleSortChange(sortBy) {
  const container = document.querySelector("#listingsContainer");
  if (!container) return;

  container.innerHTML = `
    <div class="col-span-full flex justify-center items-center py-12 lg:py-16 min-h-[200px]">
      <div class="w-8 h-8 lg:w-10 lg:h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
    </div>
  `;

  setTimeout(() => {
    const searchInput = document.querySelector("#search-input");
    const searchQuery = searchInput ? searchInput.value : "";
    const filtered = filterListings(originalListings, searchQuery);
    allListings = sortListings(filtered, sortBy);
    currentlyShown = 0;

    const firstBatch = allListings.slice(0, ITEMS_PER_PAGE);
    renderListings(container, firstBatch);
    currentlyShown = firstBatch.length;

    updateLoadMoreButton();
  }, 300);
}

export async function initAllListings() {
  const container = document.querySelector("#listingsContainer");

  if (!container) {
    console.error("Listings container not found");
    return;
  }

  container.innerHTML = `
    <div class="col-span-full flex justify-center items-center py-12 lg:py-16 min-h-[200px]">
      <div class="w-8 h-8 lg:w-10 lg:h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
    </div>
  `;

  try {
    const response = await listListings({
      _bids: true,
      _seller: true,
      _active: true,
    });

    if (!response.data || response.data.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12">
          <p class="font-lato text-grey-dark text-lg">No listings available at the moment.</p>
        </div>
      `;
      return;
    }

    originalListings = response.data;
    allListings = sortListings(originalListings, "newest");
    currentlyShown = 0;

    const firstBatch = allListings.slice(0, ITEMS_PER_PAGE);
    renderListings(container, firstBatch);
    currentlyShown = firstBatch.length;

    updateLoadMoreButton();

    const loadMoreBtn = document.querySelector("#loadMoreBtn");
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", loadMore);
    }

    const sortSelect = document.querySelector("#sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        handleSortChange(e.target.value);
      });
    }

    const searchInput = document.querySelector("#search-input");
    if (searchInput) {
      searchInput.addEventListener("input", function (e) {
        handleSearch(e.target.value);
      });
    }
  } catch (error) {
    console.error("Failed to load listings:", error);
    container.innerHTML = `
      <div class="col-span-full text-center py-12">
        <p class="font-lato text-accent text-lg">Failed to load listings. Please try again later.</p>
      </div>
    `;
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAllListings);
} else {
  initAllListings();
}
