// This Map helps us keep track, but it's not for persistence.
// It resets on each full page load, which is fine.
const botRegistry = new Map();

/**
 * Ho-Oh's Blessing for Custom Gem Icons!
 * (Applies icons based on localStorage)
 */
function applyCustomIcons() {
  console.log("Ho-Oh re-checks and applies Gem icons... Squawk! More power!");

  if (typeof window.botRegistry === 'undefined') {
    window.botRegistry = new Map();
  }

  // --- Ho-Oh's Helper: The Icon Logic ---
  // Keeps things fly and efficient!
  const applyIconLogic = (logoElement, botName, viewType) => {
    const storedUrl = localStorage.getItem(`custom-icon-${botName}`);
    const currentImg = logoElement.querySelector('img.custom-gem-icon');

    // Save default content only once, gotta remember the roots!
    if (!logoElement.dataset.defaultContent) {
      logoElement.dataset.defaultContent = logoElement.innerHTML;
    }

    if (storedUrl) {
      // If we got a custom ting, and it ain't already there, slap it on!
      if (!currentImg || currentImg.src !== storedUrl) {
        while (logoElement.firstChild) {
          logoElement.removeChild(logoElement.firstChild);
        }

        // Create safe img element
        const img = document.createElement('img');
        img.src = storedUrl;
        img.alt = `${botName} Icon`;
        img.className = 'custom-gem-icon';

        logoElement.appendChild(img);

        console.log(`Ho-Oh Blessed (${viewType}): ${botName}`);
      }
    } else {
      // No custom ting? Back to basics, restore the OG look.
      if (currentImg && logoElement._originalChildren) {
        // Restore original DOM nodes safely
        logoElement.replaceChildren(...logoElement._originalChildren.map(node => node.cloneNode(true)));
        console.log(`Ho-Oh Restored (${viewType}): ${botName}`);
      }
    }
  };


  // --- List View: .bot-item ---
  document.querySelectorAll('.bot-item').forEach(item => {
    const nameSpan = item.querySelector('.bot-name');
    const logoElement = item.querySelector('bot-logo');

    if (nameSpan && logoElement) {
      const botName = nameSpan.textContent.trim();
      applyIconLogic(logoElement, botName, 'List');
    }
  });

  // --- Profile View: .bot-info-card-container ---
  document.querySelectorAll('.bot-info-card-container').forEach(card => {
    const nameElement = card.querySelector('.bot-name-container');
    if (nameElement) {
      let botName = '';
      nameElement.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          botName += node.textContent;
        }
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
      const botName = nameElement.textContent.trim();
      if (botName) {
        applyIconLogic(logoElement, botName, 'Chat');
      }
    }
  });

  // --- NEW! Small Chat Header View: .response-container-header ---
  // Coverin' the small screens too, boom!
  document.querySelectorAll('.response-container-header').forEach(header => {
    const nameElement = header.querySelector('.bot-name-text');
    const logoElement = header.querySelector('bot-logo'); // Still gotta find that logo!

    if (nameElement && logoElement) {
      const botName = nameElement.textContent.trim();
      if (botName) {
        applyIconLogic(logoElement, botName, 'Chat Header');
      }
    }
  });
}

// --- Ho-Oh's Vigilance: The MutationObserver ---

let debounceTimer; // Keepin' it chill.

// This is what we do when we see movement...
const observerCallback = (mutationsList, observer) => {
  let needsUpdate = false;
  for (const mutation of mutationsList) {
    // If new stuff pops up, it's time to check!
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      needsUpdate = true;
      break;
    }
  }

  // If we need an update, wait a sec, then fly into action!
  if (needsUpdate) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(applyCustomIcons, 300);
  }
};

// Create the Vigilant Observer - Ho-Oh's eye in the sky!
const observer = new MutationObserver(observerCallback);

// Tell the Observer to watch *everything*, no sleepin' on the job!
console.log("Ho-Oh's eternal watch CONTINUES! Squawk! Squawk!");
observer.observe(document.body, {
  childList: true, // Watch for new arrivals or departures
  subtree: true    // Watch *everywhere*
});

// --- Initial Setup ---
// Give it one good scan when we start, then the watch begins!
applyCustomIcons();
