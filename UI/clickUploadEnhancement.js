// Inject consistent styling for bot logos
const style = document.createElement('style');
style.textContent = `
  bot-logo img {
    border-radius: 8px;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  bot-logo img:hover {
    transform: scale(1.04);
    box-shadow: 0 0 0 2px #1a73e8;
    background-color: rgba(66, 133, 244, 0.08);
  }

  .mat-mdc-menu-item.change-icon-button mat-icon {
    margin-right: 12px;
  }
`;
document.head.appendChild(style);

// Enhance bot icons with click-to-upload functionality
(function enhanceBotIconUpload() {
  const iconObserver = new MutationObserver(() => {
    const botItems = document.querySelectorAll('.bot-item');

    botItems.forEach(item => {
      const nameSpan = item.querySelector('.bot-name');
      const logoElement = item.querySelector('bot-logo');

      if (nameSpan && logoElement) {
        const botName = nameSpan.textContent.trim();

        if (!logoElement.dataset.uploadEnhanced) {
          logoElement.style.cursor = 'pointer';
          logoElement.title = 'Click to upload a custom icon for ' + botName;
          logoElement.addEventListener('click', () => triggerImageUpload(botName));
          logoElement.dataset.uploadEnhanced = 'true';
        }
      }
    });
  });

  iconObserver.observe(document.body, { childList: true, subtree: true });
})();

// Watch for Gemini menu popups and inject "Change Icon" button
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

// Core upload logic
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
        applyCustomIcons(); // Refresh icons
      }
    };
    reader.readAsDataURL(file);
  });

  document.body.appendChild(fileInput);
  fileInput.click();
  document.body.removeChild(fileInput);
}
