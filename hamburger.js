// =============================
// MENU HAMBURGER
// ReabilitaCare
// =============================
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('navMenu');
    var icon = document.getElementById('navIcon');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', function () {
      menu.classList.toggle('aberto');
      if (icon) {
        icon.className = menu.classList.contains('aberto')
          ? 'bi bi-x'
          : 'bi bi-list';
      }
    });

    // Fecha o menu ao clicar em um link
    var links = menu.querySelectorAll('a');
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('aberto');
        if (icon) icon.className = 'bi bi-list';
      });
    });
  });
})();
