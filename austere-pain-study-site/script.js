(function () {
  const body = document.body;
  const notesButton = document.querySelector('[data-mode="notes"]');
  const draftButton = document.querySelector('[data-mode="draft"]');
  const menuButton = document.querySelector('[data-menu-button]');
  const currentTitle = document.querySelector('[data-current-title]');
  const tocLinks = Array.from(document.querySelectorAll('.toc-link'));
  const blocks = Array.from(document.querySelectorAll('[data-title]'));

  function setMode(mode) {
    const isDraft = mode === 'draft';
    body.classList.toggle('draft-mode', isDraft);
    body.classList.toggle('notes-mode', !isDraft);
    notesButton.setAttribute('aria-pressed', String(!isDraft));
    draftButton.setAttribute('aria-pressed', String(isDraft));
  }

  notesButton.addEventListener('click', () => setMode('notes'));
  draftButton.addEventListener('click', () => setMode('draft'));

  menuButton.addEventListener('click', () => {
    const open = body.classList.toggle('nav-open');
    menuButton.setAttribute('aria-expanded', String(open));
  });

  tocLinks.forEach((link) => {
    link.addEventListener('click', () => {
      body.classList.remove('nav-open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      body.classList.remove('nav-open');
      menuButton.setAttribute('aria-expanded', 'false');
    }
  });

  function updateActive(target) {
    if (!target) return;
    const id = target.id;
    const title = target.getAttribute('data-title');
    const accent = target.getAttribute('data-accent');

    if (title) currentTitle.textContent = title;
    if (accent) body.style.setProperty('--accent', accent);

    tocLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (visible) updateActive(visible.target);
    },
    {
      rootMargin: '-88px 0px -70% 0px',
      threshold: [0, 0.2, 1]
    }
  );

  blocks.forEach((block) => observer.observe(block));

  const initialId = window.location.hash ? window.location.hash.slice(1) : '';
  const initialBlock = document.getElementById(initialId) || blocks[0];
  updateActive(initialBlock);
  setMode('notes');
})();
