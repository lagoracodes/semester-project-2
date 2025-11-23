import { createListing } from "../api/listings/create.js";
import { isValidImageUrl } from "../utils/validation.js";

const form = document.querySelector("form");
const itemNameInput = document.getElementById("item-name");
const itemDescriptionInput = document.getElementById("item-description");
const itemPictureInput = document.getElementById("item-picture");
const listingDeadlineInput = document.getElementById("listing-deadline");
const submitButton = document.querySelector('button[type="submit"]');

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;

  let errorElement = field.parentElement.querySelector(".error-message");
  if (!errorElement) {
    errorElement = document.createElement("p");
    errorElement.className =
      "error-message font-lato text-accent text-[12px] lg:text-[14px] mt-1";
    field.parentElement.appendChild(errorElement);
  }
  errorElement.textContent = message;
  errorElement.classList.remove("hidden");
}

function hideError(fieldId) {
  const field = document.querySelector(`#${fieldId}`);
  if (field && field.parentElement) {
    const errorElement = field.parentElement.querySelector(".error-message");
    if (errorElement) {
      errorElement.classList.add("hidden");
      errorElement.textContent = "";
    }
  }
}

function hideAllErrors() {
  const fieldIds = [
    "item-name",
    "item-description",
    "item-picture",
    "listing-deadline",
  ];
  fieldIds.forEach(hideError);
}

function validateForm() {
  hideAllErrors();
  let isValid = true;

  const itemName = itemNameInput.value.trim();
  if (!itemName) {
    showError("item-name", "Item name is required");
    isValid = false;
  }

  const itemDescription = itemDescriptionInput.value.trim();
  if (!itemDescription) {
    showError("item-description", "Item description is required");
    isValid = false;
  } else if (itemDescription.length > 280) {
    showError(
      "item-description",
      "Description cannot be greater than 280 characters"
    );
    isValid = false;
  }

  const listingDeadline = listingDeadlineInput.value.trim();
  if (!listingDeadline) {
    showError("listing-deadline", "Listing deadline is required");
    isValid = false;
  } else {
    const deadlineDate = new Date(listingDeadline);
    if (isNaN(deadlineDate.getTime()) || deadlineDate <= new Date()) {
      showError("listing-deadline", "Deadline must be a valid future date");
      isValid = false;
    }
  }

  const imageUrl = itemPictureInput.value.trim();
  if (imageUrl && !isValidImageUrl(imageUrl)) {
    showError(
      "item-picture",
      "Please enter a valid image URL (must start with http:// or https://)"
    );
    isValid = false;
  }

  return isValid;
}

// set deadline to end of day
function formatDateToISO(dateString) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;

  date.setHours(23, 59, 59, 999);
  return date.toISOString();
}

// convert image url to api format (object with url and alt)
async function handleImageUrl(url) {
  if (!url || !url.trim()) return null;

  if (!isValidImageUrl(url)) {
    throw new Error("Invalid image URL. Must start with http:// or https://");
  }

  return {
    url: url.trim(),
    alt: itemNameInput.value.trim() || "Listing image",
  };
}

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideAllErrors();

    if (!validateForm()) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      showError("item-name", "You must be logged in to create a listing");
      window.location.href = "login.html";
      return;
    }

    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Creating Listing...";

    try {
      const itemName = itemNameInput.value.trim();
      const itemDescription = itemDescriptionInput.value.trim();
      const listingDeadline = formatDateToISO(
        listingDeadlineInput.value.trim()
      );

      let media = null;

      const imageUrl = itemPictureInput.value.trim();
      if (imageUrl) {
        try {
          media = await handleImageUrl(imageUrl);
        } catch (error) {
          showError("item-picture", error.message);
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
          return;
        }
      }

      const listingData = {
        title: itemName,
        description: itemDescription,
        endsAt: listingDeadline,
      };

      if (media) {
        listingData.media = [media];
      }

      const response = await createListing(listingData);
      const createdListing = response.data || response;

      if (createdListing && createdListing.id) {
        window.location.href = `current-listing.html?id=${createdListing.id}&created=true`;
      } else {
        throw new Error("Failed to create listing");
      }
    } catch (error) {
      console.error("Failed to create listing:", error);
      const errorMessage =
        error.message || "Failed to create listing. Please try again.";
      showError("item-name", errorMessage);
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
}

if (listingDeadlineInput) {
  listingDeadlineInput.addEventListener("click", function () {
    this.showPicker();
  });
}
