
// Light-dismiss Safari fallback per light-dismiss-a-dialog guide
if (!('closedBy' in HTMLDialogElement.prototype)) {
  document.querySelectorAll('dialog[closedby="any"]').forEach((dialog) => {
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const inside =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (!inside) dialog.close();
    });
  });
}

// Accessible form error sync per validate-input-after-interaction guide
(() => {
  const linkError = (el, shown) => {
    const errorId = el.dataset?.error;
    if (!errorId) return;
    const ids = (el.getAttribute('aria-describedby') || '').split(/\s+/).filter((id) => id && id !== errorId);
    if (shown) ids.push(errorId);
    if (ids.length) el.setAttribute('aria-describedby', ids.join(' '));
    else el.removeAttribute('aria-describedby');
  };
  document.querySelectorAll('input[data-error]').forEach((el) => {
    el.setAttribute('aria-invalid', 'false');
    el.addEventListener('blur', () => {
      const bad = !el.validity.valid;
      el.setAttribute('aria-invalid', bad ? 'true' : 'false');
      linkError(el, bad);
    });
    el.addEventListener('input', () => {
      if (el.getAttribute('aria-invalid') === 'true' && el.validity.valid) {
        el.setAttribute('aria-invalid', 'false');
        linkError(el, false);
      }
    });
  });
})();
