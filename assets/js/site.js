(() => {
  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');
  const year = document.querySelector('[data-year]');

  if (year) year.textContent = new Date().getFullYear();

  const setLanguage = (language) => {
    const lang = language === 'tr' ? 'tr' : 'en';
    root.lang = lang;
    document.querySelectorAll('[data-en][data-tr]').forEach((element) => {
      element.textContent = element.dataset[lang];
    });
    document.querySelectorAll('[data-lang]').forEach((button) => {
      const isActive = button.dataset.lang === lang;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
    try { localStorage.setItem('lwg-language', lang); } catch (_) { /* Storage can be unavailable. */ }

    const page = body.dataset.page;
    if (page === 'home') {
      document.title = lang === 'tr'
        ? 'Lucky Wise Games | Resmî Web Sitesi'
        : 'Lucky Wise Games | Official Website';
    } else if (page === 'steelblood') {
      document.title = lang === 'tr'
        ? 'Steelblood: Allied Front | Lucky Wise Games'
        : 'Steelblood: Allied Front | Lucky Wise Games';
    }
  };

  let savedLanguage = 'en';
  try { savedLanguage = localStorage.getItem('lwg-language') || 'en'; } catch (_) { /* Keep English default. */ }
  setLanguage(savedLanguage);
  document.querySelectorAll('[data-lang]').forEach((button) => {
    button.addEventListener('click', () => setLanguage(button.dataset.lang));
  });

  const closeMenu = () => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  };
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    window.addEventListener('resize', () => { if (window.innerWidth > 820) closeMenu(); });
  }

  const setHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
  setHeader();
  window.addEventListener('scroll', setHeader, { passive: true });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((element) => element.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach((element) => revealObserver.observe(element));
  }

  const navLinks = [...document.querySelectorAll('[data-nav-link]')];
  const sections = document.querySelectorAll('[data-section]');
  if (navLinks.length && sections.length && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const current = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!current) return;
      navLinks.forEach((link) => link.classList.toggle('active', link.hash === `#${current.target.id}`));
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0, .15, .4] });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  document.querySelectorAll('[data-video-inline]').forEach((button) => {
    button.addEventListener('click', () => {
      const container = button.closest('[data-inline-container]');
      if (!container) return;
      const title = root.lang === 'tr' ? 'Steelblood duyuru fragmanı' : 'Steelblood announcement trailer';
      container.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(button.dataset.videoInline)}?autoplay=1&rel=0" title="${title}" allow="autoplay; encrypted-media; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
    }, { once: true });
  });
})();
