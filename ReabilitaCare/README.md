# ReabilitaCare 🏥

Site institucional da clínica ReabilitaCare — plataforma de agendamentos e área do paciente.

## Tecnologias

- HTML5 + CSS3
- JavaScript (Vanilla)
- Bootstrap Icons
- Google Fonts (Playfair Display + Nunito)

## Estrutura

```
ReabilitaCare/
├── pages/           # Todas as páginas HTML
├── assets/
│   ├── styles/      # Arquivos CSS por página + nav-mobile.css
│   ├── scripts/     # Scripts JS
│   └── images/      # Imagens e ícones
├── index.html       # Redirect raiz → pages/index.html
└── vercel.json      # Configuração de rotas para Vercel
```

## Como rodar localmente

Abra qualquer arquivo `.html` da pasta `pages/` diretamente no navegador, ou use o Live Server do VS Code.

## Deploy (Vercel)

1. Suba o projeto para o GitHub
2. Acesse [vercel.com](https://vercel.com) → **Add New Project**
3. Conecte o repositório
4. Em **Framework Preset**, selecione **Other**
5. Clique em **Deploy** — pronto!

## Deploy (GitHub Pages)

1. Vá em **Settings → Pages** no repositório
2. Source: `main` branch, pasta `/ (root)`
3. O site ficará disponível em `https://seuusuario.github.io/ReabilitaCare`

## Subir para o GitHub (passo a passo)

```bash
git init
git add .
git commit -m "feat: projeto ReabilitaCare"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/ReabilitaCare.git
git push -u origin main
```
