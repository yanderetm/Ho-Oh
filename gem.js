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

  // --- Logic for .bot-item (List View Gems) ---
  const botItems = document.querySelectorAll('.bot-item');
  botItems.forEach(item => {
    const nameSpan = item.querySelector('.bot-name');
    const logoElement = item.querySelector('bot-logo');

    // We removed the "!logoElement.querySelector('img.custom-gem-icon')" check!
    if (nameSpan && logoElement) {
      const botName = nameSpan.textContent.trim();
      const storedUrl = localStorage.getItem(`custom-icon-${botName}`);

      if (storedUrl) {
        // Get the current image source, if any
        const currentImg = logoElement.querySelector('img.custom-gem-icon');
        // Only update if no image exists OR if the source is different
        if (!currentImg || currentImg.src !== storedUrl) {
          logoElement.innerHTML = `<img src="${storedUrl}" alt="${botName} Icon" class="custom-gem-icon" />`;
          // Note: Styles are now handled by your injected CSS in clickUploadEnhancement.js
          console.log(`Updated icon for (List): ${botName}`);
        }
      }
      // Optional: Add logic here to revert to default if storedUrl is null but an img exists.
    }
  });

  // --- Logic for .bot-info-card-container (Gem Profile View) ---
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
        const logoElements = card.querySelectorAll('bot-logo');
        const storedUrl = localStorage.getItem(`custom-icon-${botName}`);

        if (storedUrl) {
          logoElements.forEach(logoElement => {
            // Get the current image source, if any
            const currentImg = logoElement.querySelector('img.custom-gem-icon');
            // Only update if no image exists OR if the source is different
            if (!currentImg || currentImg.src !== storedUrl) {
              logoElement.innerHTML = `<img src="${storedUrl}" alt="${botName} Icon" class="custom-gem-icon" />`;
              // Note: Styles are now handled by your injected CSS in clickUploadEnhancement.js
              console.log(`Updated icon for (Sanctuary/Recent): ${botName}`);
            }
          });
        }
        // Optional: Add logic here to revert to default.
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
