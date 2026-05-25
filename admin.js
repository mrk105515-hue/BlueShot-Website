// ==========================================================================
// DXZ WIKI INLINE VISUAL EDITOR (ADMIN MODE)
// Activates on URL ?admin=true or pressing Ctrl + Shift + E
// ==========================================================================

(function() {
  // Check if editor should run
  const isAdminParam = window.location.search.includes("admin=true");
  
  if (isAdminParam) {
    initVisualEditor();
  }

  // Keyboard shortcut to trigger: Ctrl + Shift + E
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.code === "KeyE") {
      e.preventDefault();
      if (document.getElementById("dxz-admin-panel")) {
        exitVisualEditor();
      } else {
        initVisualEditor();
      }
    }
  });

  // Track selected colors (default fallbacks)
  let selectedPrimary = "#00e5ff";
  let selectedSecondary = "#ff124f";

  function initVisualEditor() {
    if (document.getElementById("dxz-admin-panel")) return;

    // Failsafe: Try to read current colors from the CSS styles
    try {
      const rootStyle = getComputedStyle(document.documentElement);
      const primaryColorVal = rootStyle.getPropertyValue('--color-blue-neon');
      const secondaryColorVal = rootStyle.getPropertyValue('--color-redago');
      if (primaryColorVal) selectedPrimary = rgbToHex(primaryColorVal.trim()) || "#00e5ff";
      if (secondaryColorVal) selectedSecondary = rgbToHex(secondaryColorVal.trim()) || "#ff124f";
    } catch (e) {
      console.warn("Wiki Editor: Could not fetch styles from documentElement, using default colors.", e);
    }

    // 1. Inject Editor Styles
    const styleEl = document.createElement("style");
    styleEl.id = "dxz-admin-editor-styles";
    styleEl.innerHTML = `
      [contenteditable="true"] {
        outline: 1px dashed rgba(0, 229, 255, 0.4) !important;
        cursor: text !important;
        transition: outline 0.2s ease, background-color 0.2s ease;
        pointer-events: auto !important; /* Override hardening pointer-events: none */
      }
      [contenteditable="true"]:hover {
        outline: 1px dashed rgba(0, 229, 255, 0.8) !important;
        background: rgba(0, 229, 255, 0.03) !important;
      }
      [contenteditable="true"]:focus {
        outline: 2px solid var(--color-blue-neon) !important;
        background: rgba(0, 229, 255, 0.08) !important;
      }
      img.dxz-editable-img {
        outline: 2px dashed rgba(255, 18, 79, 0.4) !important;
        cursor: pointer !important;
        pointer-events: auto !important;
      }
      img.dxz-editable-img:hover {
        outline: 2px solid var(--color-redago) !important;
        opacity: 0.85;
      }
    `;
    document.head.appendChild(styleEl);

    // 2. Make text elements editable
    const textSelectors = [
      "h1", "h2", "h3", "h4", "h5", "h6", 
      "p", "span.stat-number", "span.stat-label", 
      "span.section-subtitle", "span.character-card-faction", 
      "span.character-card-power", "a.btn", "button.btn",
      ".timeline-step", ".timeline-title", ".timeline-desc",
      ".promo-card h3", ".promo-card p", ".footer-top a",
      ".nav-link a", ".nav-logo", ".footer-logo"
    ];

    document.querySelectorAll(textSelectors.join(", ")).forEach(el => {
      if (el.classList.contains("logo-dot") || el.querySelector("i")) return;
      el.setAttribute("contenteditable", "true");
      
      // Stop propagation so clicking text inside a card doesn't bubble up to open the modal
      const stopBubble = (e) => e.stopPropagation();
      el.addEventListener("click", stopBubble);
      el._stopBubble = stopBubble;
    });

    // 3. Make images editable via double-click
    document.querySelectorAll("img").forEach(img => {
      img.classList.add("dxz-editable-img");
      img.title = "Double-click to change image source url";
      
      const changeImageHandler = (e) => {
        e.stopPropagation();
        const currentSrc = img.getAttribute("src");
        const newSrc = prompt("Change image source URL or path (e.g. assets/new-image.png):", currentSrc);
        if (newSrc !== null && newSrc.trim() !== "") {
          img.setAttribute("src", newSrc.trim());
        }
      };
      
      img.addEventListener("dblclick", changeImageHandler);
      img._changeImageHandler = changeImageHandler;
    });

    // 4. Disable card click modals and navigation in capture phase
    const preventCardClick = (e) => {
      // If we clicked on editable text, allow normal text cursor click, but stop card modal
      if (e.target.hasAttribute("contenteditable") || e.target.tagName === "IMG") {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
    };

    document.querySelectorAll(".character-card, .media-card, .video-container").forEach(card => {
      card.addEventListener("click", preventCardClick, true); // Capture phase (intercepts script.js)
      card._preventCardClick = preventCardClick;
    });

    // 5. Disable standard navigation link clicks
    const preventLinkClick = (e) => {
      e.preventDefault();
    };
    document.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", preventLinkClick);
      a._preventLinkClick = preventLinkClick;
    });

    // 6. Inject Admin Control Panel
    const panelHTML = `
      <div id="dxz-admin-panel" style="position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(8, 8, 12, 0.94); border: 1px solid var(--color-blue-neon); border-radius: 12px; padding: 12px 24px; z-index: 100000; display: flex; align-items: center; gap: 20px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 229, 255, 0.15); backdrop-filter: blur(15px); font-family: sans-serif; color: white; animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
        <style>
          @keyframes slideUp {
            from { transform: translate(-50%, 50px); opacity: 0; }
            to { transform: translate(-50%, 0); opacity: 1; }
          }
        </style>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="width: 10px; height: 10px; background: var(--color-blue-neon); border-radius: 50%; box-shadow: 0 0 8px var(--color-blue-neon); display: inline-block;"></span>
          <span style="font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 0.85rem; letter-spacing: 0.05em; text-transform: uppercase; white-space: nowrap;">Wiki Editor</span>
        </div>
        
        <div style="height: 20px; width: 1px; background: rgba(255, 255, 255, 0.15);"></div>
        
        <!-- Theme Color Picker Panel -->
        <div style="display: flex; align-items: center; gap: 12px; font-size: 0.85rem;">
          <div style="display: flex; align-items: center; gap: 5px;">
            <label for="theme-color-primary" style="color: #8E9297;">Cyan/Blue:</label>
            <input type="color" id="theme-color-primary" value="${selectedPrimary}" style="width: 25px; height: 25px; border: none; background: none; cursor: pointer; border-radius: 4px;">
          </div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <label for="theme-color-secondary" style="color: #8E9297;">Redago:</label>
            <input type="color" id="theme-color-secondary" value="${selectedSecondary}" style="width: 25px; height: 25px; border: none; background: none; cursor: pointer; border-radius: 4px;">
          </div>
        </div>

        <div style="height: 20px; width: 1px; background: rgba(255, 255, 255, 0.15);"></div>
        
        <button id="dxz-admin-save" style="background: linear-gradient(135deg, var(--color-blue-electric), #00A6FF); border: none; color: white; padding: 8px 16px; border-radius: 6px; font-weight: 700; cursor: pointer; font-size: 0.85rem; transition: transform 0.2s; font-family: 'Outfit', sans-serif; text-transform: uppercase; letter-spacing: 0.02em; white-space: nowrap;">💾 Save &amp; Download HTML</button>
        <button id="dxz-admin-exit" style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255,255,255,0.15); color: white; padding: 8px 16px; border-radius: 6px; font-weight: 700; cursor: pointer; font-size: 0.85rem; transition: background 0.2s; font-family: 'Outfit', sans-serif; text-transform: uppercase; letter-spacing: 0.02em;">Exit</button>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", panelHTML);

    // Bind color picker inputs
    const primaryInput = document.getElementById("theme-color-primary");
    const secondaryInput = document.getElementById("theme-color-secondary");

    primaryInput.addEventListener("input", (e) => {
      selectedPrimary = e.target.value;
      document.documentElement.style.setProperty('--color-blue-neon', selectedPrimary);
    });

    secondaryInput.addEventListener("input", (e) => {
      selectedSecondary = e.target.value;
      document.documentElement.style.setProperty('--color-redago', selectedSecondary);
    });

    // Bind panel buttons
    document.getElementById("dxz-admin-save").addEventListener("click", exportCleanHTML);
    document.getElementById("dxz-admin-exit").addEventListener("click", exitVisualEditor);

    if (window.showNotification) {
      window.showNotification("Visual Editor enabled! Click text to edit and change colors below.");
    }
  }

  function exitVisualEditor() {
    const panel = document.getElementById("dxz-admin-panel");
    const styles = document.getElementById("dxz-admin-editor-styles");
    if (panel) panel.remove();
    if (styles) styles.remove();

    // Remove editable states
    document.querySelectorAll("[contenteditable]").forEach(el => {
      el.removeAttribute("contenteditable");
      if (el._stopBubble) {
        el.removeEventListener("click", el._stopBubble);
        delete el._stopBubble;
      }
    });

    // Restore cards
    document.querySelectorAll(".character-card, .media-card, .video-container").forEach(card => {
      if (card._preventCardClick) {
        card.removeEventListener("click", card._preventCardClick, true);
        delete card._preventCardClick;
      }
    });

    // Restore links
    document.querySelectorAll("a").forEach(a => {
      if (a._preventLinkClick) {
        a.removeEventListener("click", a._preventLinkClick);
        delete a._preventLinkClick;
      }
    });

    // Restore images
    document.querySelectorAll("img").forEach(img => {
      img.classList.remove("dxz-editable-img");
      img.removeAttribute("title");
      if (img._changeImageHandler) {
        img.removeEventListener("dblclick", img._changeImageHandler);
        delete img._changeImageHandler;
      }
    });

    if (window.showNotification) {
      window.showNotification("Visual Editor disabled.", true);
    }
  }

  function exportCleanHTML() {
    // 1. Clone the current document root
    const clone = document.documentElement.cloneNode(true);

    // 2. Remove injected editor UI components in the clone
    const panel = clone.querySelector("#dxz-admin-panel");
    const styles = clone.querySelector("#dxz-admin-editor-styles");
    if (panel) panel.remove();
    if (styles) styles.remove();

    // 3. Remove contenteditable attributes
    clone.querySelectorAll("[contenteditable]").forEach(el => {
      el.removeAttribute("contenteditable");
    });

    // 4. Remove image hover tags and classes
    clone.querySelectorAll("img").forEach(img => {
      img.classList.remove("dxz-editable-img");
      img.removeAttribute("title");
    });

    // 5. Clean search overlay active classes
    const activeSearchOverlay = clone.querySelector(".global-search-overlay");
    if (activeSearchOverlay) activeSearchOverlay.classList.remove("active");

    // 6. Inject the custom selected theme colors into a style tag inside head
    let customThemeStyle = clone.querySelector("#dxz-custom-theme");
    if (!customThemeStyle) {
      customThemeStyle = document.createElement("style");
      customThemeStyle.id = "dxz-custom-theme";
      clone.querySelector("head").appendChild(customThemeStyle);
    }
    customThemeStyle.innerHTML = `
      :root {
        --color-blue-neon: ${selectedPrimary} !important;
        --color-redago: ${selectedSecondary} !important;
      }
    `;

    // 7. Serialize back to full HTML format
    const cleanHTML = "<!DOCTYPE html>\n" + clone.outerHTML;

    // 8. Get the correct filename
    let filename = window.location.pathname.split("/").pop();
    if (!filename || filename === "") filename = "index.html";

    // 9. Trigger browser download
    const blob = new Blob([cleanHTML], { type: "text/html;charset=utf-8" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = filename;
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    if (window.showNotification) {
      window.showNotification("HTML exported with custom colors! Save it inside F:\\BlueShot Website.");
    } else {
      alert("HTML exported with custom colors! Please move the downloaded file to your project folder to overwrite the old page, then commit in GitHub Desktop.");
    }
  }

  // Helper: Convert rgb(r, g, b) to #hex
  function rgbToHex(rgbStr) {
    if (!rgbStr.startsWith("rgb")) return rgbStr;
    const match = rgbStr.match(/\d+/g);
    if (!match) return rgbStr;
    const r = parseInt(match[0]);
    const g = parseInt(match[1]);
    const b = parseInt(match[2]);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
})();
