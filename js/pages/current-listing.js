import { getListing } from "../api/listings/get.js";
import { getProfile } from "../api/profiles/get.js";
import { placeBid } from "../api/listings/bid.js";
import { calculateDaysLeft, getHighestBid } from "../utils/listing.js";

let currentListing = null;

function getListingIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

// populate page with listing data from api
function populateListingData(listing) {
  const bannerSubtitle = document.querySelector("#listing-banner-subtitle");
  const bannerTitle = document.querySelector("#listing-banner-title");
  if (bannerSubtitle) bannerSubtitle.textContent = "Name Of The Listing";
  if (bannerTitle) bannerTitle.textContent = listing.title || "";

  const listingImage = document.querySelector("#listing-image");

  let imageUrl = "";
  if (listing.media && listing.media[0] && listing.media[0].url) {
    imageUrl = listing.media[0].url;
  }

  let imageAlt = listing.title || "";
  if (listing.media && listing.media[0] && listing.media[0].alt) {
    imageAlt = listing.media[0].alt;
  }

  if (listingImage) {
    if (imageUrl) {
      listingImage.innerHTML = `<img src="${imageUrl}" alt="${imageAlt}" class="w-full h-full object-cover" />`;
    } else {
      listingImage.innerHTML = "";
    }
  }

  const listingDescription = document.querySelector("#listing-description");
  const description = listing.description || "No description available.";

  if (listingDescription) listingDescription.textContent = description;

  const daysLeft = calculateDaysLeft(listing.endsAt);
  const daysLeftElement = document.querySelector("#listing-days-left");
  const isEnded = daysLeft <= 0;

  if (daysLeftElement) {
    if (isEnded) {
      daysLeftElement.textContent = "Auction Ended";
    } else {
      const daysText = `${daysLeft} ${daysLeft === 1 ? "Day" : "Days"} Left`;
      daysLeftElement.textContent = daysText;
    }
  }

  const startingPrice = listing.price || 0;
  const highestBid = getHighestBid(listing.bids, startingPrice);

  let bidCount = 0;
  if (listing.bids && listing.bids.length) {
    bidCount = listing.bids.length;
  }

  const bidCountElement = document.querySelector("#listing-bid-count");
  const topBidElement = document.querySelector("#listing-top-bid");

  if (bidCountElement) {
    bidCountElement.textContent = `(${bidCount} ${
      bidCount === 1 ? "Bid" : "Bids"
    })`;
  }
  if (topBidElement) {
    topBidElement.textContent = `${highestBid} Points`;
  }

  const sellerName = document.querySelector("#seller-name");
  const sellerEmail = document.querySelector("#seller-email");
  const sellerAvatar = document.querySelector("#seller-avatar");
  const fallbackAvatar =
    "../assets/images/images-misc/profile-pic-placeholder.jpg";

  if (listing.seller) {
    if (sellerName) {
      sellerName.textContent = listing.seller.name || "Unknown";
    }
    if (sellerEmail) {
      sellerEmail.textContent = listing.seller.email || "N/A";
    }
    if (sellerAvatar) {
      let avatarUrl = fallbackAvatar;
      if (listing.seller.avatar) {
        if (listing.seller.avatar.url) {
          avatarUrl = listing.seller.avatar.url;
        } else if (typeof listing.seller.avatar === "string") {
          avatarUrl = listing.seller.avatar;
        }
      }

      let avatarAlt = listing.seller.name || "Seller";
      if (listing.seller.avatar && listing.seller.avatar.alt) {
        avatarAlt = listing.seller.avatar.alt;
      }

      sellerAvatar.innerHTML = `<img src="${avatarUrl}" alt="${avatarAlt}" class="w-full h-full object-cover rounded-full" />`;
    }
  }
}

function showError(message) {
  const container = document.querySelector("#listing-content-container");
  if (container) {
    container.innerHTML = `
      <div class="w-full max-w-[408px] lg:max-w-[1246px] mx-auto bg-white lg:bg-background shadow-[0px_4px_40px_rgba(0,0,0,0.15)] rounded-[40px] overflow-hidden p-8 lg:p-12">
        <div class="text-center">
          <p class="font-lato text-accent text-lg lg:text-xl mb-4">${message}</p>
          <a href="all-listings.html" class="font-lato text-accent underline hover:no-underline">
            Return to All Listings
          </a>
        </div>
      </div>
    `;
  }
}

function showBidError(message) {
  hideBidError();

  const errorMessage = document.createElement("p");
  errorMessage.className =
    "bid-error-message font-lato text-accent text-[14px] lg:text-[16px] mt-2 text-center";
  errorMessage.textContent = message;

  const bidInput = document.getElementById("bid-input");
  const bidButton = document.getElementById("bid-submit");

  if (
    bidInput &&
    bidInput.style.visibility !== "hidden" &&
    bidButton &&
    bidButton.parentElement
  ) {
    bidButton.parentElement.insertBefore(errorMessage, bidButton);
  }
}

function hideBidError() {
  const errorElements = document.querySelectorAll(".bid-error-message");
  errorElements.forEach((el) => el.remove());
}

// calculate minimum bid (top bid + 1, minimum 1)
function getMinimumBid() {
  if (!currentListing) return 1;

  const startingPrice = currentListing.price || 0;
  const highestBid = getHighestBid(currentListing.bids, startingPrice);
  const minimumBid = highestBid + 1;

  return Math.max(minimumBid, 1);
}

// load and display user credit balance
async function loadUserCredits() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.name;
  const token = localStorage.getItem("token");

  const creditBalances = document.querySelectorAll(".user-credit-balance");
  const pointBalanceLabel = document.getElementById("point-balance-label");
  const bidInput = document.getElementById("bid-input");
  const bidButton = document.getElementById("bid-submit");

  if (!userName || !token) {
    if (pointBalanceLabel) {
      pointBalanceLabel.innerHTML =
        '<a href="login.html" class="text-accent underline hover:no-underline">Login to place a bid</a>';
      pointBalanceLabel.style.visibility = "visible";
    }

    if (bidInput) {
      bidInput.style.visibility = "hidden";
      bidInput.style.pointerEvents = "none";
    }
    if (bidButton) {
      bidButton.style.visibility = "hidden";
      bidButton.style.pointerEvents = "none";
    }
    return;
  }

  if (pointBalanceLabel) pointBalanceLabel.style.visibility = "visible";
  if (bidInput) {
    bidInput.style.visibility = "visible";
    bidInput.style.pointerEvents = "auto";
  }
  if (bidButton) {
    bidButton.style.visibility = "visible";
    bidButton.style.pointerEvents = "auto";
  }

  try {
    const response = await getProfile(userName);
    const profileData = response.data || response;
    const credits = profileData.credits || profileData.credit || 0;
    const formattedCredits = credits.toLocaleString();

    creditBalances.forEach((balance) => {
      balance.textContent = `${formattedCredits} Points`;
    });
  } catch (error) {
    console.error("Failed to load user credits:", error);
    if (pointBalanceLabel) {
      pointBalanceLabel.innerHTML =
        '<a href="login.html" class="text-accent underline hover:no-underline">Login to place a bid</a>';
      pointBalanceLabel.style.visibility = "visible";
    }
    if (bidInput) {
      bidInput.style.visibility = "hidden";
      bidInput.style.pointerEvents = "none";
    }
    if (bidButton) {
      bidButton.style.visibility = "hidden";
      bidButton.style.pointerEvents = "none";
    }
  }
}

// validate and submit bid
async function handleBidSubmission(bidAmount) {
  const listingId = getListingIdFromUrl();
  if (!listingId) {
    showBidError("Listing ID not found");
    return;
  }

  if (currentListing) {
    const daysLeft = calculateDaysLeft(currentListing.endsAt);
    if (daysLeft <= 0) {
      showBidError("This auction has ended");
      return;
    }
  }

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.name;

  if (userName && currentListing && currentListing.bids) {
    let userHasBid = false;
    for (let i = 0; i < currentListing.bids.length; i++) {
      if (
        currentListing.bids[i].bidder &&
        currentListing.bids[i].bidder.name === userName
      ) {
        userHasBid = true;
        break;
      }
    }

    if (userHasBid) {
      showBidError("You have already placed a bid on this listing");
      return;
    }
  }

  const minimumBid = getMinimumBid();

  if (bidAmount < minimumBid) {
    showBidError("Bid must be higher than current highest bid");
    return;
  }

  hideBidError();

  const bidInput = document.getElementById("bid-input");
  const bidButton = document.getElementById("bid-submit");

  if (bidInput) {
    bidInput.disabled = true;
  }
  if (bidButton) {
    bidButton.disabled = true;
    const originalText = bidButton.textContent;
    bidButton.textContent = "Submitting...";
    bidButton.dataset.originalText = originalText;
  }

  try {
    await placeBid(listingId, bidAmount);
    window.location.reload();
  } catch (error) {
    console.error("Failed to place bid:", error);
    showBidError(error.message || "Failed to place a bid. Please try again.");

    if (bidInput) bidInput.disabled = false;
    if (bidButton) {
      bidButton.disabled = false;
      bidButton.textContent =
        bidButton.dataset.originalText || "Submit Your Bid";
    }
  }
}

// setup event listeners for bid form
function setupBidSubmission() {
  const bidInput = document.getElementById("bid-input");
  const bidButton = document.getElementById("bid-submit");

  if (bidButton) {
    bidButton.addEventListener("click", () => {
      if (bidInput) {
        const bidAmount = Number(bidInput.value.trim());

        if (!bidAmount || isNaN(bidAmount) || bidAmount <= 0) {
          showBidError("Please enter a valid bid amount");
          return;
        }

        handleBidSubmission(bidAmount);
      }
    });
  }

  if (bidInput) {
    bidInput.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, "");
    });

    bidInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const bidAmount = Number(bidInput.value.trim());

        if (!bidAmount || isNaN(bidAmount) || bidAmount <= 0) {
          showBidError("Please enter a valid bid amount");
          return;
        }

        handleBidSubmission(bidAmount);
      }
    });
  }
}

// initialize page - fetch listing data and setup
export async function initCurrentListing() {
  const listingId = getListingIdFromUrl();

  if (!listingId) {
    showError(
      "No listing ID provided. Please select a listing from the listings page."
    );
    return;
  }

  loadUserCredits();

  const container = document.querySelector("#listing-content-container");
  let originalHTML = "";
  if (container) {
    originalHTML = container.innerHTML;
    container.innerHTML = `
      <div class="flex justify-center items-center py-12 lg:py-16 min-h-[200px]">
        <div class="w-8 h-8 lg:w-10 lg:h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    `;
  }

  try {
    const response = await getListing(listingId, {
      _seller: true,
      _bids: true,
    });

    const listing = response.data || response;

    if (!listing || !listing.id) {
      showError(
        "Listing not found. It may have been removed or the ID is incorrect."
      );
      return;
    }

    if (container && originalHTML) {
      container.innerHTML = originalHTML;
    }

    currentListing = listing;

    populateListingData(listing);
    checkAuctionStatus(listing);
    setupBidSubmission();
  } catch (error) {
    console.error("Failed to load listing:", error);
    showError("Failed to load listing. Please try again later.");
  }
}

// check if auction ended and find winner
function checkAuctionStatus(listing) {
  const daysLeft = calculateDaysLeft(listing.endsAt);
  const isEnded = daysLeft <= 0;

  if (!isEnded) return;

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.name;

  const bidInput = document.getElementById("bid-input");
  const bidButton = document.getElementById("bid-submit");
  const pointBalanceLabel = document.getElementById("point-balance-label");

  if (bidInput) {
    bidInput.style.visibility = "hidden";
    bidInput.style.pointerEvents = "none";
  }
  if (bidButton) {
    bidButton.style.visibility = "hidden";
    bidButton.style.pointerEvents = "none";
  }

  let winnerMessage = "";
  if (listing.bids && listing.bids.length > 0) {
    const startingPrice = listing.price || 0;
    const highestBid = getHighestBid(listing.bids, startingPrice);

    let winnerName = null;
    for (let i = 0; i < listing.bids.length; i++) {
      if (listing.bids[i].amount === highestBid) {
        if (listing.bids[i].bidder && listing.bids[i].bidder.name) {
          winnerName = listing.bids[i].bidder.name;
        }
        break;
      }
    }

    if (userName && winnerName === userName) {
      winnerMessage = "Congratulations! You won this auction!";
    } else {
      winnerMessage = "This auction has ended";
    }
  } else {
    winnerMessage = "This auction has ended with no bids";
  }

  if (pointBalanceLabel) {
    pointBalanceLabel.innerHTML = `<span class="font-lato text-accent text-[16px] lg:text-[18px]">${winnerMessage}</span>`;
    pointBalanceLabel.style.visibility = "visible";
  }
}

function showSuccessMessage() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("created") === "true") {
    const successMessage = document.getElementById("listing-success-message");
    if (successMessage) {
      successMessage.classList.remove("hidden");

      setTimeout(() => {
        successMessage.classList.add("hidden");
        const newUrl =
          window.location.pathname + "?id=" + getListingIdFromUrl();
        window.history.replaceState({}, "", newUrl);
      }, 5000);
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initCurrentListing();
    showSuccessMessage();
  });
} else {
  initCurrentListing();
  showSuccessMessage();
}
