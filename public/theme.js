// 配色方案切换器（t 键唤起，↑↓ 预览，Enter 确认，Esc 取消）
(function () {
  const SCHEMES = [
    { id: 'catppuccin-mocha', name: 'Catppuccin Mocha' },
    { id: 'tokyo-night', name: 'Tokyo Night' },
    { id: 'dracula', name: 'Dracula' },
    { id: 'nord', name: 'Nord' },
    { id: 'gruvbox-dark', name: 'Gruvbox Dark' },
    { id: 'one-dark', name: 'One Dark' },
    { id: 'solarized-dark', name: 'Solarized Dark' },
    { id: 'everforest', name: 'Everforest' },
    { id: 'rose-pine', name: 'Rosé Pine' },
    { id: 'ayu-dark', name: 'Ayu Dark' },
    { id: 'github-dark', name: 'GitHub Dark' },
    { id: 'monokai', name: 'Monokai' },
    { id: 'zenburn', name: 'Zenburn' },
    { id: 'synthwave-84', name: 'Synthwave 84' },
    { id: 'night-owl', name: 'Night Owl' },
    { id: 'horizon', name: 'Horizon' },
  ];

  const KEY = 'scheme';
  const DEFAULT = 'catppuccin-mocha';
  const root = document.documentElement;

  function current() {
    return root.dataset.scheme || DEFAULT;
  }
  function apply(id) {
    root.dataset.scheme = id;
  }
  function save(id) {
    try {
      localStorage.setItem(KEY, id);
    } catch {}
  }
  function schemeName(id) {
    return (SCHEMES.find((s) => s.id === id) || { name: DEFAULT }).name;
  }

  // 恢复保存的配色
  let saved = DEFAULT;
  try {
    saved = localStorage.getItem(KEY) || DEFAULT;
  } catch {}
  if (!root.dataset.scheme) apply(saved);

  let overlay = null;
  let activeIndex = 0;

  function updateButtonLabel() {
    document.querySelectorAll('[data-scheme-label]').forEach((el) => {
      el.textContent = schemeName(current());
    });
  }

  function render() {
    if (!overlay) return;
    const items = overlay.querySelectorAll('.scheme-item');
    items.forEach((it, i) => {
      it.classList.toggle('active', i === activeIndex);
      const label = it.querySelector('.scheme-name');
      if (label) label.textContent = SCHEMES[i].name + (SCHEMES[i].id === saved ? '  ✓' : '');
    });
    items[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }

  function open() {
    if (overlay) return;

    overlay = document.createElement('div');
    overlay.className = 'scheme-overlay';

    const dialog = document.createElement('div');
    dialog.className = 'scheme-dialog';

    const title = document.createElement('div');
    title.className = 'scheme-title';
    title.appendChild(document.createTextNode('Theme '));

    const hint = document.createElement('span');
    hint.className = 'scheme-hint';
    hint.textContent = '↑↓ 选择 · Enter 确定 · Esc 取消';
    title.appendChild(hint);

    const list = document.createElement('div');
    list.className = 'scheme-list';

    for (const s of SCHEMES) {
      const item = document.createElement('div');
      item.className = 'scheme-item';
      item.dataset.id = s.id;
      const name = document.createElement('span');
      name.className = 'scheme-name';
      name.textContent = s.name;
      item.appendChild(name);
      list.appendChild(item);
    }

    dialog.appendChild(title);
    dialog.appendChild(list);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    activeIndex = Math.max(0, SCHEMES.findIndex((s) => s.id === current()));
    render();

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        close();
        return;
      }
      const item = e.target.closest('.scheme-item');
      if (item) {
        activeIndex = SCHEMES.findIndex((s) => s.id === item.dataset.id);
        commit();
      }
    });
  }

  function commit() {
    const s = SCHEMES[activeIndex];
    saved = s.id;
    apply(s.id);
    save(s.id);
    close();
    updateButtonLabel();
  }

  function close() {
    if (overlay) {
      overlay.remove();
      overlay = null;
    }
    apply(saved); // 取消预览，回到已保存配色
    updateButtonLabel();
  }

  function isTyping(el) {
    if (!el) return false;
    const tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
  }

  document.addEventListener('keydown', (e) => {
    if (!overlay) {
      if (e.key.toLowerCase() === 't' && !isTyping(e.target)) {
        e.preventDefault();
        open();
      }
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % SCHEMES.length;
      apply(SCHEMES[activeIndex].id);
      render();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + SCHEMES.length) % SCHEMES.length;
      apply(SCHEMES[activeIndex].id);
      render();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      commit();
    }
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-scheme-toggle]')) open();
  });

  updateButtonLabel();
})();
