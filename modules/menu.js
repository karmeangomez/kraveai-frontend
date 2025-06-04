// menu.js - Manejo de submenús para KraveAI
document.querySelectorAll('.social-button').forEach(button => {
  button.addEventListener('click', (event) => {
    const menuId = button.getAttribute('onclick').match(/'([^']+)'/)[1];
    toggleSubmenu(event, menuId);
  });
});

function toggleSubmenu(event, menuId) {
  event.preventDefault();
  const submenu = document.getElementById(menuId);
  submenu.classList.toggle('active');

  // Ocultar otros submenús
  document.querySelectorAll('.submenu').forEach(otherMenu => {
    if (otherMenu !== submenu) otherMenu.classList.remove('active');
  });
}

// Cerrar submenús al hacer clic fuera
document.addEventListener('click', (event) => {
  if (!event.target.closest('.social-button') && !event.target.closest('.submenu')) {
    document.querySelectorAll('.submenu').forEach(menu => {
      menu.classList.remove('active');
    });
  }
});
