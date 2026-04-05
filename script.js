/* ============================================
   ABDUL SAMAD — PORTFOLIO JAVASCRIPT
   ============================================ */

'use strict';

/* ── Preloader ──────────────────────────────── */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => {
    preloader.classList.add('hidden');
    document.body.style.overflow = '';
    initAnimations();
  }, 1900);
});
document.body.style.overflow = 'hidden';

/* ── Custom Cursor ──────────────────────────── */
const cursorGlow = document.getElementById('cursorGlow');
const cursorDot  = document.getElementById('cursorDot');
let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

function animateCursor() {
  glowX += (mouseX - glowX) * 0.08;
  glowY += (mouseY - glowY) * 0.08;
  cursorGlow.style.left = glowX + 'px';
  cursorGlow.style.top  = glowY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Scale cursor on interactive elements
document.querySelectorAll('a, button, .project-card, .tech-pill').forEach(el => {
  el.addEventListener('mouseenter', () => cursorDot.style.transform = 'translate(-50%,-50%) scale(2.5)');
  el.addEventListener('mouseleave', () => cursorDot.style.transform = 'translate(-50%,-50%) scale(1)');
});

/* ── Theme Toggle ───────────────────────────── */
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const htmlEl      = document.documentElement;

function setTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);
  themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
  localStorage.setItem('theme', theme);
}

themeToggle.addEventListener('click', () => {
  const current = htmlEl.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

// Restore saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

/* ── Navbar Scroll & Active Link ────────────── */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function updateNavbar() {
  const scrollY = window.scrollY;

  // Scrolled style
  navbar.classList.toggle('scrolled', scrollY > 50);

  // Back to top button
  const btt = document.getElementById('backToTop');
  btt.classList.toggle('visible', scrollY > 400);

  // Active link highlighting
  let current = '';
  sections.forEach(sec => {
    if (scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}

window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

/* ── Hamburger Menu ─────────────────────────── */
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

/* ── Particle Canvas ────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function () {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.r  = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '0,212,255' : '168,85,247';
  };
  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  };
  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  };

  for (let i = 0; i < 100; i++) particles.push(new Particle());

  // Draw connection lines between nearby particles
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${0.1 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ── Typed Text Effect ──────────────────────── */
const typedEl   = document.getElementById('typedText');
const typedWords = [
  'Software Engineer',
  'AI/ML Enthusiast',
  'Problem Solver',
  'C++ Developer',
  'Python Developer',
  'DevOps Explorer',
];
let wordIdx = 0, charIdx = 0, isDeleting = false;

function typeWrite() {
  const word = typedWords[wordIdx];
  typedEl.textContent = isDeleting ? word.substring(0, charIdx--) : word.substring(0, charIdx++);

  if (!isDeleting && charIdx > word.length) {
    isDeleting = true;
    setTimeout(typeWrite, 1600);
    return;
  }
  if (isDeleting && charIdx < 0) {
    isDeleting = false;
    wordIdx = (wordIdx + 1) % typedWords.length;
  }
  setTimeout(typeWrite, isDeleting ? 60 : 100);
}
typeWrite();

/* ── Scroll Animations (IntersectionObserver) ─ */
function initAnimations() {
  const animEls = document.querySelectorAll('[data-animate]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  animEls.forEach(el => observer.observe(el));
}

/* ── Animated Skill Bars ────────────────────── */
const skillFills = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      fill.style.width = fill.dataset.width + '%';
      skillObserver.unobserve(fill);
    }
  });
}, { threshold: 0.4 });
skillFills.forEach(f => skillObserver.observe(f));

/* ── Animated Counter ───────────────────────── */
const counters = document.querySelectorAll('.stat-number');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el     = entry.target;
      const target = +el.dataset.target;
      let cur = 0;
      const step = Math.ceil(target / 30);
      const timer = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = cur + (target >= 100 ? '%' : '+');
        if (cur >= target) clearInterval(timer);
      }, 40);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

/* ── Skill Category Filter ──────────────────── */
const catBtns   = document.querySelectorAll('.skill-cat-btn');
const skillGroups = document.querySelectorAll('.skill-group');

catBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    catBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;

    skillGroups.forEach(group => {
      const match = cat === 'all' || group.dataset.cat === cat;
      group.style.opacity    = match ? '1' : '0.25';
      group.style.transform  = match ? 'scale(1)' : 'scale(0.97)';
      group.style.transition = 'opacity .3s, transform .3s';
    });
  });
});

/* ── Back To Top ────────────────────────────── */
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Contact Form ───────────────────────────── */
const contactForm = document.getElementById('contactForm');

function validateField(id, errorId, condition, msg) {
  const err = document.getElementById(errorId);
  if (condition) {
    err.textContent = msg;
    document.getElementById(id).closest('.form-group').style.setProperty('--border-color', '#ef4444');
    return false;
  }
  err.textContent = '';
  return true;
}

contactForm.addEventListener('submit', e => {
  e.preventDefault();

  const name    = document.getElementById('contactName').value.trim();
  const email   = document.getElementById('contactEmail').value.trim();
  const subject = document.getElementById('contactSubject').value.trim();
  const message = document.getElementById('contactMessage').value.trim();

  let valid = true;
  valid &= validateField('formGroupName',    'nameError',    !name,                   'Name is required.');
  valid &= validateField('formGroupEmail',   'emailError',   !email || !/\S+@\S+\.\S+/.test(email), 'Valid email required.');
  valid &= validateField('formGroupSubject', 'subjectError', !subject,                'Subject is required.');
  valid &= validateField('formGroupMessage', 'messageError', !message,                'Message is required.');

  if (!valid) return;

  // Simulate sending
  const btn     = document.getElementById('submitBtn');
  const btnText = document.getElementById('submitText');
  const btnIcon = document.getElementById('submitIcon');

  btn.disabled       = true;
  btnText.textContent = 'Sending...';
  btnIcon.className  = 'fas fa-spinner fa-spin';

  setTimeout(() => {
    btn.disabled       = false;
    btnText.textContent = 'Send Message';
    btnIcon.className  = 'fas fa-paper-plane';
    contactForm.reset();
    const success = document.getElementById('formSuccess');
    success.classList.add('show');
    setTimeout(() => success.classList.remove('show'), 4000);
  }, 1800);
});

/* ── Footer Year ────────────────────────────── */
document.getElementById('footerYear').textContent = new Date().getFullYear();

/* ── Smooth Nav Links ───────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── Project Card Tilt on Mouse Move ────────── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect  = card.getBoundingClientRect();
    const cx    = rect.left + rect.width  / 2;
    const cy    = rect.top  + rect.height / 2;
    const dx    = (e.clientX - cx) / (rect.width  / 2);
    const dy    = (e.clientY - cy) / (rect.height / 2);
    const inner = card.querySelector('.project-card-inner');
    inner.style.transform = `perspective(1000px) rotateY(${dx * 8}deg) rotateX(${-dy * 5}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    const inner = card.querySelector('.project-card-inner');
    inner.style.transform = '';
  });
});

/* Prevent GitHub buttons from triggering the card flip */
document.querySelectorAll('.card-front-btn').forEach(btn => {
  btn.addEventListener('click', e => e.stopPropagation());
});

/* ── Navbar hide on mobile when link clicked ── */
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinksMenu.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

/* ── Parallax on Hero Orbs ───────────────────── */
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  document.querySelectorAll('.hero-orb').forEach((orb, i) => {
    const speed = (i + 1) * 0.08;
    orb.style.transform = `translateY(${scrolled * speed}px)`;
  });
}, { passive: true });

console.log('%c Abdul Samad Portfolio ', 'background:#00d4ff;color:#000;font-size:16px;font-weight:bold;padding:8px 16px;border-radius:4px;');
console.log('%c Built with ❤️ using pure HTML, CSS & JS ', 'color:#a855f7;font-size:12px;');
