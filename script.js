/* =========================================================
   DARK STUDY — SCRIPT.JS
   ========================================================= */

"use strict";

/* ---------------------------------------------------------
   CONFIG
   --------------------------------------------------------- */

const CONFIG = {
  appDownloadUrl: "#",
  telegramUrl: "#"
};


/* ---------------------------------------------------------
   ELEMENTS
   --------------------------------------------------------- */

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");
const yearElement = document.getElementById("year");
const downloadBtn = document.getElementById("downloadBtn");
const telegramLink = document.getElementById("telegramLink");


/* ---------------------------------------------------------
   CURRENT YEAR
   --------------------------------------------------------- */

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}


/* ---------------------------------------------------------
   MOBILE MENU
   --------------------------------------------------------- */

if (menuBtn && mobileMenu) {

  menuBtn.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("active");

    menuBtn.setAttribute(
      "aria-expanded",
      isOpen ? "true" : "false"
    );

    menuBtn.textContent = isOpen ? "✕" : "☰";
  });


  // Close menu after clicking a link
  mobileMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");

      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.textContent = "☰";
    });
  });

}


/* ---------------------------------------------------------
   TOAST
   --------------------------------------------------------- */

let toastTimer;

function showToast(message) {

  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;

  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}


/* ---------------------------------------------------------
   BATCH / RESOURCE BUTTONS
   --------------------------------------------------------- */

document.querySelectorAll("[data-action]").forEach(button => {

  button.addEventListener("click", () => {

    const action = button.dataset.action;
    const name = button.dataset.name || "This resource";

    if (action === "batch") {
      showToast(`${name} will be available soon.`);
      return;
    }

    if (action === "resource") {
      showToast(`${name} section is coming soon.`);
      return;
    }

  });

});


/* ---------------------------------------------------------
   APP DOWNLOAD
   --------------------------------------------------------- */

if (downloadBtn) {

  downloadBtn.addEventListener("click", event => {

    if (
      !CONFIG.appDownloadUrl ||
      CONFIG.appDownloadUrl === "#"
    ) {
      event.preventDefault();

      showToast("App download will be available soon.");
      return;
    }

    downloadBtn.href = CONFIG.appDownloadUrl;
  });

}


/* ---------------------------------------------------------
   TELEGRAM
   --------------------------------------------------------- */

if (telegramLink) {

  telegramLink.addEventListener("click", event => {

    if (
      !CONFIG.telegramUrl ||
      CONFIG.telegramUrl === "#"
    ) {
      event.preventDefault();

      showToast("Telegram link will be added soon.");
      return;
    }

    telegramLink.href = CONFIG.telegramUrl;
    telegramLink.target = "_blank";
    telegramLink.rel = "noopener noreferrer";
  });

}


/* ---------------------------------------------------------
   CLOSE MOBILE MENU WHEN CLICKING OUTSIDE
   --------------------------------------------------------- */

document.addEventListener("click", event => {

  if (!mobileMenu || !menuBtn) return;

  const clickedInsideMenu =
    mobileMenu.contains(event.target);

  const clickedMenuButton =
    menuBtn.contains(event.target);

  if (
    mobileMenu.classList.contains("active") &&
    !clickedInsideMenu &&
    !clickedMenuButton
  ) {
    mobileMenu.classList.remove("active");

    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.textContent = "☰";
  }

});


/* ---------------------------------------------------------
   ESC KEY — CLOSE MENU
   --------------------------------------------------------- */

document.addEventListener("keydown", event => {

  if (event.key !== "Escape") return;

  if (
    mobileMenu &&
    mobileMenu.classList.contains("active")
  ) {

    mobileMenu.classList.remove("active");

    if (menuBtn) {
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.textContent = "☰";
    }

  }

});


/* ---------------------------------------------------------
   ACTIVE NAVIGATION
   --------------------------------------------------------- */

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(
  ".nav-links a, .mobile-menu a"
);

window.addEventListener(
  "scroll",
  () => {

    let currentSection = "";

    sections.forEach(section => {

      const sectionTop =
        section.offsetTop - 120;

      if (window.scrollY >= sectionTop) {
        currentSection = section.id;
      }

    });

    navLinks.forEach(link => {

      const href = link.getAttribute("href");

      link.classList.toggle(
        "active",
        href === `#${currentSection}`
      );

    });

  },
  { passive: true }
);


/* ---------------------------------------------------------
   PREVENT EMPTY HASH JUMP
   --------------------------------------------------------- */

document.querySelectorAll('a[href="#"]').forEach(link => {

  link.addEventListener("click", event => {
    event.preventDefault();
  });

});


/* ---------------------------------------------------------
   CONSOLE
   --------------------------------------------------------- */

console.log(
  "%cDark Study",
  "font-size:22px;font-weight:bold;"
);

console.log(
  "Dark Study website loaded successfully."
);
