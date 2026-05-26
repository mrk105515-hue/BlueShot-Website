// ==========================================================================
// DXZ GLOBAL WIKI SEARCH SYSTEM
// Handles overlay injection, filters, key listeners, and page navigation
// ==========================================================================

const GLOBAL_SEARCH_DB = [
  // Characters
  { name: "BSG (Celestial Host)", category: "characters", desc: "Main protagonist wielding the raw, blazing Flame Devil form (1% power).", link: "index.html#characters", type: "character", key: "bsg" },
  { name: "Curse God Zalta", category: "characters", desc: "Cursed Ally in Dark Bull Beast Mode 2nd Form. Escaped Infinity Prison.", link: "index.html#characters", type: "character", key: "zalta" },
  { name: "Emperor Jiggo Degan", category: "characters", desc: "Ruler of the East. Legendary mentor controlling the dark dimension portal.", link: "index.html#characters", type: "character", key: "jiggo" },
  { name: "Eysa (Blind Wielder)", category: "characters", desc: "Mystic Ally surrounded by a roaring emerald energy aura.", link: "index.html#characters", type: "character", key: "eysa" },
  { name: "Suma (Tactical Mind)", category: "characters", desc: "Tactical leader, sister of Jiggo Degan. Combines beauty with brainpower.", link: "index.html#characters", type: "character", key: "suma" },
  { name: "Berry Cade (Ogre Blade)", category: "characters", desc: "Adoptive son of Jiggo Degan wielding the heavy Ogre greatsword.", link: "index.html#characters", type: "character", key: "berry" },
  { name: "Hell (Fate Author)", category: "characters", desc: "West Emperor and antagonist wielding the God-Gifted Fate-Eraser Blade.", link: "index.html#characters", type: "character", key: "hell" },
  { name: "Kan (Teleporting Bomber)", category: "characters", desc: "Assassin ally using writing pens as dimensional teleportation anchors.", link: "index.html#characters", type: "character", key: "kan" },
  { name: "Black Dagger (Scinto)", category: "characters", desc: "Evil DXZ Organisation leader. A 150-year-old entity seeking Redago.", link: "index.html#characters", type: "character", key: "blackdagger" },
  
  // Episodes & Lore Sections
  { name: "Episode 1: The Journey Begins", category: "episodes", desc: "Read the story breakdown of BSG's escape, meeting Scinto, and DXZ threats.", link: "index.html#media-hub", type: "episode", key: "ep1" },
  { name: "Lore Recap: Season 1 & 2 Breakdown", category: "episodes", desc: "Recap the conflicts, Zalta vs Lord Cage, and the God Butcher threat.", link: "index.html#media-hub", type: "episode", key: "recap" },
  { name: "Divided World & Darkness Lore", category: "episodes", desc: "Detailed lore of Black Dagger, Rejock, and the returned menace DMAGA.", link: "index.html#story-overview", type: "section" },
  
  // Merchandise Catalog
  { name: "DXZ Official 'RULER' T-Shirt", category: "merch", desc: "Heavyweight cotton crimson apparel featuring the West & East Emperor design (₹1,999).", link: "merch.html", type: "merch" },
  { name: "DXZ Obsidian 'Flame Devil' Hoodie", category: "merch", desc: "Limited edition black and neon-red high-contrast anime hoodie (₹3,999).", link: "merch.html", type: "merch" },
  { name: "Season 3 Metallic Poster", category: "merch", desc: "Ultra-glossy 18\"x24\" anime display poster for Danger X Zone (₹1,199).", link: "merch.html", type: "merch" },
  { name: "Redago Aura Phone Case", category: "merch", desc: "Sleek protective armor case for iPhone and Samsung (₹1,599).", link: "merch.html", type: "merch" },
  
  // Behind the Scenes Sections
  { name: "BTS: Scriptwriting & Lore Drafting", category: "bts", desc: "Step 1: Planning directions, Government experiments, and the Beyond State.", link: "index.html#bts", type: "section" },
  { name: "BTS: Art & Model Direction", category: "bts", desc: "Step 2: Designing assets and expression rigging in the new Season 3 style.", link: "index.html#bts", type: "section" },
  { name: "BTS: Animation & Fight Choreography", category: "bts", desc: "Step 3: Keyframing martial arts, speed effects, and Blender physics solvers.", link: "index.html#bts", type: "section" },
  { name: "BTS: Voice Acting & Sound Design", category: "bts", desc: "Step 4: Custom dialogue tracks, blade slashes, and energy aura layers.", link: "index.html#bts", type: "section" }
];

document.addEventListener("DOMContentLoaded", () => {
  initGlobalSearch();
  initNavbarProfileWidget();
  initMobileMenuToggle();
});

function initGlobalSearch() {
  // 1. Inject Search Overlay HTML to Body
  const overlayHTML = `
    <div class="global-search-overlay" id="global-search-overlay">
      <div class="search-overlay-container">
        <div class="search-overlay-header">
          <div class="search-overlay-box">
            <i class="fa-solid fa-magnifying-glass search-overlay-icon"></i>
            <input type="text" id="global-search-input" placeholder="Search the BlueShot Wiki (e.g. BSG, Hoodie, Episode 1)..." autocomplete="off">
            <button id="global-search-clear" class="search-overlay-clear"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <button id="global-search-close" class="search-overlay-close-btn"><i class="fa-solid fa-xmark"></i> Close</button>
        </div>
        
        <div class="search-filters-row">
          <span class="filter-label">Filter:</span>
          <div class="filter-pills" id="global-search-pills">
            <button class="filter-pill active" data-filter="all">All</button>
            <button class="filter-pill" data-filter="characters">Characters</button>
            <button class="filter-pill" data-filter="episodes">Episodes &amp; Lore</button>
            <button class="filter-pill" data-filter="merch">Merchandise</button>
            <button class="filter-pill" data-filter="bts">Behind the Scenes</button>
          </div>
        </div>
        
        <div class="search-overlay-results" id="global-search-results">
          <div class="search-start-message">
            <i class="fa-solid fa-keyboard"></i>
            <p>Type to search characters, lore, merch, and pipeline steps...</p>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", overlayHTML);

  const overlay = document.getElementById("global-search-overlay");
  const searchInput = document.getElementById("global-search-input");
  const clearBtn = document.getElementById("global-search-clear");
  const closeBtn = document.getElementById("global-search-close");
  const resultsContainer = document.getElementById("global-search-results");
  const filterPills = document.querySelectorAll("#global-search-pills .filter-pill");

  let activeFilter = "all";

  if (!overlay || !searchInput || !resultsContainer) return;

  // 2. Open Search logic
  const openSearch = (e) => {
    if (e) e.preventDefault();
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
    setTimeout(() => searchInput.focus(), 150);
  };

  // 3. Close Search logic
  const closeSearch = () => {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
    searchInput.value = "";
    resultsContainer.innerHTML = `
      <div class="search-start-message">
        <i class="fa-solid fa-keyboard"></i>
        <p>Type to search characters, lore, merch, and pipeline steps...</p>
      </div>
    `;
    if (clearBtn) clearBtn.style.display = "none";
    filterPills.forEach(p => p.classList.remove("active"));
    document.querySelector('[data-filter="all"]').classList.add("active");
    activeFilter = "all";
  };

  // 4. Attach open triggers
  document.querySelectorAll(".global-search-trigger").forEach(trigger => {
    trigger.addEventListener("click", openSearch);
  });

  if (closeBtn) closeBtn.addEventListener("click", closeSearch);

  // Close on ESC key or clicking outside container
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("active")) {
      closeSearch();
    }
    // '/' key opens search overlay if not inside an input
    if (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
      e.preventDefault();
      openSearch();
    }
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeSearch();
  });

  // 5. Handle Live Searching
  const executeSearch = () => {
    const query = searchInput.value.trim().toLowerCase();
    
    if (clearBtn) {
      clearBtn.style.display = query.length > 0 ? "flex" : "none";
    }

    if (query.length === 0) {
      resultsContainer.innerHTML = `
        <div class="search-start-message">
          <i class="fa-solid fa-keyboard"></i>
          <p>Type to search characters, lore, merch, and pipeline steps...</p>
        </div>
      `;
      return;
    }

    // Filter database items
    const matches = GLOBAL_SEARCH_DB.filter(item => {
      const matchFilter = activeFilter === "all" || item.category === activeFilter;
      const matchText = item.name.toLowerCase().includes(query) || 
                        item.desc.toLowerCase().includes(query);
      return matchFilter && matchText;
    });

    // Render matches
    if (matches.length === 0) {
      resultsContainer.innerHTML = `
        <div class="search-no-results-message">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <h3>No records found</h3>
          <p>No results found for "${searchInput.value}". Check your spelling or select a different filter.</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = "";
    matches.forEach(item => {
      const itemCard = document.createElement("div");
      itemCard.className = "search-result-item";
      
      // Determine badge class for styling
      let badgeClass = `badge-${item.category}`;
      let displayCategory = item.category === "bts" ? "Behind the Scenes" : item.category;

      itemCard.innerHTML = `
        <div class="search-result-info">
          <span class="search-result-title">${item.name}</span>
          <span class="search-result-desc">${item.desc}</span>
        </div>
        <span class="search-result-badge ${badgeClass}">${displayCategory}</span>
      `;

      itemCard.addEventListener("click", () => {
        handleItemClick(item);
      });

      resultsContainer.appendChild(itemCard);
    });
  };

  searchInput.addEventListener("input", executeSearch);

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      executeSearch();
      searchInput.focus();
    });
  }

  // 6. Handle Filters toggle
  filterPills.forEach(pill => {
    pill.addEventListener("click", () => {
      filterPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      activeFilter = pill.getAttribute("data-filter");
      executeSearch();
    });
  });

  // 7. Navigation redirection & actions
  const handleItemClick = (item) => {
    closeSearch();

    const isHomepage = window.location.pathname.endsWith("index.html") || 
                       window.location.pathname.endsWith("/") ||
                       window.location.pathname === "";

    if (item.type === "character") {
      if (isHomepage) {
        if (window.openCharModal) {
          window.openCharModal(item.key);
        }
      } else {
        window.location.href = "index.html?char=" + item.key;
      }
    } else if (item.type === "episode") {
      if (isHomepage) {
        if (window.openEpisodeModal) {
          window.openEpisodeModal(item.key);
        }
      } else {
        window.location.href = "index.html?episode=" + item.key;
      }
    } else if (item.type === "merch") {
      window.location.href = "merch.html";
    } else if (item.type === "section") {
      const hash = item.link.substring(item.link.indexOf("#"));
      if (isHomepage) {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = item.link;
      }
    }
  };
}

function initNavbarProfileWidget() {
  let container = document.querySelector(".nav-socials") || document.querySelector(".nav-actions");
  if (!container) return;

  let widget = document.getElementById("nav-profile-widget");
  if (!widget) {
    widget = document.createElement("div");
    widget.id = "nav-profile-widget";
    widget.className = "nav-profile-widget";
    container.appendChild(widget);
  }

  const isFirebaseConfigured = typeof firebaseConfig !== 'undefined' && 
                               firebaseConfig.apiKey && 
                               firebaseConfig.apiKey !== "YOUR_API_KEY";

  let useLiveFirebase = typeof firebase !== 'undefined' && isFirebaseConfigured;

  function updateWidgetUI(user) {
    if (user) {
      const displayName = user.displayName || "Member";
      const initials = displayName.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
      widget.innerHTML = `
        <a href="hub.html#join-faction" class="nav-profile-avatar" title="Logged in as ${displayName}. Click to view profile.">
          ${initials}
        </a>
      `;
    } else {
      widget.innerHTML = `
        <a href="hub.html#join-faction" class="nav-profile-login-btn" title="Log In / Register to participate in polls and comments">
          <i class="fa-solid fa-right-to-bracket"></i> Log In
        </a>
      `;
    }
  }

  if (useLiveFirebase) {
    try {
      if (firebase.apps.length === 0) {
        firebase.initializeApp(firebaseConfig);
      }
      const auth = firebase.auth();
      auth.onAuthStateChanged((user) => {
        updateWidgetUI(user);
      });
    } catch (e) {
      console.warn("Firebase Auth listener failed in search.js. Falling back to local state.", e);
      setupLocalStateTracking();
    }
  } else {
    setupLocalStateTracking();
  }

  function setupLocalStateTracking() {
    const checkLocalState = () => {
      const savedUser = localStorage.getItem("dxz_demo_user");
      const user = savedUser ? JSON.parse(savedUser) : null;
      updateWidgetUI(user);
    };

    checkLocalState();

    window.addEventListener("dxz_user_changed", checkLocalState);
    window.addEventListener("focus", checkLocalState);
  }
}

function initMobileMenuToggle() {
  const isHomepage = window.location.pathname.endsWith("index.html") || 
                     window.location.pathname.endsWith("/") ||
                     window.location.pathname === "";
  if (isHomepage) return;

  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const navLinksList = document.getElementById("nav-links");
  const navLinks = document.querySelectorAll(".nav-link");

  if (mobileMenuBtn && navLinksList) {
    mobileMenuBtn.addEventListener("click", () => {
      navLinksList.classList.toggle("active");
      const icon = mobileMenuBtn.querySelector("i");
      if (icon) {
        if (navLinksList.classList.contains("active")) {
          icon.className = "fa-solid fa-xmark";
        } else {
          icon.className = "fa-solid fa-bars";
        }
      }
    });
  }

  if (navLinks && navLinksList && mobileMenuBtn) {
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        navLinksList.classList.remove("active");
        const icon = mobileMenuBtn.querySelector("i");
        if (icon) icon.className = "fa-solid fa-bars";
      });
    });
  }
}

