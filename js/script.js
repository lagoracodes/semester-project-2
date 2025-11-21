const hamburgerBtn = document.getElementById("hamburger-btn");
const closeMenuBtn = document.getElementById("close-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const menuOverlay = document.getElementById("menu-overlay");

function openMenu() {
  mobileMenu.classList.add("menu-open");
  menuOverlay.classList.add("menu-open");
  document.body.classList.add("menu-open");
}

function closeMenu() {
  mobileMenu.classList.remove("menu-open");
  menuOverlay.classList.remove("menu-open");
  document.body.classList.remove("menu-open");
}

hamburgerBtn.addEventListener("click", openMenu);
closeMenuBtn.addEventListener("click", closeMenu);
menuOverlay.addEventListener("click", closeMenu);

const menuLinks = mobileMenu.querySelectorAll("nav a");
menuLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

mobileMenu.addEventListener("click", function (e) {
  if (e.target === mobileMenu) {
    closeMenu();
  }
});
