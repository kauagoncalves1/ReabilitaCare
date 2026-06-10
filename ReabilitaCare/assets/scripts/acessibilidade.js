// =============================
// BOTÃO DE ACESSIBILIDADE - MODO ALTO CONTRASTE
// ReabilitaCare
// =============================

(function () {
  const STORAGE_KEY = 'reabilitacare_alto_contraste';

  /* ---------- CSS global ---------- */
  const styleEl = document.createElement('style');
  styleEl.id = 'rc-pb-style';
  styleEl.textContent = `
    /* === MODO ALTO CONTRASTE === */
    html.modo-pb *,
    html.modo-pb *::before,
    html.modo-pb *::after {
      background-color: #000000 !important;
      color: #ffffff !important;
      border-color: #ffffff !important;
      box-shadow: none !important;
      text-shadow: none !important;
      background-image: none !important;
    }

    html.modo-pb a,
    html.modo-pb a:visited,
    html.modo-pb a:hover {
      color: #ffff00 !important;
      text-decoration: underline !important;
    }

    html.modo-pb button:hover,
    html.modo-pb input[type="submit"]:hover {
      background-color: #ffffff !important;
      color: #000000 !important;
    }

    html.modo-pb img,
    html.modo-pb video,
    html.modo-pb iframe {
      filter: grayscale(100%) contrast(1.2) brightness(0.85) !important;
    }

    /* === PRESERVAR LOGO === */
    html.modo-pb .logotipo img,
    html.modo-pb .footer-brand img,
    html.modo-pb img[alt*="Logo"],
    html.modo-pb img[alt*="logo"] {
      filter: brightness(0) invert(1) !important;
      background-color: transparent !important;
    }

    /* === BOTÃO DA LUA - igual ao Instagram === */
    #rc-btn-pb {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 32px;
      height: 32px;
      margin-left: 10px;
      border-radius: 50%;
      border: 1.5px solid #016366;
      color: #016366;
      font-size: 16px;
      background: transparent;
      cursor: pointer;
      transition: 0.3s;
      padding: 0;
      flex-shrink: 0;
    }
    #rc-btn-pb:hover {
      background: #00bfff;
      color: #fff;
      border-color: #00bfff;
      transform: translateY(-3px);
    }
    #rc-btn-pb.ativo {
      background: #016366;
      color: #fff;
      border-color: #016366;
    }
    #rc-btn-pb svg {
      width: 15px;
      height: 15px;
      display: block;
      fill: currentColor;
    }

    /* Preserva estilo do botão no modo contraste */
    html.modo-pb #rc-btn-pb {
      background-color: #000000 !important;
      border: 1.5px solid #ffff00 !important;
      color: #ffff00 !important;
    }
    html.modo-pb #rc-btn-pb svg {
      fill: #ffff00 !important;
    }
    html.modo-pb #rc-btn-pb.ativo {
      background-color: #ffff00 !important;
      color: #000000 !important;
    }
    html.modo-pb #rc-btn-pb.ativo svg {
      fill: #000000 !important;
    }

    /* Fallback fixo para páginas sem .btn-social (videochamada) */
    #rc-btn-pb.fixo {
      position: fixed;
      top: 14px;
      right: 18px;
      z-index: 99999;
      margin-left: 0;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }
  `;
  document.head.appendChild(styleEl);

  /* ---------- Criar o botão ---------- */
  const btn = document.createElement('button');
  btn.id = 'rc-btn-pb';
  btn.setAttribute('aria-label', 'Ativar modo alto contraste');
  btn.setAttribute('title', 'Acessibilidade: Alto Contraste');
  btn.setAttribute('type', 'button');

  // Apenas a lua
  btn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
    </svg>
  `;

  /* ---------- Injetar ---------- */
  function injetar() {
    if (document.getElementById('rc-btn-pb')) return;
    const social = document.querySelector('.btn-social');
    if (social) {
      social.insertBefore(btn, social.firstChild);
    } else {
      btn.classList.add('fixo');
      document.body.appendChild(btn);
    }
  }

  /* ---------- Aplicar modo ---------- */
  function aplicarModo(ativo) {
    if (ativo) {
      document.documentElement.classList.add('modo-pb');
      btn.classList.add('ativo');
      btn.setAttribute('aria-pressed', 'true');
    } else {
      document.documentElement.classList.remove('modo-pb');
      btn.classList.remove('ativo');
      btn.setAttribute('aria-pressed', 'false');
    }
  }

  btn.addEventListener('click', () => {
    const novoEstado = !document.documentElement.classList.contains('modo-pb');
    localStorage.setItem(STORAGE_KEY, novoEstado);
    aplicarModo(novoEstado);
  });

  /* ---------- Init ---------- */
  function init() {
    injetar();
    aplicarModo(localStorage.getItem(STORAGE_KEY) === 'true');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
