// Morello 风格配色切换器：t 唤起，hover / ↑↓ 即时预览，Enter / 点击保存，Esc 取消。
(function () {
  const SCHEMES = [
    { id: 'catppuccin-mocha', name: 'catppuccin mocha', mode: 'dark', bg: '#11111b', accent: '#89b4fa', ink: '#cdd6f4' },
    { id: 'tokyo-night', name: 'tokyo night', mode: 'dark', bg: '#1a1b26', accent: '#7aa2f7', ink: '#c0caf5' },
    { id: 'dracula', name: 'dracula', mode: 'dark', bg: '#282a36', accent: '#bd93f9', ink: '#f8f8f2' },
    { id: 'jetbrains-dark', name: 'jetbrains dark', mode: 'dark', bg: '#2b2b2b', accent: '#6897bb', ink: '#a9b7c6' },
    { id: 'nord', name: 'nord', mode: 'dark', bg: '#2e3440', accent: '#88c0d0', ink: '#eceff4' },
    { id: 'gruvbox-dark', name: 'gruvbox dark', mode: 'dark', bg: '#282828', accent: '#d79921', ink: '#fbf1c7' },
    { id: 'one-dark', name: 'one dark', mode: 'dark', bg: '#282c34', accent: '#61afef', ink: '#abb2bf' },
    { id: 'solarized-dark', name: 'solarized dark', mode: 'dark', bg: '#002b36', accent: '#3fa0e8', ink: '#93a1a1' },
    { id: 'kanagawa-wave', name: 'kanagawa wave', mode: 'dark', bg: '#1f1f28', accent: '#7e9cd8', ink: '#dcd7ba' },
    { id: 'rose-pine', name: 'rosé pine', mode: 'dark', bg: '#191724', accent: '#c4a7e7', ink: '#e0def4' },
    { id: 'vesper', name: 'vesper', mode: 'dark', bg: '#101010', accent: '#ffc799', ink: '#ffffff' },
    { id: 'catppuccin-latte', name: 'catppuccin latte', mode: 'light', bg: '#eff1f5', accent: '#145ceb', ink: '#4c4f69' },
    { id: 'gruvbox-light', name: 'gruvbox light', mode: 'light', bg: '#fbf1c7', accent: '#076678', ink: '#282828' },
    { id: 'one-light', name: 'one light', mode: 'light', bg: '#fafafa', accent: '#2c61da', ink: '#383a42' },
    { id: 'solarized-light', name: 'solarized light', mode: 'light', bg: '#fdf6e3', accent: '#006bb0', ink: '#566b72' },
    { id: 'kanagawa-lotus', name: 'kanagawa lotus', mode: 'light', bg: '#f2ecbc', accent: '#456092', ink: '#43436c' },
    { id: 'rose-pine-dawn', name: 'rosé pine dawn', mode: 'light', bg: '#faf4ed', accent: '#76608e', ink: '#575279' },
  ];

  const KEY = 'theme-palette';
  const DEFAULT = 'one-light';
  const root = document.documentElement;
  let overlay = null;
  let activeIndex = 0;
  let committed = readStored();
  let keyboardNavigation = false;

  function readStored() {
    try {
      const value = localStorage.getItem(KEY);
      return SCHEMES.some((s) => s.id === value) ? value : DEFAULT;
    } catch {
      return DEFAULT;
    }
  }

  function current() {
    return root.dataset.scheme || DEFAULT;
  }

  function find(id) {
    return SCHEMES.find((s) => s.id === id) || SCHEMES.find((s) => s.id === DEFAULT);
  }

  function apply(id) {
    const scheme = find(id);
    root.dataset.scheme = scheme.id;
    root.dataset.mode = scheme.mode;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', scheme.bg);
  }

  function save(id) {
    try {
      localStorage.setItem(KEY, id);
    } catch {}
  }

  function updateButtonLabel() {
    const label = find(committed).name;
    document.querySelectorAll('[data-scheme-label]').forEach((el) => {
      el.textContent = label;
    });
  }

  function isTyping(el) {
    if (!el) return false;
    const tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
  }

  function createGroup(mode, list) {
    const group = document.createDocumentFragment();
    const heading = document.createElement('p');
    heading.className = 'scheme-group-label';
    heading.textContent = mode;
    group.append(heading);

    for (const scheme of list) {
      const item = document.createElement('div');
      item.className = 'scheme-item';
      item.dataset.id = scheme.id;
      item.setAttribute('role', 'option');

      const swatch = document.createElement('span');
      swatch.className = 'scheme-swatch';
      swatch.style.setProperty('--swatch-bg', scheme.bg);
      swatch.style.setProperty('--swatch-accent', scheme.accent);
      swatch.style.setProperty('--swatch-border', scheme.ink);

      const name = document.createElement('span');
      name.className = 'scheme-name';
      name.textContent = scheme.name;

      const check = document.createElement('span');
      check.className = 'scheme-check';
      check.textContent = '✓';

      item.append(swatch, name, check);
      item.addEventListener('mouseenter', () => {
        if (keyboardNavigation) return;
        const index = SCHEMES.findIndex((s) => s.id === scheme.id);
        if (index !== activeIndex) setActive(index);
      });
      item.addEventListener('click', () => commit(scheme.id));
      group.append(item);
    }
    return group;
  }

  function open() {
    if (overlay) return;
    committed = readStored();

    overlay = document.createElement('div');
    overlay.className = 'scheme-overlay';

    const dialog = document.createElement('div');
    dialog.className = 'scheme-dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-label', 'Theme');

    const title = document.createElement('div');
    title.className = 'scheme-title';
    title.append(document.createTextNode('Theme'));

    const list = document.createElement('div');
    list.className = 'scheme-list';
    list.setAttribute('role', 'listbox');
    list.append(
      createGroup('dark', SCHEMES.filter((s) => s.mode === 'dark')),
      createGroup('light', SCHEMES.filter((s) => s.mode === 'light')),
    );

    const hint = document.createElement('span');
    hint.className = 'scheme-hint';
    hint.textContent = '↑↓ select · ↵ apply · esc close';
    title.append(hint);

    dialog.append(title, list);
    overlay.append(dialog);
    document.body.append(overlay);

    activeIndex = Math.max(0, SCHEMES.findIndex((s) => s.id === committed));
    render();

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) close(false);
    });
  }

  function setActive(index) {
    activeIndex = (index + SCHEMES.length) % SCHEMES.length;
    apply(SCHEMES[activeIndex].id);
    render();
  }

  function render() {
    if (!overlay) return;
    const items = overlay.querySelectorAll('.scheme-item');
    items.forEach((item) => {
      const isActive = item.dataset.id === SCHEMES[activeIndex].id;
      const isCommitted = item.dataset.id === committed;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-selected', String(isActive));
      const check = item.querySelector('.scheme-check');
      if (check) check.hidden = !isCommitted;
    });
    const active = overlay.querySelector(`[data-id="${SCHEMES[activeIndex].id}"]`);
    active?.scrollIntoView({ block: 'nearest' });
  }

  function commit(id) {
    committed = id;
    apply(id);
    save(id);
    close(true);
  }

  function close(keepPreview) {
    if (!keepPreview) apply(committed);
    overlay?.remove();
    overlay = null;
    keyboardNavigation = false;
    updateButtonLabel();
  }

  document.addEventListener('keydown', (event) => {
    if (!overlay) {
      if (event.key === 't' && !event.ctrlKey && !event.metaKey && !event.altKey && !isTyping(event.target)) {
        event.preventDefault();
        open();
      }
      return;
    }

    keyboardNavigation = true;
    if (event.key === 'Escape') {
      event.preventDefault();
      close(false);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive(activeIndex + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive(activeIndex - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActive(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setActive(SCHEMES.length - 1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      commit(SCHEMES[activeIndex].id);
    }
  });

  document.addEventListener('pointermove', () => {
    keyboardNavigation = false;
  }, { passive: true });

  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-scheme-toggle]')) open();
  });

  // 兼容之前版本存下来的 scheme key；没有则默认 One Light。
  if (!root.dataset.scheme) apply(committed);
  else apply(current());
  updateButtonLabel();
})();
