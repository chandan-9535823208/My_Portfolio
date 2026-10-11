(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const toast = document.getElementById('toast');

  // Theme switch with a stored preference; defaults to the premium dark theme.
  let savedTheme = 'dark';
  try { savedTheme = localStorage.getItem('chandan-portfolio-theme') || 'dark'; } catch (e) {}
  setTheme(savedTheme);
  function setTheme(theme) {
    root.dataset.theme = theme;
    if (themeIcon) themeIcon.textContent = theme === 'dark' ? '☼' : '☾';
    if (themeToggle) themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute('content', theme === 'dark' ? '#0a0d12' : '#f5f7f8');
  }
  themeToggle?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try { localStorage.setItem('chandan-portfolio-theme', next); } catch (e) {}
  });

  // Collapsible mobile navigation.
  navToggle?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }));

  // Reveal on scroll; show content immediately if the browser lacks support.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('in-view'));
  }

  // Lightweight project category filter.
  const filterButtons = document.querySelectorAll('.filter');
  const cards = document.querySelectorAll('.project-card');
  filterButtons.forEach(button => button.addEventListener('click', () => {
    filterButtons.forEach(item => item.classList.toggle('active', item === button));
    const chosen = button.dataset.filter;
    cards.forEach(card => {
      const show = chosen === 'all' || card.dataset.category === chosen;
      card.classList.toggle('hidden', !show);
    });
  }));

  // Contact form prepares a mailto message; no backend or data storage is required.
  document.getElementById('contactForm')?.addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('senderName').value.trim();
    const email = document.getElementById('senderEmail').value.trim();
    const message = document.getElementById('senderMessage').value.trim();
    if (!name || !email || !message) {
      showToast('Please complete all fields first.');
      return;
    }
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(`Hi Chandan,\n\n${message}\n\nFrom: ${name}\nReply to: ${email}`);
    window.location.href = `mailto:chandan.tech25@gmail.com?subject=${subject}&body=${body}`;
    showToast('Opening your email app…');
  });

  document.getElementById('year').textContent = new Date().getFullYear();
  let toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
  }
})();
