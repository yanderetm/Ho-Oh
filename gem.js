const botRegistry = new Map();

function applyCustomIcons() {
  console.log("Searching for Gems to customize...");
  const botItems = document.querySelectorAll('.bot-item');

  botItems.forEach(item => {
    const nameSpan = item.querySelector('.bot-name');
    const logoElement = item.querySelector('bot-logo');

    if (nameSpan && logoElement) {
      const botName = nameSpan.textContent.trim();

      if (!botRegistry.has(botName)) {
        botRegistry.set(botName, logoElement);
        console.log(`Registered bot: ${botName}`);
      }

      // If an image is stored for this bot, apply it
      const storedUrl = localStorage.getItem(`custom-icon-${botName}`);
      if (storedUrl) {
        logoElement.innerHTML = `<img src="${storedUrl}" style="width:100%; height:100%; object-fit:contain;" />`;
      }
    }
  });
}

function injectUploaderUI() {
  const panel = document.createElement('div');
  panel.style = `
    position: fixed; bottom: 20px; right: 20px;
    background: white; border: 2px solid black;
    padding: 10px; z-index: 10000;
    font-family: sans-serif;
  `;

  panel.innerHTML = `
    <label>Bot Name: <input type="text" id="botNameInput" /></label><br>
    <label>Upload Image: <input type="file" id="botImageInput" accept="image/*" /></label><br>
    <button id="uploadBtn">Apply</button>
  `;

  document.body.appendChild(panel);

  document.getElementById('uploadBtn').addEventListener('click', () => {
    const botName = document.getElementById('botNameInput').value.trim();
    const fileInput = document.getElementById('botImageInput');
    const file = fileInput.files[0];
    if (!botName || !file) {
      alert('Please enter a bot name and select an image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      localStorage.setItem(`custom-icon-${botName}`, e.target.result);
      applyCustomIcons(); // Refresh all icons
    };
    reader.readAsDataURL(file); // Convert to base64 URL
  });
}

injectUploaderUI();
