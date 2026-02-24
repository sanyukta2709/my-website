/* =============================================
   Sanyukta Chowdhury — Personal Website
   Interactions & Animations
   ============================================= */

/* --- Navbar: scroll-aware --- */
(function initNav() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run on load
}());

/* --- Smooth scroll for anchor links --- */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}());

/* --- Scroll-reveal for sections --- */
(function initReveal() {
  // Elements to reveal
  const targets = [
    // About section
    { selector: '.about__visual',        delay: 0 },
    { selector: '.section__label',       delay: 0.1 },
    { selector: '.section__title',       delay: 0.15 },
    { selector: '.about__para',          delay: 0.2 },
    { selector: '.about__stats',         delay: 0.3 },
    // Hobbies header
    { selector: '.section__header',      delay: 0 },
    // Hobby cards
    { selector: '.hobby-card',           delay: 0 },
  ];

  // Add reveal class to matching elements
  targets.forEach(({ selector, delay }) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      // Stagger cards within the same group
      if (selector === '.hobby-card' || selector === '.about__para') {
        el.style.transitionDelay = `${delay + i * 0.09}s`;
      } else {
        el.style.transitionDelay = `${delay}s`;
      }
    });
  });

  // IntersectionObserver
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}());

/* --- Active nav link on scroll --- */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const highlightNav = () => {
    const scrollMid = window.scrollY + window.innerHeight / 2;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;

      if (scrollMid >= top && scrollMid < bottom) {
        navLinks.forEach(link => {
          link.style.color = '';
          const href = link.getAttribute('href');
          if (href === `#${section.id}`) {
            link.style.color = 'var(--terracotta)';
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();
}());

/* --- Hobby card: subtle parallax tilt on mousemove --- */
(function initCardTilt() {
  const cards = document.querySelectorAll('.hobby-card');
  const MAX_TILT = 6; // degrees

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const rotateX = -dy * MAX_TILT;
      const rotateY =  dx * MAX_TILT;

      card.style.transform = `
        translateY(-8px) scale(1.01)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
      `;
      card.style.transition = 'transform 0.1s linear, box-shadow 0.4s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s cubic-bezier(0.4,0,0.2,1)';
    });
  });

  // Enable perspective on the grid
  const grid = document.querySelector('.hobbies__grid');
  if (grid) {
    grid.style.perspective = '1200px';
  }
}());

/* --- Cursor glow effect (desktop) --- */
(function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip on touch

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 360px;
    height: 360px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    background: radial-gradient(circle, rgba(201,107,74,0.07) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity 0.4s ease;
    mix-blend-mode: multiply;
  `;
  document.body.appendChild(glow);

  let mx = 0, my = 0;
  let gx = 0, gy = 0;
  let raf;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  function animate() {
    gx += (mx - gx) * 0.08;
    gy += (my - gy) * 0.08;
    glow.style.left = `${gx}px`;
    glow.style.top  = `${gy}px`;
    raf = requestAnimationFrame(animate);
  }
  animate();
}());
