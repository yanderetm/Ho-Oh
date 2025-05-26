// This Map helps us keep track, but it's not for persistence.
// It resets on each full page load, which is fine.
const botRegistry = new Map();

/**
 * Ho-Oh's Blessing for Custom Gem Icons!
 * (Applies icons based on localStorage)
 */
function applyCustomIcons() {
  console.log("Ho-Oh re-checks for shiny Gems...");

  // If botRegistry was somehow lost, recreate it.
  if (typeof window.botRegistry === 'undefined') {
    window.botRegistry = new Map();
  }

  // --- Logic for .bot-item (List View Gems) ---
  const botItems = document.querySelectorAll('.bot-item');
  botItems.forEach(item => {
    const nameSpan = item.querySelector('.bot-name');
    const logoElement = item.querySelector('bot-logo');

    if (nameSpan && logoElement && !logoElement.querySelector('img.custom-gem-icon')) { // Avoid re-applying if already done
      const botName = nameSpan.textContent.trim();
      const storedUrl = localStorage.getItem(`custom-icon-${botName}`);
      if (storedUrl) {
        logoElement.innerHTML = `<img src="${storedUrl}" alt="${botName} Icon" class="custom-gem-icon" style="width:100%; height:100%; object-fit:contain; border-radius: inherit;" />`;
        console.log(`Applied icon to (List): ${botName}`);
      }
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
            if (!logoElement.querySelector('img.custom-gem-icon')) { // Avoid re-applying
              logoElement.innerHTML = `<img src="${storedUrl}" alt="${botName} Icon" class="custom-gem-icon" style="width:100%; height:100%; object-fit:contain; border-radius: inherit;" />`;
              console.log(`Applied icon to (Sanctuary/Recent): ${botName}`);
            }
          });
        }
      }
    }
  });
}

/**
 * Injects the UI for uploading custom icons.
 */
function injectUploaderUI() {
  // Check if UI already exists to avoid duplicates
  if (document.getElementById('gemIconUploaderPanel')) {
    return;
  }

  const panel = document.createElement('div');
  panel.id = 'gemIconUploaderPanel'; // Give it an ID
  panel.style = `
    position: fixed; bottom: 20px; right: 20px;
    background: #f0f4f9; border: 1px solid #c0c6ce; border-radius: 8px;
    padding: 15px; z-index: 10000; box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    font-family: 'Google Sans', sans-serif; color: #3c4043;
  `;

  panel.innerHTML = `
    <h3 style="margin-top:0; margin-bottom:10px; font-weight: 500;">Gem Icon Uploader</h3>
    <div style="margin-bottom: 10px;">
      <label for="botNameInput" style="display:block; margin-bottom:5px; font-size:14px;">Bot Name:</label>
      <input type="text" id="botNameInput" style="width: 95%; padding: 8px; border: 1px solid #c0c6ce; border-radius: 4px;" />
    </div>
    <div style="margin-bottom: 15px;">
      <label for="botImageInput" style="display:block; margin-bottom:5px; font-size:14px;">Upload Image:</label>
      <input type="file" id="botImageInput" accept="image/*" style="font-size:13px;" />
    </div>
    <button id="uploadBtn" style="padding: 10px 15px; background-color: #1a73e8; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">Apply Icon</button>
  `;

  document.body.appendChild(panel);

  document.getElementById('uploadBtn').addEventListener('click', () => {
    const botNameInput = document.getElementById('botNameInput');
    const fileInput = document.getElementById('botImageInput');
    const botName = botNameInput.value.trim();
    const file = fileInput.files[0];

    if (!botName || !file) {
      alert('Please enter a bot name and select an image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      localStorage.setItem(`custom-icon-${botName}`, e.target.result);
      alert(`Icon for ${botName} saved! It will be applied shortly.`);
      applyCustomIcons(); // Immediately apply
      // Clear inputs for next use
      botNameInput.value = '';
      fileInput.value = '';
    };
    reader.readAsDataURL(file);
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
injectUploaderUI();
applyCustomIcons();
