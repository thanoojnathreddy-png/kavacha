// KAVACH Content Script - Real-time Link Hover Shield
(function() {
  let tooltip = null;

  function createTooltip() {
    tooltip = document.createElement('div');
    tooltip.id = 'kavach-hover-badge';
    tooltip.style.position = 'fixed';
    tooltip.style.display = 'none';
    tooltip.style.zIndex = '999999';
    tooltip.style.padding = '8px 12px';
    tooltip.style.borderRadius = '6px';
    tooltip.style.fontSize = '12px';
    tooltip.style.fontFamily = 'monospace';
    tooltip.style.color = '#fff';
    tooltip.style.background = '#0a0a0f';
    tooltip.style.border = '1px solid #e11d48';
    tooltip.style.boxShadow = '0 4px 12px rgba(225,29,72,0.3)';
    tooltip.style.pointerEvents = 'none';
    document.body.appendChild(tooltip);
  }

  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('a');
    if (!target || !target.href) return;

    if (!tooltip) createTooltip();

    const href = target.href;
    if (href.startsWith('http://') || href.startsWith('https://')) {
      tooltip.textContent = `🛡️ KAVACH Shield: Analyzing ${new URL(href).hostname}...`;
      tooltip.style.display = 'block';
      tooltip.style.left = `${Math.min(e.clientX + 10, window.innerWidth - 250)}px`;
      tooltip.style.top = `${e.clientY + 15}px`;
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest('a');
    if (target && tooltip) {
      tooltip.style.display = 'none';
    }
  });
})();
