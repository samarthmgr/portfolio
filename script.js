/* ══════════════════════════════════════════════
   THE BATMAN 2022 — PORTFOLIO SCRIPTS
   Rain, grain, reveals, counters, filters
   ══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── RAIN EFFECT ────────────────────────── */
  const canvas = document.getElementById('rainCanvas');
  const ctx    = canvas.getContext('2d');
  let drops    = [];

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function createDrop() {
    return {
      x:     Math.random() * canvas.width,
      y:     Math.random() * -canvas.height,
      len:   Math.random() * 18 + 8,
      speed: Math.random() * 8 + 6,
      opacity: Math.random() * 0.3 + 0.1,
      width:  Math.random() * 1.2 + 0.3,
    };
  }

  // Initialize
  for (let i = 0; i < 180; i++) {
    const d = createDrop();
    d.y = Math.random() * canvas.height;
    drops.push(d);
  }

  function drawRain() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drops.forEach(d => {
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + 0.5, d.y + d.len);
      ctx.strokeStyle = `rgba(180, 200, 220, ${d.opacity})`;
      ctx.lineWidth = d.width;
      ctx.stroke();

      d.y += d.speed;

      if (d.y > canvas.height) {
        Object.assign(d, createDrop());
      }
    });
    requestAnimationFrame(drawRain);
  }
  drawRain();


  /* ── NAV SCROLL STATE ───────────────────── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 80);
  });


  /* ── MOBILE MENU ────────────────────────── */
  const burger     = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });


  /* ── SCROLL REVEAL ──────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children slightly
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ── COUNTER ANIMATION ──────────────────── */
  const counters = document.querySelectorAll('[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.count.includes('+') ? '+' : '+';
        let current  = 0;
        const step   = Math.max(1, Math.floor(target / 60));
        const timer  = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = current + suffix;
        }, 25);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));


  /* ── SKILL BARS ─────────────────────────── */
  const bars = document.querySelectorAll('.skills__bar-fill');

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        fill.style.width = fill.dataset.width + '%';
        barObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(b => barObserver.observe(b));


  /* ── WORK FILTER ────────────────────────── */
  const filterBtns = document.querySelectorAll('.work__filter');
  const cards      = document.querySelectorAll('.work__card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  /* ── SMOOTH NAV LINKS ───────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ── CONTACT FORM (Web3Forms) ───────────── */
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn');
    const originalText = btn.textContent;
    btn.textContent = 'SENDING...';
    btn.disabled = true;

    try {
      const res  = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      });
      const data = await res.json();

      if (data.success) {
        btn.textContent = 'SIGNAL SENT ✓';
        btn.style.background = '#1a8a1a';
        form.reset();
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      btn.textContent = 'FAILED - TRY AGAIN';
      btn.style.background = '#8a1a1a';
    }

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  });


  /* ── CURSOR GLOW (DESKTOP ONLY) ─────────── */
  if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position: fixed;
      width: 250px;
      height: 250px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,0,0,0.06) 0%, transparent 70%);
      pointer-events: none;
      z-index: 9997;
      transform: translate(-50%, -50%);
      transition: opacity 0.3s;
    `;
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
    });

    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });
  }

});
