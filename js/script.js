const navToggle = document.getElementById("navToggle");
const siteNav = document.getElementById("siteNav");
if (navToggle) navToggle.addEventListener("click", () => siteNav.classList.toggle("open"));

const tabButtons = document.querySelectorAll(".tab-btn");
tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabButtons.forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".menu-panel").forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

const stars = document.querySelectorAll(".star");
const ratingInput = document.getElementById("ratingInput");
stars.forEach((star) => {
  star.addEventListener("click", () => {
    const value = parseInt(star.dataset.value, 10);
    if (ratingInput) ratingInput.value = value;
    stars.forEach((s) => s.classList.toggle("selected", parseInt(s.dataset.value, 10) <= value));
  });
});
