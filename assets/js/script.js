// ========================================
//  IT ACADEMIC TOUR BLOG — SCRIPT.JS
//  Reads from IMAGE_MANIFEST in manifest.js
//  - Per-slideshow lightbox (no cross-mixing)
//  - Fixed side-by-side layout
// ========================================

document.addEventListener('DOMContentLoaded', () => {

  // ══════════════════════════════════════
  //  BUILD SLIDESHOWS FROM MANIFEST
  // ══════════════════════════════════════
  document.querySelectorAll('.slideshow[data-folder]').forEach(slideshow => {
    const folder   = slideshow.dataset.folder;
    const track    = slideshow.querySelector('.slides-track');
    const dotsWrap = slideshow.querySelector('.slide-dots');

    const files = (typeof IMAGE_MANIFEST !== 'undefined' && IMAGE_MANIFEST[folder]) || [];

    if (files.length === 0) {
      track.innerHTML = `
        <div class="slide active slide--empty">
          <div class="slide-loader">
            📂 No photos yet<br>
            <small>Add filenames to <code>manifest.js</code> under <code>"${folder}"</code></small>
          </div>
        </div>`;
      return;
    }

    // Each slideshow keeps its OWN image list — no cross-mixing in lightbox
    const localImages = files.map(filename => ({
      src:     `assets/images/${folder}/${filename}`,
      caption: formatCaption(filename),
    }));

    // Build slides
    track.innerHTML = '';
    localImages.forEach((entry, i) => {
      const slide = document.createElement('div');
      slide.className = 'slide' + (i === 0 ? ' active' : '');
      slide.innerHTML = `
        <img src="${entry.src}" alt="${entry.caption}" loading="lazy" />
        <div class="slide-caption">${entry.caption}</div>`;

      // Click → open lightbox scoped to THIS slideshow only
      slide.querySelector('img').addEventListener('click', () => {
        openLightbox(localImages, i);
      });

      track.appendChild(slide);
    });

    // Build dots
    dotsWrap.innerHTML = '';
    localImages.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dotsWrap.appendChild(dot);
    });

    initSlideshow(slideshow, localImages.length);
  });

  // ── Make filenames human-readable ──
  function formatCaption(filename) {
    return filename
      .replace(/\.[^/.]+$/, '')
      .replace(/^(IMG_|DSC_|PXL_|PHOTO_)/i, '')
      .replace(/[_-]/g, ' ')
      .trim();
  }

  // ══════════════════════════════════════
  //  SLIDESHOW ENGINE
  // ══════════════════════════════════════
  function initSlideshow(slideshow, total) {
    let current   = 0;
    let autoTimer = null;

    const slides = () => Array.from(slideshow.querySelectorAll('.slide'));
    const dots   = () => Array.from(slideshow.querySelectorAll('.slide-dot'));

    function goTo(index) {
      slides()[current]?.classList.remove('active');
      dots()[current]?.classList.remove('active');
      current = (index + total) % total;
      slides()[current]?.classList.add('active');
      dots()[current]?.classList.add('active');
    }

    // Wire up dot clicks now that dots exist
    dots().forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); stopAuto(); startAuto(); }));

    function startAuto() { stopAuto(); autoTimer = setInterval(() => goTo(current + 1), 4500); }
    function stopAuto()  { clearInterval(autoTimer); }

    slideshow.querySelector('.slide-prev').addEventListener('click', () => { goTo(current - 1); stopAuto(); startAuto(); });
    slideshow.querySelector('.slide-next').addEventListener('click', () => { goTo(current + 1); stopAuto(); startAuto(); });

    // Swipe
    let touchX = 0;
    slideshow.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
    slideshow.addEventListener('touchend',   e => {
      const diff = touchX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { diff > 0 ? goTo(current + 1) : goTo(current - 1); stopAuto(); startAuto(); }
    });

    slideshow.addEventListener('mouseenter', stopAuto);
    slideshow.addEventListener('mouseleave', startAuto);
    startAuto();
  }

  // ══════════════════════════════════════
  //  LIGHTBOX — scoped per slideshow
  // ══════════════════════════════════════
  const lightbox   = document.getElementById('lightbox');
  const lbImg      = document.getElementById('lbImg');
  const lbCaption  = document.getElementById('lbCaption');
  const lbCounter  = document.getElementById('lbCounter');
  const lbClose    = document.getElementById('lbClose');
  const lbPrev     = document.getElementById('lbPrev');
  const lbNext     = document.getElementById('lbNext');
  const lbBackdrop = document.getElementById('lbBackdrop');

  // Active scope — changes per click
  let lbImages = [];
  let lbIndex  = 0;

  function openLightbox(images, index) {
    lbImages = images;   // scope to this slideshow's images only
    lbIndex  = index;
    renderLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function renderLightbox() {
    const entry = lbImages[lbIndex];
    if (!entry) return;
    lbImg.style.opacity   = '0';
    lbImg.src             = entry.src;
    lbImg.alt             = entry.caption;
    lbCaption.textContent = entry.caption;
    lbCounter.textContent = `${lbIndex + 1} / ${lbImages.length}`;
    lbImg.onload = () => { lbImg.style.opacity = '1'; };
  }

  lbImg.style.transition = 'opacity 0.18s ease';

  function lbGo(dir) {
    lbIndex = (lbIndex + dir + lbImages.length) % lbImages.length;
    renderLightbox();
  }

  lbClose.addEventListener('click', closeLightbox);
  lbBackdrop.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', () => lbGo(-1));
  lbNext.addEventListener('click', () => lbGo(1));

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  lbGo(-1);
    if (e.key === 'ArrowRight') lbGo(1);
  });

  let lbTouchX = 0;
  lightbox.addEventListener('touchstart', e => { lbTouchX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend',   e => {
    const diff = lbTouchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) lbGo(diff > 0 ? 1 : -1);
  });

  // ══════════════════════════════════════
  //  SCROLL ANIMATIONS
  // ══════════════════════════════════════
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = Array.from(entry.target.closest('.day-events')?.querySelectorAll('.event') ?? []);
      setTimeout(() => entry.target.classList.add('visible'), siblings.indexOf(entry.target) * 120);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.event').forEach(el => observer.observe(el));

  // Day headers fade in
  const headerObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      entry.target.style.opacity    = '1';
      entry.target.style.transform  = 'translateY(0)';
      headerObs.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.day-header, .day-marker').forEach(el => {
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

  const logo = document.querySelector('.nav-logo');
  if (logo) logo.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

});
