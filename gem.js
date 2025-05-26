// This Map helps us keep track, but it's not for persistence.
// It resets on each full page load, which is fine.
const botRegistry = new Map();

/**
 * Ho-Oh's Blessing for Custom Gem Icons!
 * (Applies icons based on localStorage)
 */
function applyCustomIcons() {
  console.log("Ho-Oh re-checks and applies Gem icons...");

  if (typeof window.botRegistry === 'undefined') {
    window.botRegistry = new Map();
  }

  // --- List View: .bot-item ---
  const botItems = document.querySelectorAll('.bot-item');
  botItems.forEach(item => {
    const nameSpan = item.querySelector('.bot-name');
    const logoElement = item.querySelector('bot-logo');

    if (nameSpan && logoElement) {
      const botName = nameSpan.textContent.trim();
      const storedUrl = localStorage.getItem(`custom-icon-${botName}`);
      const currentImg = logoElement.querySelector('img.custom-gem-icon');

      // Save default content only once
      if (!logoElement.dataset.defaultContent) {
        logoElement.dataset.defaultContent = logoElement.innerHTML;
      }

      if (storedUrl) {
        if (!currentImg || currentImg.src !== storedUrl) {
          logoElement.innerHTML = `<img src="${storedUrl}" alt="${botName} Icon" class="custom-gem-icon" />`;
          console.log(`Updated icon for (List): ${botName}`);
        }
      } else {
        if (currentImg) {
          logoElement.innerHTML = logoElement.dataset.defaultContent || '';
          console.log(`Restored default icon for (List): ${botName}`);
        }
      }
    }
  });

  // --- Profile View: .bot-info-card-container ---
  const botInfoCards = document.querySelectorAll('.bot-info-card-container');
  botInfoCards.forEach(card => {
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
        const storedUrl = localStorage.getItem(`custom-icon-${botName}`);
        const logoElements = card.querySelectorAll('bot-logo');

        logoElements.forEach(logoElement => {
          const currentImg = logoElement.querySelector('img.custom-gem-icon');

          if (!logoElement.dataset.defaultContent) {
            logoElement.dataset.defaultContent = logoElement.innerHTML;
          }

          if (storedUrl) {
            if (!currentImg || currentImg.src !== storedUrl) {
              logoElement.innerHTML = `<img src="${storedUrl}" alt="${botName} Icon" class="custom-gem-icon" />`;
              console.log(`Updated icon for (Sanctuary/Recent): ${botName}`);
            }
          } else {
            if (currentImg) {
              logoElement.innerHTML = logoElement.dataset.defaultContent || '';
              console.log(`Restored default icon for (Sanctuary/Recent): ${botName}`);
            }
          }
        });
      }
    }
  });
}

// --- Ho-Oh's Vigilance: The MutationObserver ---

let debounceTimer; // This prevents the function from running *too* many times

// This is the function that runs when changes are detected
const observerCallback = (mutationsList, observer) => {
  let needsUpdate = false;
  for (const mutation of mutationsList) {
    // We're interested if new elements were added or attributes changed
    // which might signal new/changed bot logos.
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      needsUpdate = true;
      break;
    }
    // You could potentially watch for attribute changes too if needed.
  }

  // If a change happened, wait a moment (debounce) then run our function.
  if (needsUpdate) {
    // Clear any previous timer to ensure we only run *after* changes stop.
    clearTimeout(debounceTimer);
    // Set a new timer. 300ms is usually enough time for things to settle.
    debounceTimer = setTimeout(applyCustomIcons, 300);
  }
};

// Create the Vigilant Observer
const observer = new MutationObserver(observerCallback);

// Tell the Observer to watch the *entire* body of the page for
// additions/removals of elements, and do so for all descendants.
console.log("Ho-Oh begins its eternal watch! Squawk!");
observer.observe(document.body, {
  childList: true, // Watch for nodes being added or removed
  subtree: true    // Watch all descendants, not just direct children
});

// --- Initial Setup ---
// Run the UI injector and apply icons *once* when the script loads.
// The observer will handle all future updates.
applyCustomIcons();
