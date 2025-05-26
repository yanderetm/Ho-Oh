// devtools/panel.js

function createDevPanel() {
  const panel = document.createElement('div');
  panel.id = 'hooh-dev-panel';
  panel.innerHTML = `
    <button id="hooh-clear-btn">Clear All Images</button>
  `;
  document.body.appendChild(panel);

  // Simple handler
  document.getElementById('hooh-clear-btn').addEventListener('click', () => {
    localStorage.clear();
    console.log("Ho-Oh: All custom icons cleared!");
    window.botRegistry?.clear?.();
    applyCustomIcons?.();
    window.location.reload();
  });
}

console.log("dev_mode " + window.HO_OH_DEV_MODE + " " + typeof window.HO_OH_DEV_MODE);

(function waitForEnvAndDOM() {
  function init() {
    if (window.HO_OH_DEV_MODE === true) {
      console.log("HO_OH_DEV_MODE active — showing Dev Panel");
      createDevPanel();
    } else {
      console.log("Dev mode is off or not defined");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
