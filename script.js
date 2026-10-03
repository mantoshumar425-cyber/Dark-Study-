"use strict";

const toast = document.querySelector("#toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

document.querySelector("#themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  document.querySelector("#themeToggle").textContent = dark ? "☀" : "☾";
  document.querySelector("#themeToggle").setAttribute("aria-label", dark ? "Use light mode" : "Use dark mode");
});

document.querySelector("#loginButton").addEventListener("click", () => showToast("Account menu coming soon — your progress is saved here."));

document.querySelectorAll("[data-course]").forEach((button) => {
  button.addEventListener("click", () => showToast(`Opening ${button.dataset.course}`));
});

document.querySelectorAll(".filter").forEach((filter) => {
  filter.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((item) => item.classList.remove("active"));
    filter.classList.add("active");
    const type = filter.dataset.filter;
    document.querySelectorAll(".resource").forEach((resource) => {
      resource.hidden = type !== "all" && resource.dataset.type !== type;
    });
  });
});

document.querySelectorAll(".resource").forEach((resource) => {
  resource.addEventListener("click", () => showToast(`Opening ${resource.querySelector("strong").textContent}`));
});

document.querySelectorAll("a[href^='#']").forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});
