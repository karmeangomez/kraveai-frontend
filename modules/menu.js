// modules/menu.js

document.addEventListener("DOMContentLoaded", () => {
  const toggles = document.querySelectorAll(".menu-toggle");

  toggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const submenu = document.getElementById(targetId);

      document.querySelectorAll(".submenu").forEach((el) => {
        if (el !== submenu) el.style.display = "none";
      });

      submenu.style.display =
        submenu.style.display === "block" ? "none" : "block";
    });
  });
});
