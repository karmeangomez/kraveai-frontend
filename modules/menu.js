// menu.js - Manejo de submenús para KraveAI
document.querySelectorAll('.menu-toggle').forEach(button => {
  button.addEventListener('click', () => {
    const targetId = button.getAttribute('data-target');
    const submenu = document.getElementById(targetId);
    const isVisible = submenu.style.display === 'block';

    // Ocultar todos los submenús primero
    document.querySelectorAll('.submenu').forEach(menu => {
      menu.style.display = 'none';
    });

    // Mostrar u ocultar el submenú actual
    submenu.style.display = isVisible ? 'none' : 'block';
  });
});

// Cerrar submenús al hacer clic fuera
document.addEventListener('click', (event) => {
  if (!event.target.closest('.menu-toggle') && !event.target.closest('.submenu')) {
    document.querySelectorAll('.submenu').forEach(menu => {
      menu.style.display = 'none';
    });
  }
});
