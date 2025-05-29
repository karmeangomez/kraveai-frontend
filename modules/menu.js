// modules/menu.js

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".main-buttons button");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.innerText.toLowerCase().replace(" ", "");
      window.location.href = `modules/${name}/index.html`;
    });
  });
});
