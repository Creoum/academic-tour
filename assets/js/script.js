// ========================================
//  IT ACADEMIC TOUR BLOG — SCRIPT.JS
//  Slideshow + Lightbox + Scroll Animations
// ========================================

document.addEventListener('DOMContentLoaded', () => {

  // ══════════════════════════════════════
  //  SLIDESHOW ENGINE
  // ══════════════════════════════════════

  // Master list of ALL images across every slideshow, in order, for lightbox navigation
  const allImages = [];

  document.querySelectorAll('.slideshow').forEach(slideshow => {
    const slides    = Array.from(slideshow.querySelectorAll('.slide'));
    const dotsWrap  = slideshow.querySelector('.slide-dots');
    const prevBtn   = slideshow.querySelector('.slide-prev');
    const nextBtn   = slideshow.querySelector('.slide-next');
    let current     = 0;
    let autoTimer   = null;

    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    const dots = Array.from(dotsWrap.querySelectorAll('.slide-dot'));

    function goTo(index) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }

    function startAuto() {
      stopAuto();
      autoTimer = setInterval(() => goTo(current + 1), 4500);
    }

    function stopAuto() {
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    }

    prevBtn.addEventListener('click', () => { goTo(current - 1); stopAuto(); startAuto(); });
    nextBtn.addEventListener('click', () => { goTo(current + 1); stopAuto(); startAuto(); });

    // Swipe support
    let touchStartX = 0;
    slideshow.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    slideshow.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { diff > 0 ? goTo(current + 1) : goTo(current - 1); stopAuto(); startAuto(); }
    });

    // Register images into allImages for lightbox
    slides.forEach(slide => {
      const img     = slide.querySelector('img');
      const caption = slide.querySelector('.slide-caption');
      const entry   = {
        src:     img ? img.src : '',
        alt:     img ? img.alt : '',
        caption: caption ? caption.textContent.trim() : '',
        // will store lightbox index after all are registered
      };
      allImages.push(entry);

      // Click on image → open lightbox at this image
      if (img) {
        img.addEventListener('click', () => {
          const idx = allImages.findIndex(e => e.src === img.src);
          openLightbox(idx);
        });
      }
    });

    startAuto();
    slideshow.addEventListener('mouseenter', stopAuto);
    slideshow.addEventListener('mouseleave', startAuto);
  });

  // Assign global indices now that all are registered
  allImages.forEach((img, i) => { img.globalIndex = i; });


  // ══════════════════════════════════════
  //  LIGHTBOX ENGINE
  // ══════════════════════════════════════

  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lbImg');
  const lbCaption = document.getElementById('lbCaption');
  const lbCounter = document.getElementById('lbCounter');
  const lbClose   = document.getElementById('lbClose');
  const lbPrev    = document.getElementById('lbPrev');
  const lbNext    = document.getElementById('lbNext');
  const lbBackdrop = document.getElementById('lbBackdrop');

  let currentLbIndex = 0;

  function openLightbox(index) {
    currentLbIndex = index;
    renderLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function renderLightbox() {
    const entry     = allImages[currentLbIndex];
    lbImg.src       = entry.src;
    lbImg.alt       = entry.alt;
    lbCaption.textContent = entry.caption;
    lbCounter.textContent = `${currentLbIndex + 1} / ${allImages.length}`;
  }

  function lbGo(dir) {
    currentLbIndex = (currentLbIndex + dir + allImages.length) % allImages.length;
    // Fade transition
    lbImg.style.opacity = '0';
    setTimeout(() => {
      renderLightbox();
      lbImg.style.opacity = '1';
    }, 160);
  }

  lbImg.style.transition = 'opacity 0.16s ease';

  lbClose.addEventListener('click', closeLightbox);
  lbBackdrop.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', () => lbGo(-1));
  lbNext.addEventListener('click', () => lbGo(1));

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   lbGo(-1);
    if (e.key === 'ArrowRight')  lbGo(1);
  });

  // Touch swipe on lightbox
  let lbTouchX = 0;
  lightbox.addEventListener('touchstart', e => { lbTouchX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    const diff = lbTouchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) lbGo(diff > 0 ? 1 : -1);
  });


  // ══════════════════════════════════════
  //  SCROLL ANIMATIONS
  // ══════════════════════════════════════

  const events = document.querySelectorAll('.event');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = Array.from(entry.target.closest('.day-events')?.querySelectorAll('.event') ?? []);
      const delay    = siblings.indexOf(entry.target) * 120;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  events.forEach(el => observer.observe(el));

  // Day headers fade in
  const dayHeaders = document.querySelectorAll('.day-header, .day-marker');
  const headerObs  = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      entry.target.style.opacity    = '1';
      entry.target.style.transform  = 'translateY(0)';
      headerObs.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  dayHeaders.forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(16px)';
    headerObs.observe(el);
  });

  // Parallax hero
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      heroBg.style.transform = `translateY(${window.scrollY * 0.28}px)`;
    }, { passive: true });
  }

  // Reading progress bar
  const bar = document.createElement('div');
  bar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,#e8820c,#f5a942);z-index:9999;width:0%;transition:width 0.1s linear;pointer-events:none;';
  document.body.appendChild(bar);
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });

  // Logo → back to top
  const logo = document.querySelector('.nav-logo');
  if (logo) logo.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

});
