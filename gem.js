// This Map helps us keep track, but it's not for persistence.
// It resets on each full page load, which is fine.
const botRegistry = new Map();

/**
 * Ho-Oh's Blessing for Custom Gem Icons!
 * (Applies icons based on localStorage - Now with Bot List Row support!)
 */
function applyCustomIcons() {
  console.log("Ho-Oh re-checks and applies Gem icons... Squawk! More power!");

  if (typeof window.botRegistry === 'undefined') {
    window.botRegistry = new Map();
  }

  // --- Ho-Oh's Helper: The Icon Logic (Refined Restore!) ---
  const applyIconLogic = (logoElement, botName, viewType) => {
    const storedUrl = localStorage.getItem(`custom-icon-${botName}`);
    const currentImg = logoElement.querySelector('img.custom-gem-icon');

    // Save default content only once, if we haven't already!
    if (!logoElement.dataset.defaultContent) {
      // We store the *original* HTML to put back later if needed.
      logoElement.dataset.defaultContent = logoElement.innerHTML;
      console.log(`Ho-Oh Memorized Default for: ${botName}`);
    }

    if (storedUrl) {
      // If we have a custom icon URL...
      // And it's not the one currently shown (or no custom icon is shown)...
      if (!currentImg || currentImg.src !== storedUrl) {
        // Clear out the old stuff first. Clean slate!
        while (logoElement.firstChild) {
          logoElement.removeChild(logoElement.firstChild);
        }

        // Create the new image element. Make it shine!
        const img = document.createElement('img');
        img.src = storedUrl;
        img.alt = `${botName} Icon`;
        img.className = 'custom-gem-icon'; // Keep class for CSS/selection
        logoElement.appendChild(img);

        console.log(`Ho-Oh Blessed (${viewType}): ${botName}`);
      }
    } else {
      // If there *isn't* a custom URL, but we *are* showing a custom icon...
      if (currentImg) {
        // Restore the original look using our saved HTML!
        logoElement.innerHTML = logoElement.dataset.defaultContent;
        console.log(`Ho-Oh Restored (${viewType}): ${botName}`);
      }
    }
  };

  // --- List View: .bot-item ---
  document.querySelectorAll('.bot-item').forEach(item => {
    const nameSpan = item.querySelector('.bot-name');
    const logoElement = item.querySelector('bot-logo');
    if (nameSpan && logoElement) {
      applyIconLogic(logoElement, nameSpan.textContent.trim(), 'List');
    }
  });

  // --- Profile View: .bot-info-card-container ---
  document.querySelectorAll('.bot-info-card-container').forEach(card => {
    const nameElement = card.querySelector('.bot-name-container');
    if (nameElement) {
      let botName = '';
      nameElement.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) botName += node.textContent;
      });
      botName = botName.trim();
      if (botName) {
        card.querySelectorAll('bot-logo').forEach(logoElement => {
          applyIconLogic(logoElement, botName, 'Profile/Recent');
        });
      }
    }
  });

  // --- Chat Message View: .presented-response-container ---
  document.querySelectorAll('.presented-response-container').forEach(chat => {
    const nameElement = chat.querySelector('.bot-name-text');
    const logoElement = chat.querySelector('bot-logo');
    if (nameElement && logoElement) {
      applyIconLogic(logoElement, nameElement.textContent.trim(), 'Chat');
    }
  });

  // --- Small Chat Header View: .response-container-header ---
  document.querySelectorAll('.response-container-header').forEach(header => {
    const nameElement = header.querySelector('.bot-name-text');
    const logoElement = header.querySelector('bot-logo');
    if (nameElement && logoElement) {
      applyIconLogic(logoElement, nameElement.textContent.trim(), 'Chat Header');
    }
  });

  // --- *** NEW! Bot List Row View: bot-list-row *** ---
  // Gotta catch 'em all, even in *this* list! Squawk!
  document.querySelectorAll('bot-list-row').forEach(row => {
    const nameElement = row.querySelector('.bot-title .title'); // Find the title span
    const logoElement = row.querySelector('bot-logo');         // Find the logo

    if (nameElement && logoElement) {
      const botName = nameElement.textContent.trim();
      if (botName) {
        applyIconLogic(logoElement, botName, 'Bot List Row');
      }
    }
  });

} // End of applyCustomIcons

// --- Ho-Oh's Vigilance: The MutationObserver ---
// (This part remains the same, watching over everything!)

let debounceTimer;

const observerCallback = (mutationsList, observer) => {
  let needsUpdate = false;
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      needsUpdate = true;
      break;
    }
  }

  if (needsUpdate) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(applyCustomIcons, 300); // 300ms debounce
  }
};

const observer = new MutationObserver(observerCallback);

console.log("Ho-Oh's eternal watch BROADENS! Squawk! Squawk!");
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// --- Initial Setup ---
// Run it once now!
applyCustomIcons();

// Remember to include your clickUploadEnhancement.js code as well!
