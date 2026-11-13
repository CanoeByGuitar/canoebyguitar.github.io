// Desktop article table of contents: click the heading to collapse or expand.
(function () {
  const panel = document.querySelector('.right-sidebar-panel');
  const heading = panel?.querySelector('starlight-toc nav > h2');
  if (!panel || !heading) return;

  heading.setAttribute('role', 'button');
  heading.setAttribute('tabindex', '0');
  heading.setAttribute('aria-expanded', 'true');

  function toggle() {
    const collapsed = panel.classList.toggle('is-collapsed');
    heading.setAttribute('aria-expanded', String(!collapsed));
  }

  heading.addEventListener('click', toggle);
  heading.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle();
    }
  });
})();
