import { getProfile } from "../api/profiles/get.js";
import { updateProfile } from "../api/profiles/update.js";
import { updateHeader } from "../utils/header.js";
import { isValidImageUrl } from "../utils/validation.js";

const PLACEHOLDER_IMAGE =
  "../assets/images/images-misc/profile-pic-placeholder.jpg";

function populateProfileFields(profileData) {
  const userNameEl = document.getElementById("user-name");
  if (userNameEl && profileData.name) {
    userNameEl.textContent = profileData.name;
  }

  const userEmailEl = document.getElementById("user-email");
  if (userEmailEl && profileData.email) {
    userEmailEl.textContent = profileData.email;
  }

  const userCreditEl = document.getElementById("user-credit");
  if (userCreditEl) {
    const credit = profileData.credits || profileData.credit || 0;
    userCreditEl.textContent = credit.toLocaleString();
  }

  const avatarImage = document.getElementById("avatar-image");

  if (avatarImage) {
    let avatarUrl = null;
    if (profileData.avatar) {
      if (profileData.avatar.url) {
        avatarUrl = profileData.avatar.url;
      } else if (typeof profileData.avatar === "string") {
        avatarUrl = profileData.avatar;
      }
    }

    if (avatarUrl) {
      avatarImage.src = avatarUrl;
    } else {
      avatarImage.src = PLACEHOLDER_IMAGE;
    }

    avatarImage.onerror = () => {
      avatarImage.src = PLACEHOLDER_IMAGE;
    };
  }
}

function showProfileError(message) {
  const profileContainer = document.getElementById("profile-container");
  const mainElement = document.querySelector("main");

  if (profileContainer) {
    profileContainer.innerHTML = `
      <div class="text-center pt-8 pb-4 lg:pt-12 lg:pb-6">
        <p class="font-lato text-accent text-[16px] lg:text-[18px]">
          <span class="block lg:inline">Profile couldn't be loaded.</span>
          <span class="block lg:inline"> Please try again.</span>
        </p>
      </div>
    `;

    if (mainElement) {
      mainElement.classList.add("items-start");
      mainElement.classList.remove("items-center");
      mainElement.classList.add("pt-8");
      mainElement.classList.remove("py-12");
    }
  }
}

async function loadProfile() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.name;

  if (!userName) {
    showProfileError("You must be logged in to view your profile.");
    return;
  }

  const container = document.getElementById("profile-container");
  if (!container) return;

  const originalHTML = container.innerHTML;
  container.innerHTML = `
    <div class="flex justify-center items-center py-12 lg:py-16 min-h-[200px]">
      <div class="w-8 h-8 lg:w-10 lg:h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
    </div>
  `;

  try {
    const response = await getProfile(userName);
    const profileData = response.data || response;

    container.innerHTML = originalHTML;
    setupProfileEventListeners();

    populateProfileFields(profileData);

    const updatedUser = { ...user, ...profileData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
  } catch (error) {
    console.error("Failed to load profile:", error);
    showProfileError("Profile couldn't be loaded. Please try again.");
  }
}

function showAvatarError(message) {
  const errorMessage = document.getElementById("avatar-error-message");
  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
  }
}

function hideAvatarError() {
  const errorMessage = document.getElementById("avatar-error-message");
  if (errorMessage) {
    errorMessage.textContent = "";
    errorMessage.classList.add("hidden");
  }
}

function showAvatarSuccess() {
  const errorMessage = document.getElementById("avatar-error-message");
  if (errorMessage) {
    errorMessage.textContent = "Profile picture updated successfully!";
    errorMessage.classList.remove("hidden");
    errorMessage.classList.remove("text-accent");
    errorMessage.classList.add("text-green-600");

    setTimeout(() => {
      errorMessage.textContent = "";
      errorMessage.classList.add("hidden");
      errorMessage.classList.remove("text-green-600");
      errorMessage.classList.add("text-accent");
    }, 3000);
  }
}

async function handleAvatarUpdate(url) {
  const avatarImage = document.getElementById("avatar-image");
  if (!avatarImage) return false;

  hideAvatarError();

  if (!isValidImageUrl(url)) {
    showAvatarError(
      "Please enter a valid image URL (must start with http:// or https://)"
    );
    return false;
  }

  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userName = user.name;

    if (!userName) {
      showAvatarError("User not logged in");
      return false;
    }

    const response = await updateProfile(userName, {
      avatar: {
        url: url,
        alt: "Profile avatar",
      },
    });

    hideAvatarError();
    const updatedProfile = response.data || response;
    if (updatedProfile) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { ...user, ...updatedProfile };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      populateProfileFields(updatedUser);
      updateHeader();
      showAvatarSuccess();
    }
    return true;
  } catch (error) {
    console.error("Failed to update avatar:", error);
    showAvatarError(`Failed to update avatar: ${error.message}`);
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    let avatarUrl = PLACEHOLDER_IMAGE;
    if (user.avatar) {
      if (user.avatar.url) {
        avatarUrl = user.avatar.url;
      } else if (typeof user.avatar === "string") {
        avatarUrl = user.avatar;
      }
    }
    avatarImage.src = avatarUrl;
    return false;
  }
}

function setupProfileEventListeners() {
  const avatarImage = document.getElementById("avatar-image");

  if (avatarImage) {
    avatarImage.addEventListener("error", function handler() {
      avatarImage.src = PLACEHOLDER_IMAGE;
      avatarImage.removeEventListener("error", handler);
    });
  }

  const changeProfilePicBtn = document.getElementById("change-profile-pic-btn");
  const avatarFormSection = document.getElementById("avatar-form-section");
  const closeFormBtn = document.getElementById("close-form-btn");
  const saveAvatarBtn = document.getElementById("save-avatar-btn");
  const avatarUrlModal = document.getElementById("avatar-url-modal");

  if (changeProfilePicBtn && avatarFormSection) {
    changeProfilePicBtn.addEventListener("click", () => {
      avatarFormSection.classList.remove("hidden");
      changeProfilePicBtn.classList.add("hidden");
      hideAvatarError();
      if (avatarUrlModal) {
        avatarUrlModal.value = "";
        avatarUrlModal.focus();
      }
    });
  }

  function closeForm() {
    if (avatarFormSection) avatarFormSection.classList.add("hidden");
    if (changeProfilePicBtn) changeProfilePicBtn.classList.remove("hidden");
    hideAvatarError();
    if (avatarUrlModal) avatarUrlModal.value = "";
  }

  async function handleSave() {
    let url = "";
    if (avatarUrlModal && avatarUrlModal.value) {
      url = avatarUrlModal.value.trim();
    }
    if (!url) {
      showAvatarError("Please enter an image URL");
      return;
    }
    const success = await handleAvatarUpdate(url);
    if (success) {
      closeForm();
    }
  }

  if (closeFormBtn) {
    closeFormBtn.addEventListener("click", closeForm);
  }

  if (saveAvatarBtn) {
    saveAvatarBtn.addEventListener("click", handleSave);
  }

  if (avatarUrlModal) {
    avatarUrlModal.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleSave();
      }
    });
  }
}

export function initProfile() {
  const container = document.getElementById("profile-container");
  const avatarImage = document.getElementById("avatar-image");

  if (avatarImage) {
    avatarImage.src = PLACEHOLDER_IMAGE;
  }

  loadProfile();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initProfile);
} else {
  initProfile();
}
