/* Small interactive layer; standalone microsite works without a JS framework. */
(() => {
  const toast = (message) => {
    document.querySelector('.armor-toast')?.remove();
    const element = document.createElement('div');
    element.className = 'armor-toast';
    element.setAttribute('role','status');
    element.textContent = message;
    document.querySelector('#root')?.append(element);
    window.setTimeout(() => element.remove(), 1800);
  };
  async function copyText(value) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const input = document.createElement('textarea');
        input.value = value;
        input.setAttribute('readonly', '');
        input.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
        document.body.append(input);
        input.select();
        if (!document.execCommand('copy')) throw new Error('copy failed');
        input.remove();
      }
      toast('已复制到剪贴板');
    } catch {
      toast('复制失败，请手动选择色值');
    }
  }
  document.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-copy]');
    if (button) {
      copyText(button.dataset.copy);
    }
    const anchor = event.target.closest('.armor-mobile-nav nav a');
    if (anchor) {
      const details = anchor.closest('details');
      if (details) details.open = false;
    }
  });
})();
