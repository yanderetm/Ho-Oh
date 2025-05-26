const style = document.createElement('style');
style.textContent = `
  bot-logo {
    position: relative;
    display: block !important;
    z-index: 10;
  }

  bot-logo img {
    border-radius: 8px;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease, border-radius 0.2s ease;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: auto;
    z-index: 11;
  }

  bot-logo, bot-logo * {
    overflow: visible !important;
    pointer-events: auto !important;
  }

  .mat-mdc-menu-item.change-icon-button mat-icon {
    margin-right: 12px;
  }
`;
document.head.appendChild(style);

function hslToHex(h, s, l) {
  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const k = (n + h / 30) % 12;
    const col = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * col).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexWithAlpha(hex, alpha) {
  const a = Math.round(alpha * 255).toString(16).padStart(2, '0');
  return `${hex}${a}`;
}

function enhanceLogoElement(logoElement, botName, preventDefaultClick = false) {
  if (!botName) return;

  const hash = [...botName].reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
  const hue = Math.abs(hash) % 360;
  const color = `hsl(${hue}, 70%, 55%)`;
  const bgHex = hslToHex(hue, 0.7, 0.55);
  const glow = hexWithAlpha(bgHex, 0.08);
  const className = `bot-color-${hash}`;

  logoElement.classList.add(className);
  logoElement.dataset.enhancedFor = botName;
  logoElement.style.cursor = 'pointer';
  logoElement.title = 'Click to upload a custom icon for ' + botName;
  logoElement.style.pointerEvents = 'auto';
  logoElement.style.zIndex = '10000';
  logoElement.style.position = 'relative';

  logoElement.onclick = e => {
    if (preventDefaultClick) e.stopImmediatePropagation();
    triggerImageUpload(botName);
  };

  if (!document.querySelector(`style[data-bot-style="${className}"]`)) {
    const dynamicStyle = document.createElement('style');
    dynamicStyle.dataset.botStyle = className;
    dynamicStyle.textContent = `
      bot-logo.${className}:hover img {
        box-shadow: 0 0 0 2px ${color};
        background-color: ${glow};
        border-radius: 50%;
        transform: scale(1.2);
      }
    `;
    document.head.appendChild(dynamicStyle);
  }
}

function enhanceAllBotLogos() {
  document.querySelectorAll('.bot-item').forEach(item => {
    const nameEl = item.querySelector('.bot-name');
    const logoEl = item.querySelector('bot-logo');
    if (nameEl && logoEl) {
      enhanceLogoElement(logoEl, nameEl.textContent.trim(), true);
    }
  });

  const selectedItem = Array.from(document.querySelectorAll('[class*="selected"]')).find(el =>
    el.querySelector?.('.bot-name')
  );

  const selectedName = selectedItem?.querySelector('.bot-name')?.textContent.trim();
  if (!selectedName) {
    setTimeout(enhanceAllBotLogos, 100);
    return;
  }

  const bigLogos = Array.from(document.querySelectorAll('bot-logo')).filter(
    el => !el.closest('.bot-item')
  );

  if (!bigLogos.length) {
    setTimeout(enhanceAllBotLogos, 100);
    return;
  }

  bigLogos.forEach(el => enhanceLogoElement(el, selectedName));
}

(function monitorEnhance() {
  const iconObserver = new MutationObserver(() => {
    enhanceAllBotLogos();
  });

  iconObserver.observe(document.body, { childList: true, subtree: true });
  enhanceAllBotLogos();
})();

(function enhanceBotMenuActions() {
  const menuObserver = new MutationObserver(() => {
    document.querySelectorAll('.mat-mdc-menu-panel.bot-actions-menu:not([data-icon-button-injected])')
      .forEach(menu => {
        const menuId = menu.id;
        if (!menuId) return;

        const anchorButton = document.querySelector(`[aria-controls="${menuId}"]`);
        if (!anchorButton) return;

        const botItem = anchorButton.closest('.bot-item');
        if (!botItem) return;

        const nameSpan = botItem.querySelector('.bot-name');
        if (!nameSpan) return;

        const botName = nameSpan.textContent.trim();

        const button = document.createElement('button');
        button.className = 'mat-mdc-menu-item mat-focus-indicator change-icon-button';
        button.setAttribute('role', 'menuitem');
        button.tabIndex = 0;

        button.innerHTML = `
          <mat-icon class="mat-icon notranslate gds-icon-l google-symbols mat-ligature-font mat-icon-no-color" aria-hidden="true">image</mat-icon>
          <span class="mat-mdc-menu-item-text"><span class="gds-body-m">Change Icon</span></span>
          <div class="mat-ripple mat-mdc-menu-ripple"></div>
        `;

        button.addEventListener('click', () => {
          triggerImageUpload(botName);
        });

        const content = menu.querySelector('.mat-mdc-menu-content');
        if (content) {
          content.appendChild(button);
          menu.dataset.iconButtonInjected = 'true';
        }
      });
  });

  menuObserver.observe(document.body, { childList: true, subtree: true });
})();

function triggerImageUpload(botName) {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.style.display = 'none';

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
      localStorage.setItem(`custom-icon-${botName}`, e.target.result);
      if (typeof applyCustomIcons === 'function') {
        applyCustomIcons();
      }
    };
    reader.readAsDataURL(file);
  });

  document.body.appendChild(fileInput);
  fileInput.click();
  document.body.removeChild(fileInput);
}
