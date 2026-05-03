// ========================================
//  IT ACADEMIC TOUR BLOG — SCRIPT.JS
//  Scroll animations & interactions
// ========================================

document.addEventListener('DOMContentLoaded', () => {

  // ── Intersection Observer: Reveal events on scroll ──
  const events = document.querySelectorAll('.event');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger sibling events within the same day
        const siblings = entry.target.closest('.day-events')?.querySelectorAll('.event') ?? [];
        let delay = 0;
        siblings.forEach((sib, idx) => {
          if (sib === entry.target) delay = idx * 120;
        });

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  events.forEach(el => observer.observe(el));

  // ── Day headers: subtle fade-in ──
  const dayHeaders = document.querySelectorAll('.day-header, .day-marker');
  const headerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        headerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  dayHeaders.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    headerObserver.observe(el);
  });

  // ── Smooth nav scroll highlight (optional future nav) ──
  const days = document.querySelectorAll('.day');

  // ── Parallax-lite on hero bg ──
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
    }, { passive: true });
  }

  // ── Image lazy load error fallback ──
  document.querySelectorAll('.event-img').forEach(img => {
    img.addEventListener('error', () => {
      img.style.background = 'linear-gradient(135deg, #e8d5b7, #c9a87c)';
      img.alt = img.alt || 'Photo coming soon';
    });
  });

  // ── Reading progress bar ──
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #e8820c, #f5a942);
    z-index: 9999;
    width: 0%;
    transition: width 0.1s linear;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / docHeight) * 100;
    progressBar.style.width = Math.min(scrolled, 100) + '%';
  }, { passive: true });

  // ── Back to top on logo click ──
  const logo = document.querySelector('.nav-logo');
  if (logo) {
    logo.style.cursor = 'pointer';
    logo.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});
