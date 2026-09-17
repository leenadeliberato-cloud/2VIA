document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('backdrop');
  const closeMenu = () => { sidebar?.classList.remove('open'); backdrop?.classList.remove('show'); toggle?.setAttribute('aria-expanded', 'false'); };
  toggle?.addEventListener('click', () => { const opening = !sidebar.classList.contains('open'); sidebar.classList.toggle('open', opening); backdrop.classList.toggle('show', opening); toggle.setAttribute('aria-expanded', String(opening)); });
  backdrop?.addEventListener('click', closeMenu);

  const makeQrUrl = (pix, size = 180) =>
    `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(pix)}`;

  document.getElementById('confirmCode')?.addEventListener('click', () => {
    const pix = document.getElementById('pixCode')?.value.trim();
    const qrImage = document.getElementById('adminQrCode');
    const placeholder = document.getElementById('qrPlaceholder');
    const message = document.getElementById('qrPreviewText');
    if (!pix) { alert('Cole o código Pix para gerar o QR Code.'); return; }
    if (qrImage) { qrImage.src = makeQrUrl(pix, 160); qrImage.hidden = false; }
    placeholder?.setAttribute('hidden', '');
    if (message) message.textContent = 'QR Code gerado';
  });

  document.querySelectorAll('[data-copy-target]').forEach((button) => {
    button.addEventListener('click', async () => {
      const input = document.getElementById(button.dataset.copyTarget);
      if (!input) return;
      try { await navigator.clipboard.writeText(input.value); } catch { input.select(); document.execCommand('copy'); }
      const text = button.querySelector('span'); const previous = text?.textContent || button.textContent;
      if (text) text.textContent = 'Copiado!'; else button.textContent = 'Copiado!';
      button.classList.add('copied');
      setTimeout(() => { if (text) text.textContent = previous; else button.textContent = previous; button.classList.remove('copied'); }, 1800);
    });
  });

  document.getElementById('chargeForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const amount = document.getElementById('amount')?.value.trim();
    const pix = document.getElementById('pixCode')?.value.trim();
    const link = document.getElementById('paymentLink');
    if (!amount || !pix) {
      alert('Informe o valor e cole o código Pix antes de gerar o link.');
      return;
    }
    if (link) {
      const checkoutUrl = new URL('checkout.html', window.location.href);
      checkoutUrl.searchParams.set('valor', amount);
      checkoutUrl.searchParams.set('pix', pix);
      link.value = checkoutUrl.href;
    }
    const success = document.getElementById('successArea');
    success.hidden = false; success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // Dados opcionais enviados no link: ?valor=152,40&pix=000201...
  const pixCode = document.getElementById('pixCode');
  const paymentAmount = document.getElementById('paymentAmount');
  const copyButton = document.getElementById('copyButton');
  if (pixCode && paymentAmount) {
    const params = new URLSearchParams(window.location.search);
    const value = params.get('valor');
    const pix = params.get('pix');
    if (value) {
      const normalized = value.replace(/[^0-9,.-]/g, '').replace('.', ',');
      paymentAmount.textContent = normalized.toLowerCase().startsWith('r$') ? normalized : `R$ ${normalized}`;
    }
    if (pix) pixCode.value = pix;
    const qrCode = document.getElementById('pixQrCode');
    if (qrCode) qrCode.src = makeQrUrl(pixCode.value, 180);
  }
  copyButton?.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(pixCode.value); } catch { pixCode.select(); document.execCommand('copy'); }
    const label = copyButton.querySelector('span');
    label.textContent = 'Copiado!';
    copyButton.disabled = true;
    setTimeout(() => { label.textContent = 'Copiar'; copyButton.disabled = false; }, 2000);
  });

  const timer = document.getElementById('timer');
  if (timer) { let seconds = 29 * 60 + 55; setInterval(() => { seconds = Math.max(0, seconds - 1); timer.textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`; }, 1000); }
});
