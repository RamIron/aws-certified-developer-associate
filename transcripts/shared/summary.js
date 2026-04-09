/**
 * summary.js — Shared JS for AWS DVA-C02 section summary pages
 *
 * Usage in each HTML file:
 *   <head>
 *     <link rel="stylesheet" href="../shared/summary.css">
 *     <script src="../shared/summary.js"></script>
 *   </head>
 *   <body>
 *     <script>initHeader("Section 23 — AWS Serverless: API Gateway")</script>
 *     <div class="container">...</div>
 *   </body>
 */

function initHeader(sectionTitle) {
  // Fixed language toggle button
  var btn = document.createElement('button');
  btn.className = 'lang-toggle';
  btn.id = 'lang-btn';
  btn.setAttribute('onclick', 'toggleLang()');
  btn.textContent = '🌐 Español';

  // Hero block
  var hero = document.createElement('div');
  hero.className = 'hero';
  hero.innerHTML =
    '<div class="hero-eyebrow">AWS Certified Developer Associate \u00b7 DVA-C02</div>' +
    '<h1>' + sectionTitle + '</h1>';

  // Prepend both to body (btn first so DOM order = btn, hero, content)
  document.body.prepend(hero);
  document.body.prepend(btn);
}

function toggleLang() {
  var body = document.body;
  var btn = document.getElementById('lang-btn');
  if (body.classList.toggle('es')) {
    btn.textContent = '🌐 English';
  } else {
    btn.textContent = '🌐 Español';
  }
}
