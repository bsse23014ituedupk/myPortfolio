/* ════════════════════════════════════════════════════
   ABDUL SAMAD — PORTFOLIO JAVASCRIPT
   World-Class 3D Interactive Engine
════════════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════════════
   PRELOADER
══════════════════════════════════════════ */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => {
    preloader.classList.add('hidden');
    document.body.style.overflow = '';
    triggerHeroIntro();
    initAnimations();
    initPremiumTilt();
    initRipple();
    initScrollProgress();
    initSkillDots();
    initTextScramble();
    init3DParallax();
  }, 1900);
});
document.body.style.overflow = 'hidden';

/* ══════════════════════════════════════════
   HERO CINEMATIC INTRO TRIGGER
══════════════════════════════════════════ */
function triggerHeroIntro() {
  // Stagger the hero text elements
  document.querySelectorAll('.hero-intro').forEach(el => {
    el.classList.add('hero-visible');
  });
  // Image wrapper
  const imgWrapper = document.querySelector('.hero-img-intro');
  if (imgWrapper) imgWrapper.classList.add('hero-visible');
}

/* ══════════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════════ */
const cursorGlow = document.getElementById('cursorGlow');
const cursorDot  = document.getElementById('cursorDot');
let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

/* Hide cursor dot on click — permanently hidden after first click */
let cursorClicked = false;
document.addEventListener('click', () => {
  if (!cursorClicked) {
    cursorClicked = true;
    cursorDot.classList.add('dot-hidden');
    cursorGlow.style.opacity = '0';
    cursorGlow.style.transition = 'opacity 0.4s ease';
    // Also fully remove from DOM after transition
    setTimeout(() => {
      cursorDot.style.display = 'none';
      cursorGlow.style.display = 'none';
    }, 400);
  }
});

function animateCursor() {
  glowX += (mouseX - glowX) * 0.08;
  glowY += (mouseY - glowY) * 0.08;
  cursorGlow.style.left = glowX + 'px';
  cursorGlow.style.top  = glowY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .project-card, .tech-pill').forEach(el => {
  el.addEventListener('mouseenter', () => cursorDot.style.transform = 'translate(-50%,-50%) scale(2.5)');
  el.addEventListener('mouseleave', () => cursorDot.style.transform = 'translate(-50%,-50%) scale(1)');
});

/* ══════════════════════════════════════════
   THEME TOGGLE
══════════════════════════════════════════ */
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const htmlEl      = document.documentElement;

function setTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);
  themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
  localStorage.setItem('theme', theme);
}
themeToggle.addEventListener('click', () => {
  setTheme(htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});
setTheme(localStorage.getItem('theme') || 'dark');

/* ══════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════ */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function updateNavbar() {
  const scrollY = window.scrollY;
  navbar.classList.toggle('scrolled', scrollY > 50);
  document.getElementById('backToTop').classList.toggle('visible', scrollY > 400);

  // Scroll progress
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  const prog = document.getElementById('scrollProgress');
  if (prog) prog.style.width = (scrollY / docH * 100) + '%';

  // Active link
  let current = '';
  sections.forEach(sec => { if (scrollY >= sec.offsetTop - 120) current = sec.id; });
  navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + current));
}
window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

/* ══════════════════════════════════════════
   HAMBURGER MENU
══════════════════════════════════════════ */
const hamburger    = document.getElementById('hamburger');
const navLinksMenu = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('active');
  navLinksMenu.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
navLinksMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinksMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* ══════════════════════════════════════════
   3D HERO CANVAS — Rotating Wireframe Sphere
   + Constellation Particles
══════════════════════════════════════════ */
(function init3DHeroCanvas() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  // Mouse influence on sphere rotation
  let mx = 0.5, my = 0.5;
  let targetRotX = 0, targetRotY = 0;
  let rotX = 0, rotY = 0;
  let autoRotY = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX / window.innerWidth;
    my = e.clientY / window.innerHeight;
    targetRotY = (mx - 0.5) * Math.PI * 0.6;
    targetRotX = (my - 0.5) * Math.PI * 0.35;
  });

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // ── Build Wireframe Sphere Geometry ──
  const SEG = 10;
  const R   = Math.min(W, H) * 0.22;
  const verts = [];
  const edges = [];

  for (let lat = 0; lat <= SEG; lat++) {
    const theta = (lat / SEG) * Math.PI;
    for (let lon = 0; lon <= SEG; lon++) {
      const phi = (lon / SEG) * 2 * Math.PI;
      verts.push({
        x: R * Math.sin(theta) * Math.cos(phi),
        y: R * Math.cos(theta),
        z: R * Math.sin(theta) * Math.sin(phi),
      });
    }
  }
  for (let lat = 0; lat < SEG; lat++) {
    for (let lon = 0; lon < SEG; lon++) {
      const a = lat * (SEG + 1) + lon;
      const b = a + 1;
      const c = a + (SEG + 1);
      edges.push([a, b], [a, c]);
    }
  }

  // ── Constellation Particles ──
  const NUM_P = 90;
  const particles = Array.from({ length: NUM_P }, () => ({
    x: (Math.random() - 0.5) * W,
    y: (Math.random() - 0.5) * H,
    z: (Math.random() - 0.5) * 600,
    r: Math.random() * 1.4 + 0.2,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    color: Math.random() > 0.5 ? '0,212,255' : '168,85,247',
  }));

  // ── 3D Math ──
  function rotatePoint(x, y, z, rx, ry) {
    // rotate X
    let y1 = y * Math.cos(rx) - z * Math.sin(rx);
    let z1 = y * Math.sin(rx) + z * Math.cos(rx);
    // rotate Y
    let x2 = x * Math.cos(ry) + z1 * Math.sin(ry);
    let z2 = -x * Math.sin(ry) + z1 * Math.cos(ry);
    return { x: x2, y: y1, z: z2 };
  }

  function project(x, y, z, cx, cy, fov = 700) {
    const scale = fov / (fov + z);
    return { px: cx + x * scale, py: cy + y * scale, scale, z };
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);

    // Smooth rotation lerp
    rotX  += (targetRotX - rotX) * 0.04;
    rotY  += (targetRotY - rotY) * 0.04;
    autoRotY += 0.0025;
    const finalRotY = rotY + autoRotY;

    // Center of sphere on right side of hero
    const cx = W * 0.72;
    const cy = H * 0.50;

    // Project all vertices
    const projected = verts.map(v => {
      const r = rotatePoint(v.x, v.y, v.z, rotX, finalRotY);
      return project(r.x, r.y, r.z, cx, cy);
    });

    // Draw edges
    edges.forEach(([a, b]) => {
      const pa = projected[a], pb = projected[b];
      const alpha = Math.max(0, (Math.min(pa.z, pb.z) + R) / (2 * R));
      ctx.beginPath();
      ctx.moveTo(pa.px, pa.py);
      ctx.lineTo(pb.px, pb.py);
      ctx.strokeStyle = `rgba(0,212,255,${alpha * 0.13})`;
      ctx.lineWidth = alpha * 0.6;
      ctx.stroke();
    });

    // Draw vertices
    projected.forEach(p => {
      const alpha = Math.max(0, (p.z + R) / (2 * R));
      if (alpha < 0.05) return;
      ctx.beginPath();
      ctx.arc(p.px, p.py, p.scale * 1.8 * alpha, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,255,${alpha * 0.55})`;
      ctx.fill();
    });

    // Update + draw particles
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (Math.abs(p.x) > W * 0.6) p.vx *= -1;
      if (Math.abs(p.y) > H * 0.6) p.vy *= -1;
      const proj = project(p.x, p.y, p.z, W * 0.5, H * 0.5);
      ctx.beginPath();
      ctx.arc(proj.px, proj.py, p.r * proj.scale, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${0.35 * proj.scale})`;
      ctx.fill();
    });

    // Constellation connections
    for (let i = 0; i < particles.length; i++) {
      const pi = project(particles[i].x, particles[i].y, particles[i].z, W * 0.5, H * 0.5);
      for (let j = i + 1; j < particles.length; j++) {
        const pj = project(particles[j].x, particles[j].y, particles[j].z, W * 0.5, H * 0.5);
        const dx = pi.px - pj.px, dy = pi.py - pj.py;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          ctx.beginPath();
          ctx.moveTo(pi.px, pi.py);
          ctx.lineTo(pj.px, pj.py);
          ctx.strokeStyle = `rgba(168,85,247,${0.18 * (1 - dist / 90)})`;
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(loop);
  }
  loop();
})();

/* ══════════════════════════════════════════
   TYPED TEXT EFFECT
══════════════════════════════════════════ */
const typedEl    = document.getElementById('typedText');
const typedWords = [
  'Software Engineer',
  'AI / ML Builder',
  'Problem Solver',
  'C++ Developer',
  'Python Developer',
  'DevOps Explorer',
];
let wordIdx = 0, charIdx = 0, isDeleting = false;

function typeWrite() {
  const word = typedWords[wordIdx];
  typedEl.textContent = isDeleting ? word.substring(0, charIdx--) : word.substring(0, charIdx++);
  if (!isDeleting && charIdx > word.length) { isDeleting = true; setTimeout(typeWrite, 1600); return; }
  if (isDeleting && charIdx < 0)           { isDeleting = false; wordIdx = (wordIdx + 1) % typedWords.length; }
  setTimeout(typeWrite, isDeleting ? 55 : 95);
}
typeWrite();

/* ══════════════════════════════════════════
   SCROLL ANIMATIONS (IntersectionObserver)
══════════════════════════════════════════ */
function initAnimations() {
  const animEls = document.querySelectorAll('[data-animate]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 70);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  animEls.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════
   ANIMATED SKILL BARS
══════════════════════════════════════════ */
const skillFills   = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      fill.style.width = fill.dataset.width + '%';
      setTimeout(() => fill.classList.add('filled'), 1000);
      skillObserver.unobserve(fill);
    }
  });
}, { threshold: 0.4 });
skillFills.forEach(f => skillObserver.observe(f));

/* ══════════════════════════════════════════
   ANIMATED COUNTER
══════════════════════════════════════════ */
const counters = document.querySelectorAll('.stat-number');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target, target = +el.dataset.target;
      let cur = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const timer = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = cur + (target >= 100 ? '%' : '+');
        if (cur >= target) clearInterval(timer);
      }, 35);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

/* ══════════════════════════════════════════
   SKILL CATEGORY FILTER
══════════════════════════════════════════ */
const catBtns     = document.querySelectorAll('.skill-cat-btn');
const skillGroups = document.querySelectorAll('.skill-group');
catBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    catBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    skillGroups.forEach(group => {
      const match = cat === 'all' || group.dataset.cat === cat;
      group.style.opacity   = match ? '1' : '0.2';
      group.style.transform = match ? 'scale(1)' : 'scale(0.96)';
      group.style.transition = 'opacity .35s, transform .35s';
    });
  });
});

/* ══════════════════════════════════════════
   BACK TO TOP
══════════════════════════════════════════ */
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ══════════════════════════════════════════
   CONTACT FORM
══════════════════════════════════════════ */
const contactForm = document.getElementById('contactForm');
function validateField(id, errorId, condition, msg) {
  const err = document.getElementById(errorId);
  if (condition) { err.textContent = msg; return false; }
  err.textContent = ''; return true;
}
contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const name    = document.getElementById('contactName').value.trim();
  const email   = document.getElementById('contactEmail').value.trim();
  const subject = document.getElementById('contactSubject').value.trim();
  const message = document.getElementById('contactMessage').value.trim();
  let valid = true;
  valid &= validateField('formGroupName',    'nameError',    !name,    'Name is required.');
  valid &= validateField('formGroupEmail',   'emailError',   !email || !/\S+@\S+\.\S+/.test(email), 'Valid email required.');
  valid &= validateField('formGroupSubject', 'subjectError', !subject, 'Subject is required.');
  valid &= validateField('formGroupMessage', 'messageError', !message, 'Message is required.');
  if (!valid) return;
  const btn = document.getElementById('submitBtn');
  const btnText = document.getElementById('submitText');
  const btnIcon = document.getElementById('submitIcon');
  btn.disabled = true; btnText.textContent = 'Sending...'; btnIcon.className = 'fas fa-spinner fa-spin';
  setTimeout(() => {
    btn.disabled = false; btnText.textContent = 'Send Message'; btnIcon.className = 'fas fa-paper-plane';
    contactForm.reset();
    const success = document.getElementById('formSuccess');
    success.classList.add('show');
    setTimeout(() => success.classList.remove('show'), 4000);
  }, 1800);
});

/* ══════════════════════════════════════════
   FOOTER YEAR
══════════════════════════════════════════ */
document.getElementById('footerYear').textContent = new Date().getFullYear();

/* ══════════════════════════════════════════
   SMOOTH NAV LINKS
══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ══════════════════════════════════════════
   PROJECT CARD 3D TILT
══════════════════════════════════════════ */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    const inner = card.querySelector('.project-card-inner');
    if (inner) inner.style.transform = `perspective(1000px) rotateY(${dx * 9}deg) rotateX(${-dy * 6}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    const inner = card.querySelector('.project-card-inner');
    if (inner) inner.style.transform = '';
  });
});

/* Prevent GitHub buttons from triggering card flip */
document.querySelectorAll('.card-front-btn').forEach(btn => {
  btn.addEventListener('click', e => e.stopPropagation());
});

/* ══════════════════════════════════════════
   PREMIUM 3D TILT — All Cards (js-tilt)
══════════════════════════════════════════ */
function initPremiumTilt() {
  const tiltEls = [
    ...document.querySelectorAll('.achievement-card'),
    ...document.querySelectorAll('.stat-card'),
    ...document.querySelectorAll('.skill-group'),
    ...document.querySelectorAll('.timeline-content'),
    ...document.querySelectorAll('.contact-info'),
  ];

  tiltEls.forEach(el => {
    el.classList.add('js-tilt');
    // inject shine div if not present
    if (!el.querySelector('.tilt-shine')) {
      const shine = document.createElement('div');
      shine.className = 'tilt-shine';
      el.style.position = 'relative';
      el.appendChild(shine);
    }

    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top)  / rect.height;
      const dx = (x - 0.5) * 2;
      const dy = (y - 0.5) * 2;

      const shine = el.querySelector('.tilt-shine');
      if (shine) {
        shine.style.setProperty('--mx', `${x * 100}%`);
        shine.style.setProperty('--my', `${y * 100}%`);
      }

      el.style.transform = `perspective(800px) rotateY(${dx * 8}deg) rotateX(${-dy * 5}deg) translateZ(4px)`;
      el.style.transition = 'transform .08s ease';
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'transform .5s cubic-bezier(.2,.8,.2,1)';
    });
  });
}

/* ══════════════════════════════════════════
   RIPPLE CLICK EFFECT
══════════════════════════════════════════ */
function initRipple() {
  document.querySelectorAll('.btn, .card-front-btn, .back-btn').forEach(btn => {
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.addEventListener('click', e => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        width:${size}px;height:${size}px;
        left:${e.clientX - rect.left - size/2}px;
        top:${e.clientY - rect.top - size/2}px;
      `;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

/* ══════════════════════════════════════════
   SCROLL PROGRESS BAR (also in updateNavbar)
══════════════════════════════════════════ */
function initScrollProgress() {
  // Already handled in updateNavbar() — noop here
}

/* ══════════════════════════════════════════
   SKILL FILL DOT (already via CSS + class)
══════════════════════════════════════════ */
function initSkillDots() {
  // Already triggered via skillObserver setTimeout
}

/* ══════════════════════════════════════════
   TEXT SCRAMBLE on Section Titles
══════════════════════════════════════════ */
function initTextScramble() {
  const chars = '!<>-_\\/[]{}—=+*^?#01ABCDEFabcdef';
  function scramble(el) {
    const original = el.dataset.original || el.textContent;
    el.dataset.original = original;
    let frame = 0, frameTarget = 18;
    let output = '';
    const interval = setInterval(() => {
      output = original.split('').map((char, i) => {
        if (char === ' ') return ' ';
        if (i < frame) return original[i];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      el.textContent = output;
      frame++;
      if (frame > frameTarget + original.length) {
        el.textContent = original;
        clearInterval(interval);
      }
    }, 35);
  }

  const titleObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const title = entry.target;
        const gradSpan = title.querySelector('.gradient-text');
        if (gradSpan) scramble(gradSpan);
        else scramble(title);
        titleObserver.unobserve(title);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.section-title').forEach(t => titleObserver.observe(t));
}

/* ══════════════════════════════════════════
   3D MOUSE PARALLAX — Hero Section
══════════════════════════════════════════ */
function init3DParallax() {
  const hero = document.getElementById('hero');
  const heroContent = hero.querySelector('.hero-text');
  const heroImage   = hero.querySelector('.hero-image-wrapper');
  const badges      = hero.querySelectorAll('.float-badge');

  document.addEventListener('mousemove', e => {
    const px = (e.clientX / window.innerWidth  - 0.5);
    const py = (e.clientY / window.innerHeight - 0.5);

    if (heroContent) {
      heroContent.style.transform = `translate(${px * 12}px, ${py * 8}px)`;
      heroContent.style.transition = 'transform .1s ease';
    }
    if (heroImage) {
      heroImage.style.transform = `translate(${-px * 18}px, ${-py * 12}px)`;
      heroImage.style.transition = 'transform .12s ease';
    }
    badges.forEach((badge, i) => {
      const factor = (i + 1) * 6;
      badge.style.transform = `translate(${px * factor}px, ${py * factor}px)`;
      badge.style.transition = 'transform .15s ease';
    });
  });
}

/* ══════════════════════════════════════════
   HERO ORB PARALLAX ON SCROLL
══════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  document.querySelectorAll('.hero-orb').forEach((orb, i) => {
    orb.style.transform = `translateY(${scrolled * (i + 1) * 0.07}px)`;
  });
}, { passive: true });

/* ══════════════════════════════════════════
   MAGNETIC BUTTONS (follow cursor subtly)
══════════════════════════════════════════ */
document.querySelectorAll('.btn--primary, .btn--outline').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top  + rect.height / 2);
    btn.style.transform = `translate(${dx * 0.28}px, ${dy * 0.28}px)`;
    btn.style.transition = 'transform .1s ease';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform .4s cubic-bezier(.2,.8,.2,1)';
  });
});

/* ══════════════════════════════════════════
   NAV HIDE ON MOBILE LINK CLICK
══════════════════════════════════════════ */
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinksMenu.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

/* ══════════════════════════════════════════
   CONSOLE SIGNATURE
══════════════════════════════════════════ */
console.log('%c ⚡ Abdul Samad Portfolio ', 'background:linear-gradient(135deg,#00d4ff,#a855f7);color:#fff;font-size:16px;font-weight:900;padding:10px 20px;border-radius:8px;letter-spacing:2px;');
console.log('%c 🚀 World-Class Portfolio — Built with pure HTML, CSS & JS ', 'color:#a855f7;font-size:12px;font-style:italic;');
