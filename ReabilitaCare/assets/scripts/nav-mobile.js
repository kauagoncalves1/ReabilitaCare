// nav-mobile.js — Toggle do menu hambúrguer
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const bottomHeader = document.querySelector(".bottom-header");

  if (!toggle || !bottomHeader) return;

  toggle.addEventListener("click", () => {
    const isOpen = bottomHeader.classList.toggle("nav-open");
    toggle.classList.toggle("active", isOpen);
    toggle.setAttribute("aria-expanded", isOpen);
  });

  // Fecha o menu ao clicar em um link
  const navLinks = bottomHeader.querySelectorAll("nav a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      bottomHeader.classList.remove("nav-open");
      toggle.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
});
