/* ============================================================
   SANYUKTA CHOWDHURY — Portfolio Interactions
   ============================================================ */

'use strict';

/* ── 1. Navbar: scroll-awareness + mobile toggle ──────────── */
(function initNav() {
  const nav    = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!nav) return;

  // Scroll → glass style
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile hamburger
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      // Animate bars → X
      const bars = toggle.querySelectorAll('span');
      if (open) {
        bars[0].style.cssText = 'transform:translateY(7px) rotate(45deg)';
        bars[1].style.cssText = 'opacity:0';
        bars[2].style.cssText = 'transform:translateY(-7px) rotate(-45deg)';
      } else {
        bars.forEach(b => (b.style.cssText = ''));
      }
    });

    // Close on link click
    links.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.querySelectorAll('span').forEach(b => (b.style.cssText = ''));
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}());

/* ── 2. Smooth scroll for anchor links ───────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}());

/* ── 3. IntersectionObserver scroll-reveal ───────────────── */
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  // Stagger cards in the same grid parent
  const staggerSelectors = ['.awards-grid', '.skills-grid', '.creative-grid', '.timeline'];
  staggerSelectors.forEach(sel => {
    const grid = document.querySelector(sel);
    if (!grid) return;
    grid.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.08}s`;
    });
  });

  items.forEach(el => observer.observe(el));
}());

/* ── 4. Active nav highlighting on scroll ────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav__link:not(.nav__link--cta)');

  const highlight = () => {
    const mid = window.scrollY + window.innerHeight * 0.4;
    let current = '';
    sections.forEach(s => {
      if (mid >= s.offsetTop) current = s.id;
    });
    links.forEach(link => {
      const active = link.getAttribute('href') === `#${current}`;
      link.style.color = active ? 'var(--terracotta)' : '';
    });
  };

  window.addEventListener('scroll', highlight, { passive: true });
  highlight();
}());

/* ── 5. Hero canvas — floating orbs ─────────────────────── */
(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const COLORS = [
    'rgba(196,98,63,',    // terracotta
    'rgba(200,137,58,',   // amber
    'rgba(154,89,105,',   // mauve
    'rgba(223,122,92,',   // coral
  ];

  let orbs = [];
  let W, H;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createOrb(i) {
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      r:  80 + Math.random() * 180,
      vx: (Math.random() - .5) * .35,
      vy: (Math.random() - .5) * .3,
      color: COLORS[i % COLORS.length],
      opacity: .04 + Math.random() * .07,
    };
  }

  function init() {
    resize();
    orbs = Array.from({ length: 9 }, (_, i) => createOrb(i));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    orbs.forEach(o => {
      // Move
      o.x += o.vx;
      o.y += o.vy;
      // Wrap
      if (o.x + o.r < 0)  o.x = W + o.r;
      if (o.x - o.r > W)  o.x = -o.r;
      if (o.y + o.r < 0)  o.y = H + o.r;
      if (o.y - o.r > H)  o.y = -o.r;
      // Draw radial gradient blob
      const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
      g.addColorStop(0,   o.color + o.opacity + ')');
      g.addColorStop(0.5, o.color + (o.opacity * .5) + ')');
      g.addColorStop(1,   o.color + '0)');
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  init();
  draw();
  window.addEventListener('resize', () => { resize(); }, { passive: true });
}());

/* ── 6. Timeline card 3-D tilt (desktop only) ────────────── */
(function initTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cards = document.querySelectorAll('.timeline__card, .award-card, .skill-group, .creative-card');
  const MAX   = 5;

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const dx = (e.clientX - cx) / (r.width  / 2);
      const dy = (e.clientY - cy) / (r.height / 2);
      card.style.transform = `
        translateY(-5px)
        rotateX(${-dy * MAX}deg)
        rotateY(${dx * MAX}deg)
      `;
      card.style.transition = 'transform .1s linear, box-shadow .36s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform .38s cubic-bezier(.4,0,.2,1), box-shadow .38s cubic-bezier(.4,0,.2,1)';
    });
  });

  // Add perspective to grid parents
  ['.awards-grid', '.skills-grid', '.creative-grid', '.timeline'].forEach(sel => {
    const el = document.querySelector(sel);
    if (el) el.style.perspective = '1200px';
  });
}());

/* ── 7. Skill pill — colour ripple on click ──────────────── */
(function initSkillPills() {
  document.querySelectorAll('.skill-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      pill.style.transition = 'none';
      pill.classList.add('skill-pill--active');
      setTimeout(() => {
        pill.style.transition = '';
        pill.classList.remove('skill-pill--active');
      }, 400);
    });
  });
}());

/* ── 8. Subtle cursor glow (desktop) ─────────────────────── */
(function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const glow = document.createElement('div');
  Object.assign(glow.style, {
    position: 'fixed',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    pointerEvents: 'none',
    zIndex: '0',
    background: 'radial-gradient(circle, rgba(196,98,63,.055) 0%, transparent 65%)',
    transform: 'translate(-50%,-50%)',
    mixBlendMode: 'multiply',
    transition: 'opacity .4s',
  });
  document.body.appendChild(glow);

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let gx = mx, gy = my;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function loop() {
    gx += (mx - gx) * .07;
    gy += (my - gy) * .07;
    glow.style.left = gx + 'px';
    glow.style.top  = gy + 'px';
    requestAnimationFrame(loop);
  })();
}());
