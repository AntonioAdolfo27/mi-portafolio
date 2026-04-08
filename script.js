/*!
 * Antonio Adolfo — Portfolio Script
 * Neo-Brutalist Neon Edition
 */
(function () {
  'use strict';

  /* ══════════════════════════════════
     UTILIDADES
  ══════════════════════════════════ */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

  /* ══════════════════════════════════
     1. PRELOADER
  ══════════════════════════════════ */
  const preloader = $('#preloader');
  const preBar    = $('#preBar');
  const preNum    = $('#preNum');

  let progress = 0;
  const tick = setInterval(() => {
    progress += Math.random() * 20 + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(tick);
      preBar.style.width = '100%';
      preNum.textContent = '100';
      setTimeout(() => {
        preloader.classList.add('out');
        animateHeroCounters();
        checkReveal();
        checkSkills();
      }, 380);
    }
    preBar.style.width = Math.min(progress, 100) + '%';
    preNum.textContent = Math.floor(Math.min(progress, 100));
  }, 80);

  /* ══════════════════════════════════
     2. CURSOR PERSONALIZADO
  ══════════════════════════════════ */
  const trail = $('#curTrail');
  if (trail && window.matchMedia('(hover: hover)').matches) {
    let tx = 0, ty = 0, cx = 0, cy = 0;
    on(document, 'mousemove', e => { tx = e.clientX; ty = e.clientY; trail.style.left = tx + 'px'; trail.style.top = ty + 'px'; });

    (function loopRing() {
      cx += (tx - cx) * 0.13;
      cy += (ty - cy) * 0.13;
      trail.style.left = cx + 'px';
      trail.style.top  = cy + 'px';
      requestAnimationFrame(loopRing);
    })();

    $$('a,button,.srv-card,.work-card,.dip-item,.cert-row').forEach(el => {
      on(el, 'mouseenter', () => trail.classList.add('big'));
      on(el, 'mouseleave', () => trail.classList.remove('big'));
    });
  }

  /* ══════════════════════════════════
     3. HEADER sticky
  ══════════════════════════════════ */
  const header = $('#header');
  on(window, 'scroll', () => header.classList.toggle('stuck', scrollY > 30), { passive: true });

  /* ══════════════════════════════════
     4. MOBILE MENU
  ══════════════════════════════════ */
  const burger   = $('#hBurger');
  const nav      = $('#hNav');
  const navX     = $('#navX');
  const backdrop = $('#navBackdrop');

  function openNav()  { nav.classList.add('open'); backdrop.classList.add('on'); burger.classList.add('x'); document.body.style.overflow = 'hidden'; }
  function closeNav() { nav.classList.remove('open'); backdrop.classList.remove('on'); burger.classList.remove('x'); document.body.style.overflow = ''; }

  on(burger, 'click', openNav);
  on(navX, 'click', closeNav);
  on(backdrop, 'click', closeNav);
  $$('.h-link').forEach(l => on(l, 'click', closeNav));

  /* ══════════════════════════════════
     5. SMOOTH SCROLL
  ══════════════════════════════════ */
  $$('a[href^="#"]').forEach(a => {
    on(a, 'click', e => {
      const t = $(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ══════════════════════════════════
     6. CANVAS PARTÍCULAS HERO
  ══════════════════════════════════ */
  const canvas = $('#pCanvas');
  const ctx    = canvas && canvas.getContext('2d');

  if (canvas && ctx) {
    function sizeCanvas() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    sizeCanvas();
    on(window, 'resize', sizeCanvas);

    const N = window.innerWidth < 700 ? 38 : 72;
    const particles = [];

    class P {
      reset() {
        this.x  = Math.random() * canvas.width;
        this.y  = Math.random() * canvas.height;
        this.r  = Math.random() * 1.5 + 0.3;
        this.vx = (Math.random() - .5) * .4;
        this.vy = (Math.random() - .5) * .4;
        this.ph = Math.random() * Math.PI * 2;
        this.neon = Math.random() > .55;
      }
      constructor() { this.reset(); }
      update() {
        this.x += this.vx; this.y += this.vy; this.ph += .016;
        const ox = this.x, oy = this.y;
        if (ox < -8 || ox > canvas.width + 8 || oy < -8 || oy > canvas.height + 8) this.reset();
      }
      draw() {
        const alpha = (.12 + Math.sin(this.ph) * .18);
        ctx.save();
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.fillStyle = this.neon ? '#b8ff47' : '#e5ff6b';
        ctx.shadowBlur = 7;
        ctx.shadowColor = this.neon ? '#b8ff47' : '#e5ff6b';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < N; i++) particles.push(new P());

    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 90) {
            ctx.save();
            ctx.globalAlpha = (1 - d / 90) * .055;
            ctx.strokeStyle = '#b8ff47';
            ctx.lineWidth = .6;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    }

    (function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawLines();
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(loop);
    })();
  }

  /* ══════════════════════════════════
     7. PARALLAX HERO + FADE
  ══════════════════════════════════ */
  const heroPhotoImg = $('#heroPhotoImg');
  const heroScroll   = $('#heroScroll');
  const heroSection  = $('#hero');

  function heroParallax() {
    if (!heroSection) return;
    const sy = window.scrollY;
    const hh = heroSection.offsetHeight;

    if (heroPhotoImg) {
      heroPhotoImg.style.transform = `scale(1.1) translateY(${sy * 0.38}px)`;
      heroPhotoImg.style.opacity   = Math.max(0, 1 - sy / (hh * 0.55));
    }
    if (heroScroll) heroScroll.classList.toggle('hide', sy > 80);
  }

  on(window, 'scroll', heroParallax, { passive: true });

  /* ══════════════════════════════════
     8. CONTADORES HERO
  ══════════════════════════════════ */
  function animateHeroCounters() {
    $$('.hc-n').forEach(el => {
      const target = parseInt(el.dataset.to) || 0;
      let cur = 0;
      const step = Math.max(1, Math.ceil(target / 25));
      const t = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = cur;
        if (cur >= target) clearInterval(t);
      }, 55);
    });
  }

  /* ══════════════════════════════════
     9. REVEAL ON SCROLL
  ══════════════════════════════════ */
  const revEls = $$('.rv');

  function checkReveal() {
    revEls.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 65) {
        setTimeout(() => el.classList.add('on'), i * 50);
      }
    });
  }

  on(window, 'scroll', checkReveal, { passive: true });

  /* ══════════════════════════════════
     10. SKILL BARS
  ══════════════════════════════════ */
  const skItems = $$('.sk-item');

  function checkSkills() {
    skItems.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight - 60) el.classList.add('on');
    });
  }

  on(window, 'scroll', checkSkills, { passive: true });

  /* ══════════════════════════════════
     11. 3D TILT (service cards, desktop)
  ══════════════════════════════════ */
  if (window.matchMedia('(hover: hover)').matches) {
    $$('.srv-card').forEach(card => {
      on(card, 'mousemove', e => {
        const r  = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -7;
        const ry = ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) *  7;
        card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px)`;
      });
      on(card, 'mouseleave', () => card.style.transform = '');
    });
  }

  /* ══════════════════════════════════
     12. ACTIVE NAV HIGHLIGHT
  ══════════════════════════════════ */
  const secs = $$('section[id]');
  const hLinks = $$('.h-link');

  function activeNav() {
    let cur = '';
    secs.forEach(s => { if (scrollY >= s.offsetTop - 130) cur = s.id; });
    hLinks.forEach(l => {
      const match = l.getAttribute('href') === '#' + cur;
      l.style.color = match ? 'var(--neon)' : '';
    });
  }

  on(window, 'scroll', activeNav, { passive: true });

  /* ══════════════════════════════════
     13. BACK TO TOP — botón flotante
         con anillo de progreso SVG
  ══════════════════════════════════ */
  const btt       = $('#btt');
  const bttCircle = $('#bttCircle');
  const DASH      = 138; // 2 * π * 22

  on(window, 'scroll', () => {
    const sy  = scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? sy / max : 0;

    // mostrar/ocultar
    btt.classList.toggle('show', sy > 380);

    // progreso del anillo
    if (bttCircle) {
      bttCircle.style.strokeDashoffset = DASH - pct * DASH;
    }
  }, { passive: true });

  on(btt, 'click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ══════════════════════════════════
     14. MARQUEE — acelera en hover
  ══════════════════════════════════ */
  const mq = $('.marquee-inner');
  if (mq) {
    on(mq.parentElement, 'mouseenter', () => mq.style.animationDuration = '11s');
    on(mq.parentElement, 'mouseleave', () => mq.style.animationDuration = '22s');
  }

  /* ══════════════════════════════════
     15. EFECTO GLITCH CLICK en logo
  ══════════════════════════════════ */
  const logo = $('.h-logo');
  if (logo) {
    on(logo, 'click', () => {
      logo.style.animation = 'none';
      const g = $('.glitch');
      if (g) {
        g.style.animation = 'none';
        requestAnimationFrame(() => {
          g.style.animation = '';
        });
      }
    });
  }

  /* ══════════════════════════════════
     16. FORMULARIO → GMAIL
  ══════════════════════════════════ */
  const form    = $('#ctForm');
  const formBtn = $('#formBtn');
  const btnTxt  = $('#formBtnTxt');
  const btnIco  = $('#formBtnIco');

  if (form) {
    on(form, 'submit', e => {
      e.preventDefault();
      const nombre  = $('#nombre').value.trim();
      const correo  = $('#correo').value.trim();
      const asunto  = $('#asunto').value.trim();
      const mensaje = $('#mensaje').value.trim();
      if (!nombre || !correo || !asunto || !mensaje) return;

      const to      = 'antonioadolfo0827@gmail.com';
      const subject = `📩 Solicitud desde Portafolio | ${asunto}`;
      const body    = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        NUEVA SOLICITUD DE SERVICIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 DATOS DEL CLIENTE
Nombre : ${nombre}
Email  : ${correo}

📝 ASUNTO
${asunto}

📌 MENSAJE
${mensaje}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Enviado desde el Portafolio de
Antonio Adolfo — Ingeniero en Sistemas
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

      window.open(`https://mail.google.com/mail/?view=cm&to=${to}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');

      // Feedback
      btnTxt.textContent = '¡Enviado! ✓';
      btnIco.className   = 'fas fa-check';
      formBtn.style.background = '#4ade80';

      setTimeout(() => {
        btnTxt.textContent = 'Enviar mensaje';
        btnIco.className   = 'fas fa-paper-plane';
        formBtn.style.background = '';
        form.reset();
      }, 3200);
    });
  }

  /* ══════════════════════════════════
     17. FOOTER AÑO
  ══════════════════════════════════ */
  const yr = $('#yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ══════════════════════════════════
     18. EASTER EGG — KONAMI CODE
         ↑↑↓↓←→←→BA  → confetti neon
  ══════════════════════════════════ */
  const KONAMI = [38,38,40,40,37,39,37,39,66,65];
  let kIdx = 0;
  on(document, 'keydown', e => {
    kIdx = (e.keyCode === KONAMI[kIdx]) ? kIdx + 1 : 0;
    if (kIdx === KONAMI.length) {
      kIdx = 0;
      launchConfetti();
    }
  });

  function launchConfetti() {
    const colors = ['#b8ff47','#e5ff6b','#ffffff','#ff4444','#44aaff'];
    for (let i = 0; i < 80; i++) {
      const el = document.createElement('div');
      const size = Math.random() * 8 + 4;
      el.style.cssText = `
        position:fixed; z-index:99999; pointer-events:none;
        width:${size}px; height:${size}px; border-radius:${Math.random()>.5?'50%':'2px'};
        background:${colors[Math.floor(Math.random()*colors.length)]};
        left:${Math.random()*100}vw; top:-10px;
        animation: confettiFall ${Math.random()*2+1.5}s ease-in forwards;
        animation-delay:${Math.random()*0.5}s;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 4000);
    }

    // Inyectar keyframe si no existe
    if (!document.getElementById('confettiStyle')) {
      const s = document.createElement('style');
      s.id = 'confettiStyle';
      s.textContent = `@keyframes confettiFall {
        0%   { transform:translateY(0) rotate(0deg) scaleX(1); opacity:1; }
        80%  { opacity:1; }
        100% { transform:translateY(100vh) rotate(720deg) scaleX(.3); opacity:0; }
      }`;
      document.head.appendChild(s);
    }
  }

})();
