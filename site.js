// Dark mode: follow system preference, allow manual override (persisted)
const root = document.documentElement;
const saved = localStorage.getItem('theme');
if (saved) root.dataset.theme = saved;
document.getElementById('theme-toggle').addEventListener('click', () => {
  const systemDark = matchMedia('(prefers-color-scheme: dark)').matches;
  const current = root.dataset.theme || (systemDark ? 'dark' : 'light');
  const next = current === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  localStorage.setItem('theme', next);
});

// Scrollspy: highlight the nav link for the section currently in view
const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const sections = navLinks
  .map((a) => document.getElementById(a.hash.slice(1)))
  .filter(Boolean);

function updateActive() {
  const fromTop = window.scrollY + 100;
  let current = sections[0];
  for (const s of sections) {
    if (s.offsetTop <= fromTop) current = s;
  }
  navLinks.forEach((a) => a.classList.toggle('active', a.hash === '#' + current.id));
}

if (sections.length) {
  updateActive();
  window.addEventListener('scroll', updateActive, { passive: true });
}

// Apple-style scroll reveal: elements fade up as they enter the viewport,
// staggered when several siblings arrive together.
const revealTargets = [
  ...document.querySelectorAll(
    '.page-title, .section-heading, .about-body, .two-col > div, .xp-item, .project-card, .page-lede'
  ),
];
revealTargets.forEach((el) => el.classList.add('reveal'));

const io = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const el = entry.target;
      // Stagger siblings that share a parent and reveal in the same batch
      const batch = entries.filter((e) => e.isIntersecting && e.target.parentElement === el.parentElement);
      const index = batch.findIndex((e) => e.target === el);
      reveal(el, Math.min(index, 4) * 90);
    }
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);

function reveal(el, delay = 0) {
  el.style.transitionDelay = `${delay}ms`;
  el.classList.add('visible');
  io.unobserve(el);
}

revealTargets.forEach((el) => io.observe(el));

// Fail-safe: an entrance animation must never leave content permanently hidden.
// Opening the page at a hash (/#experience), a restored scroll position, or
// find-in-page can all put the viewport past an element before the observer
// ever reports it — leaving it stuck at opacity 0. Sweep anything at or above
// the fold and show it immediately.
function sweepReveals() {
  for (const el of revealTargets) {
    if (el.classList.contains('visible')) continue;
    if (el.getBoundingClientRect().top < window.innerHeight) reveal(el);
  }
}

sweepReveals();
window.addEventListener('load', sweepReveals);
window.addEventListener('hashchange', sweepReveals);

// Sidebar: gentle entrance on load
document.querySelector('.sidebar')?.classList.add('reveal-now');
