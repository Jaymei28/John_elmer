/* ============================================
   VIDEO EDITOR PORTFOLIO — Interactions & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Scroll Reveal (Intersection Observer) ----
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Don't unobserve so re-entry can trigger (optional: unobserve for one-time)
        // revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // ---- Navbar scroll effect ----
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = scrollY;
  }, { passive: true });


  // ---- Mobile nav toggle ----
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });


  // ---- Cursor Glow ----
  const cursorGlow = document.getElementById('cursorGlow');
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorGlow.classList.add('active');
  });

  document.addEventListener('mouseleave', () => {
    cursorGlow.classList.remove('active');
  });

  // Smooth glow follow with lerp
  function animateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;

    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';

    requestAnimationFrame(animateGlow);
  }

  // Only enable cursor glow on desktop
  if (window.matchMedia('(pointer: fine)').matches) {
    animateGlow();
  }


  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        const navHeight = navbar.offsetHeight;
        const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 20;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });


  // ---- Project cards — parallax tilt on hover ----
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });


  // ---- Stat counter animation ----
  const statNumbers = document.querySelectorAll('.stat-number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        const match = text.match(/(\d+)/);
        if (match) {
          const target = parseInt(match[1]);
          const suffix = text.replace(match[1], '');
          animateCounter(el, target, suffix);
        }
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  function animateCounter(el, target, suffix) {
    let current = 0;
    const duration = 2000;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out quart
      const eased = 1 - Math.pow(1 - progress, 4);
      current = Math.round(eased * target);

      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }


  // ---- Hero parallax on scroll ----
  const heroContent = document.querySelector('.hero-content');
  const heroSection = document.querySelector('.hero');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroHeight = heroSection.offsetHeight;

    if (scrollY < heroHeight) {
      const progress = scrollY / heroHeight;
      heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
      heroContent.style.opacity = 1 - progress * 1.2;
    }
  }, { passive: true });


  // ---- Service cards — animated border gradient ----
  const serviceCards = document.querySelectorAll('.service-card');

  serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255, 193, 7, 0.04) 0%, var(--bg-card) 60%)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.background = 'var(--bg-card)';
    });
  });


  // ---- Reel play button interaction ----
  const reelPlayer = document.getElementById('reel-player');

  if (reelPlayer) {
    reelPlayer.addEventListener('click', () => {
      // In a real implementation, this would open a video modal or embed a YouTube/Vimeo player
      reelPlayer.innerHTML = `
        <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--bg-primary);flex-direction:column;gap:12px;">
          <div style="font-family:var(--font-display);font-size:clamp(1.5rem,3vw,2.5rem);text-transform:uppercase;color:var(--kodak-yellow);">SHOWREEL 2024</div>
          <div style="font-size:0.8rem;color:var(--text-muted);letter-spacing:0.15em;text-transform:uppercase;">Video player would load here</div>
          <div style="width:60%;height:4px;background:var(--bg-elevated);border-radius:2px;overflow:hidden;margin-top:12px;">
            <div style="width:35%;height:100%;background:var(--kodak-red);border-radius:2px;animation:loadingBar 3s ease-in-out infinite;"></div>
          </div>
        </div>
      `;

      // Add the loading bar animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes loadingBar {
          0% { width: 0%; }
          50% { width: 65%; }
          100% { width: 100%; }
        }
      `;
      document.head.appendChild(style);
    });
  }


  // ---- Page load: force scroll to top ----
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

});
