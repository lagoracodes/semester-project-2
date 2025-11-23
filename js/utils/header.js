import { getProfile } from "../api/profiles/get.js";

const PLACEHOLDER_IMAGE =
  "../assets/images/images-misc/profile-pic-placeholder.jpg";

function handleLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  if (window.location.pathname.includes("profile.html")) {
    window.location.href = window.location.pathname.includes("pages/")
      ? "../index.html"
      : "index.html";
    return;
  }

  updateHeader();
  window.location.reload();
}

export async function updateHeader() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isLoggedIn = !!token && !!user.name;

  const loginLinkDesktop = document.getElementById("login-link-desktop");
  const loginLinkMobile = document.getElementById("login-link-mobile");
  const logoutBtnDesktop = document.getElementById("logout-btn-desktop");
  const logoutBtnMobile = document.getElementById("logout-btn-mobile");
  const profilePicDesktop = document.getElementById("profile-pic-desktop");
  const profilePicMobile = document.getElementById("profile-pic-mobile");

  if (isLoggedIn) {
    if (loginLinkDesktop) loginLinkDesktop.classList.add("hidden");
    if (loginLinkMobile) loginLinkMobile.classList.add("hidden");
    if (logoutBtnDesktop) {
      logoutBtnDesktop.classList.remove("hidden");
      logoutBtnDesktop.onclick = handleLogout;
    }
    if (logoutBtnMobile) {
      logoutBtnMobile.classList.remove("hidden");
      logoutBtnMobile.onclick = handleLogout;
    }
    if (profilePicDesktop) profilePicDesktop.classList.remove("hidden");
    if (profilePicMobile) profilePicMobile.classList.remove("hidden");

    if (user.name) {
      try {
        const response = await getProfile(user.name);
        const profileData = response.data || response;

        let avatarUrl = null;
        if (profileData.avatar) {
          if (profileData.avatar.url) {
            avatarUrl = profileData.avatar.url;
          } else if (typeof profileData.avatar === "string") {
            avatarUrl = profileData.avatar;
          }
        }

        if (profilePicDesktop) {
          const img = profilePicDesktop.querySelector("img");
          if (img) {
            img.src = avatarUrl || PLACEHOLDER_IMAGE;
          }
        }
        if (profilePicMobile) {
          const img = profilePicMobile.querySelector("img");
          if (img) {
            img.src = avatarUrl || PLACEHOLDER_IMAGE;
          }
        }
      } catch (error) {
        if (profilePicDesktop) {
          const img = profilePicDesktop.querySelector("img");
          if (img) img.src = PLACEHOLDER_IMAGE;
        }
        if (profilePicMobile) {
          const img = profilePicMobile.querySelector("img");
          if (img) img.src = PLACEHOLDER_IMAGE;
        }
      }
    }
  } else {
    if (loginLinkDesktop) loginLinkDesktop.classList.remove("hidden");
    if (loginLinkMobile) loginLinkMobile.classList.remove("hidden");
    if (logoutBtnDesktop) logoutBtnDesktop.classList.add("hidden");
    if (logoutBtnMobile) logoutBtnMobile.classList.add("hidden");
    if (profilePicDesktop) profilePicDesktop.classList.add("hidden");
    if (profilePicMobile) profilePicMobile.classList.add("hidden");
  }
}
