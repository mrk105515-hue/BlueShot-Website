// CHARACTER DATABASE (DXZ SEASON 3 ANIME LORE)
const CHARACTER_DB = {
  bsg: {
    name: "BSG (Celestial Host)",
    faction: "Neutral Protagonist",
    quote: "So BSG has awakened the first form of Redago. This form is called Flame Devil.",
    desc: "Escaping from the Infinity Prison has unlocked the Herobrine eyes and the celestial beast within BSG. Under extreme danger, he awakens the Flame Devil form, allowing him to decimate over 2,000 assassins with a single move. This represents just 1% of Redago's true cosmic power.",
    weapon: "Flame Devil Aura & Energy Fists",
    special: "Dragon Tale (1% Celestial Beast Power)",
    stats: { strength: 90, speed: 85, power: 95, intellect: 75 },
    image: "assets/char-bsg.png",
    redagoTheme: true
  },
  zalta: {
    name: "Curse God Zalta (Dark Bull)",
    faction: "Cursed Ally",
    quote: "Zalta has awakened Beast Mode 2nd Form. And has almost killed Lord Cage.",
    desc: "The last surviving member of a cursed bloodline. Upon escaping the Infinity Prison alongside BSG, Zalta reached an incredible 50x power increase in just one week. His Dark Bull form reaches a level of raw, destructive force closely rivaling BSG's Flame Devil.",
    weapon: "Spectral Shadow Horns & Claws",
    special: "Dark Bull Charge (Beast Mode 2nd Form)",
    stats: { strength: 88, speed: 82, power: 90, intellect: 70 },
    image: "assets/char-zalta.png",
    redagoTheme: true
  },
  jiggo: {
    name: "Emperor Jiggo Degan",
    faction: "East Emperor / Mentor",
    quote: "Jiggo Degan is the god-tier person. He is the Emperor and he has lots of hidden secrets.",
    desc: "Ruler of the East, Jiggo Degan was the legendary left hand of a historical legend. His mysterious past is deeply intertwined with the dark dimension, where he ventures to negotiate with Cobra, the Devil King, to prepare for the oncoming world war against Hell.",
    weapon: "Imperial Sage Staff & Dimension Portal",
    special: "Dark Dimension Passage",
    stats: { strength: 92, speed: 80, power: 96, intellect: 98 },
    image: "assets/char-jiggo.png",
    redagoTheme: false
  },
  eysa: {
    name: "Eysa (Blind Wielder)",
    faction: "Mystic Ally",
    quote: "A mysterious wielder surrounded by a blazing green aura.",
    desc: "Eysa is an enigmatic warrior who wears a blindfold to focus her sensory perception. Surrounded by a roaring emerald energy aura, she commands high-precision combat skills and is one of the most mysterious figures in the DXZ universe.",
    weapon: "Emerald Energy Aura & Mind Focus",
    special: "Blind Perception Strike",
    stats: { strength: 85, speed: 90, power: 88, intellect: 95 },
    image: "assets/char-eysa.png",
    redagoTheme: false
  },
  suma: {
    name: "Suma (Tactical Mind)",
    faction: "Tactical Leader",
    quote: "Suma is older than Berry Cade. She is the daughter of Jiggo Degan.",
    desc: "Described as a genius who combines beauty with brilliance, Suma is the operational leader of the group. She is the daughter of Jiggo Degan and the sister of Berry Cade. Renowned for her exceptional intelligence and flawless tactical mastery, she serves as one of the alliance's greatest strategists, leading her team with calm precision and sharp decision-making.",
    weapon: "Chao Tactical Blades & Intel Analysis",
    special: "Absolute Command & Vanguard Strike",
    stats: { strength: 65, speed: 88, power: 75, intellect: 99 },
    image: "assets/char-suma.png",
    redagoTheme: false
  },
  berry: {
    name: "Berry Cade (Ogre Blade)",
    faction: "Vanguard Swordsman",
    quote: "Berry is the wielder of the strongest sword, the Ogre.",
    desc: "The adopted son of Jiggo Degan. Berry is a fierce vanguard combatant wielding the heavy, legendary greatsword named 'Ogre'. He is Suma's adoptive nephew, fighting bravely on the front lines against the assassins.",
    weapon: "The Ogre Greatsword",
    special: "Ogre Divide",
    stats: { strength: 94, speed: 70, power: 80, intellect: 72 },
    image: "assets/char-berry.png",
    redagoTheme: false
  },
  hell: {
    name: "Hell (The Fate Author)",
    faction: "West Emperor",
    quote: "Hell is the most powerful being alive, for now. Because he can kill anyone because he has a God Gifted weapon.",
    desc: "Ruler of the West and the primary antagonist of the DXZ saga. Hell acts as the 'author' of the world's fate. He seeks to capture the celestial Redago force to secure his total cosmic dominance and eliminate all who oppose him with his God Gifted weapon.",
    weapon: "God-Gifted Fate-Eraser Blade",
    special: "World Authoring & Absolute Death Strike",
    stats: { strength: 99, speed: 95, power: 100, intellect: 95 },
    image: "assets/char-hell.png",
    redagoTheme: true
  },
  kan: {
    name: "Kan (Teleporting Bomber)",
    faction: "Assassin",
    quote: "A mysterious individual with the ability to teleport using pens and create explosives.",
    desc: "Kan is a vital ally to BSG and the team. Under the Season 3 custom art design, he wields high-impact combat capability, using specialized tools and writing implements as dimensional focus anchors to teleport instantaneously and deploy calculated explosive devices.",
    weapon: "Teleportation Pens & Custom Explosive Charges",
    special: "Pen Teleportation & Explosive Chain",
    stats: { strength: 80, speed: 95, power: 85, intellect: 90 },
    image: "assets/char-kan.png",
    redagoTheme: true
  },
  blackdagger: {
    name: "Black Dagger (Scinto)",
    faction: "DXZ Evil Leader / Vanguard",
    quote: "Black Dagger conducts experiments on humans, demons, and devils to create brainwashed soldiers. Lightning is just a simple illusion.",
    desc: "The supreme leader of the DXZ Evil Organisation. Hiding under the guise of the friendly swordsman Scinto, Black Dagger orchestrates the war from both ends to extract the Redago force from BSG's genes. He combines electric lightning swordplay with high-tech cybernetics and brainwashed clones, playing both sides of the cosmic war.",
    weapon: "Cybernetic Dagger & Lightning Blade",
    special: "Ragnarok Bolt & Summon Clones",
    stats: { strength: 80, speed: 90, power: 88, intellect: 96 },
    image: "assets/char-blackdagger.png",
    redagoTheme: true
  }
};

// YOUTUBE VIDEO DATA
const YT_VIDEO_ID = "hZq-gwlKtr0";

// DYNAMIC FONTAWESOME LOADER
function loadFontAwesome() {
  if (!document.querySelector('link[href*="font-awesome"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
    document.head.appendChild(link);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  try { loadFontAwesome(); } catch(e) { console.error("Error loading FontAwesome:", e); }
  document.body.classList.add("loaded"); // Enable animations and scroll immediately
  try { initNavbar(); } catch(e) { console.error("Error in initNavbar:", e); }
  try { initHeroBgVideo(); } catch(e) { console.error("Error in initHeroBgVideo:", e); }
  try { initDynamicIframes(); } catch(e) { console.error("Error in initDynamicIframes:", e); }
  try { initStatsCounter(); } catch(e) { console.error("Error in initStatsCounter:", e); }
  try { initVideoModal(); } catch(e) { console.error("Error in initVideoModal:", e); }
  try { initCharacterModal(); } catch(e) { console.error("Error in initCharacterModal:", e); }
  try { initContactForm(); } catch(e) { console.error("Error in initContactForm:", e); }
  try { initImageFallbacks(); } catch(e) { console.error("Error in initImageFallbacks:", e); }
  try { initEpisodeModal(); } catch(e) { console.error("Error in initEpisodeModal:", e); }
  try { initWikiSearch(); } catch(e) { console.error("Error in initWikiSearch:", e); }
  try { initEpisodeCountdown(); } catch(e) { console.error("Error in initEpisodeCountdown:", e); }

  // Handle cross-page query parameters for search modals
  const urlParams = new URLSearchParams(window.location.search);
  const charParam = urlParams.get('char');
  const epParam = urlParams.get('episode');

  if (charParam) {
    setTimeout(() => {
      if (window.openCharModal) window.openCharModal(charParam);
      // Clean query params so refresh doesn't pop open modal
      const newUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, newUrl);
    }, 600);
  } else if (epParam) {
    setTimeout(() => {
      if (window.openEpisodeModal) window.openEpisodeModal(epParam);
      const newUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, newUrl);
    }, 600);
  }
});

// DYNAMIC IFRAMES INJECTOR
function initDynamicIframes() {
  // 1. Latest Video Iframe
  const latestVideoContainer = document.getElementById("latest-video-container-placeholder");
  if (latestVideoContainer) {
    latestVideoContainer.innerHTML = "";
    const iframe = document.createElement("iframe");
    iframe.className = "latest-video-iframe";
    iframe.src = "https://www.youtube.com/embed/SKI7ZxkcbR8?rel=0&autoplay=0&controls=1&loop=1&playlist=SKI7ZxkcbR8";
    iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
    iframe.setAttribute("allowfullscreen", "true");
    iframe.style.border = "none";
    latestVideoContainer.appendChild(iframe);
  }
}

// SMART HERO BACKGROUND VIDEO
// Only injects the YouTube iframe when served over HTTP/HTTPS.
// When opened as a local file (file://) it silently keeps the poster image
// so the "Video player configuration error" never appears.
function initHeroBgVideo() {
  const ytBg   = document.getElementById("hero-yt-bg");
  const poster = document.getElementById("hero-bg-poster");
  if (!ytBg) return;

  const isHTTP = location.protocol === "http:" || location.protocol === "https:";
  if (!isHTTP) {
    // Running locally from disk — keep the poster, hide the video wrapper
    return;
  }

  // Build the iframe and inject it
  const iframe = document.createElement("iframe");
  iframe.className = "hero-yt-iframe";
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute("allow", "autoplay; encrypted-media");
  iframe.setAttribute("title", "DXZ Background Video");
  iframe.setAttribute("aria-hidden", "true");
  iframe.src = [
    "https://www.youtube.com/embed/hZq-gwlKtr0",
    "?autoplay=1&mute=1&loop=1",
    "&playlist=hZq-gwlKtr0",
    "&controls=0&rel=0&fs=0",
    "&iv_load_policy=3&disablekb=1&modestbranding=1",
    "&enablejsapi=1"
  ].join("");

  // Show the video wrapper and inject
  ytBg.style.display = "block";
  ytBg.appendChild(iframe);

  // Once iframe is loaded, gently fade out the poster (video takes over)
  iframe.addEventListener("load", () => {
    if (poster) {
      poster.style.transition = "opacity 2s ease";
      poster.style.opacity = "0";
    }
  });

  // Safety: if iframe errors out, hide video wrapper — poster stays visible
  iframe.addEventListener("error", () => {
    ytBg.style.display = "none";
    if (poster) poster.style.opacity = "0.28";
  });
}



// IMAGE FALLBACK HANDLER
function initImageFallbacks() {
  const images = document.querySelectorAll("img");
  
  const createFallback = (imgEl, alt) => {
    const initials = alt.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
    const parent = imgEl.parentElement;
    const isRedago = parent.parentElement.classList.contains("faction-villain") || 
                     parent.classList.contains("redago-theme") || 
                     alt.includes("hell") || alt.includes("Dagger") ||
                     alt.includes("Zalta") || alt.includes("Black Dagger");
                     
    const glowColor = isRedago ? "var(--color-redago)" : "var(--color-blue-neon)";
    const glowIntensity = isRedago ? "rgba(255, 18, 79, 0.15)" : "rgba(0, 229, 255, 0.15)";
    
    // Check if fallback already exists to prevent duplicate insertion
    if (parent.querySelector(".image-fallback-placeholder")) return;

    // Create a beautiful vector replacement container
    const fallbackDiv = document.createElement("div");
    fallbackDiv.className = "image-fallback-placeholder";
    fallbackDiv.style.width = "100%";
    fallbackDiv.style.height = "100%";
    fallbackDiv.style.display = "flex";
    fallbackDiv.style.flexDirection = "column";
    fallbackDiv.style.alignItems = "center";
    fallbackDiv.style.justifyContent = "center";
    fallbackDiv.style.background = `radial-gradient(circle, ${glowIntensity} 0%, #12121A 100%)`;
    fallbackDiv.style.border = `1px solid rgba(255,255,255,0.05)`;
    fallbackDiv.style.position = "relative";
    fallbackDiv.style.overflow = "hidden";
    
    // Abstract background grid
    const bgGrid = document.createElement("div");
    bgGrid.style.position = "absolute";
    bgGrid.style.width = "200%";
    bgGrid.style.height = "200%";
    bgGrid.style.border = `1px dashed rgba(255,255,255,0.02)`;
    bgGrid.style.transform = "rotate(45deg)";
    fallbackDiv.appendChild(bgGrid);
    
    // Inner glowing avatar
    const avatarCircle = document.createElement("div");
    avatarCircle.style.width = "70px";
    avatarCircle.style.height = "70px";
    avatarCircle.style.borderRadius = "50%";
    avatarCircle.style.background = "rgba(255, 255, 255, 0.03)";
    avatarCircle.style.border = `2px solid ${glowColor}`;
    avatarCircle.style.boxShadow = `0 0 20px ${glowColor}`;
    avatarCircle.style.display = "flex";
    avatarCircle.style.alignItems = "center";
    avatarCircle.style.justifyContent = "center";
    avatarCircle.style.fontSize = "1.5rem";
    avatarCircle.style.fontWeight = "800";
    avatarCircle.style.color = "#FFF";
    avatarCircle.style.fontFamily = "var(--font-display)";
    avatarCircle.style.zIndex = "2";
    avatarCircle.textContent = initials;
    
    fallbackDiv.appendChild(avatarCircle);
    
    // Badge text
    const badge = document.createElement("span");
    badge.style.marginTop = "1rem";
    badge.style.fontSize = "0.75rem";
    badge.style.textTransform = "uppercase";
    badge.style.letterSpacing = "0.1em";
    badge.style.color = glowColor;
    badge.style.fontWeight = "700";
    badge.style.zIndex = "2";
    badge.textContent = "Season 3 Log";
    fallbackDiv.appendChild(badge);

    // Swap image with fallback
    imgEl.style.display = "none";
    parent.appendChild(fallbackDiv);
  };

  images.forEach(img => {
    // If it has a data-src and is not bsg.jpg, trigger immediate fallback
    if (img.hasAttribute("data-src") && !img.getAttribute("data-src").includes("char-bsg.jpg")) {
      createFallback(img, img.alt);
    }
    
    img.addEventListener("error", function() {
      createFallback(this, this.alt);
    });
  });
}


// NAVBAR FUNCTIONS
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const navLinksList = document.getElementById("nav-links");
  const navLinks = document.querySelectorAll(".nav-link");

  // Sticky Navbar on Scroll
  window.addEventListener("scroll", () => {
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    }
  });

  // Mobile Menu Toggle
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

  // Close Mobile Menu on Link Click
  if (navLinks && navLinksList && mobileMenuBtn) {
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        navLinksList.classList.remove("active");
        const icon = mobileMenuBtn.querySelector("i");
        if (icon) icon.className = "fa-solid fa-bars";
      });
    });
  }

  // Active Link Tracker using Intersection Observer
  const sections = document.querySelectorAll("section");
  if (sections.length > 0 && navLinks.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach(link => {
            link.classList.remove("active");
            const anchor = link.querySelector("a");
            if (anchor && anchor.getAttribute("href") === `#${id}`) {
              link.classList.add("active");
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }
}

// STATS COUNTER FUNCTIONS
function initStatsCounter() {
  const statItems = document.querySelectorAll(".hero-stats .stat-item");
  if (statItems.length === 0) return;
  
  // Set initial hidden styling dynamically so they fade in cleanly when scrolled to
  statItems.forEach(item => {
    item.style.opacity = "0";
    item.style.transform = "translateY(20px)";
    item.style.transition = "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
  });

  let started = false;

  const checkScroll = () => {
    const rect = statItems[0].getBoundingClientRect();
    if (rect.top < window.innerHeight && !started) {
      started = true;
      
      // Animate stat items sequentially with a delay
      statItems.forEach((item, index) => {
        setTimeout(() => {
          item.style.opacity = "1";
          item.style.transform = "translateY(0)";
        }, index * 300); // 300ms delay between each number fading in
      });

      window.removeEventListener("scroll", checkScroll);
    }
  };

  window.addEventListener("scroll", checkScroll);
  checkScroll(); // Trigger if already in viewport
}

// VIDEO WATCH MODAL FUNCTIONS
function initVideoModal() {
  const trigger = document.getElementById("video-container-trigger");
  const modal = document.getElementById("video-modal");
  const closeBtn = document.getElementById("video-modal-close");
  const placeholder = document.getElementById("video-modal-iframe-placeholder");
  const backdrop = modal.querySelector(".modal-backdrop");

  const openModal = () => {
    if (placeholder) {
      placeholder.innerHTML = "";
      const iframe = document.createElement("iframe");
      iframe.id = "video-iframe";
      iframe.src = `https://www.youtube.com/embed/${YT_VIDEO_ID}?autoplay=1`;
      iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
      iframe.setAttribute("allowfullscreen", "true");
      iframe.style.border = "none";
      placeholder.appendChild(iframe);
    }
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    modal.classList.remove("active");
    if (placeholder) {
      placeholder.innerHTML = "";
    }
    document.body.style.overflow = "";
  };

  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);
}

// CHARACTER MODAL FUNCTIONS
function initCharacterModal() {
  const cards = document.querySelectorAll(".character-card");
  const modal = document.getElementById("char-modal");
  const closeBtn = document.getElementById("char-modal-close");
  const container = document.getElementById("char-modal-content");
  if (!modal || !closeBtn || !container) return;
  const backdrop = modal.querySelector(".modal-backdrop");
  if (!backdrop) return;

  window.openCharModal = (charKey) => {
    if (charKey === "scinto") charKey = "blackdagger";
    const char = CHARACTER_DB[charKey];
    if (!char) return;

        // Check if the character has a real image or needs fallback
    const hasImage = !!char.image;
    const glowColor = char.redagoTheme ? "var(--color-redago)" : "var(--color-blue-neon)";

    // Render HTML inside Modal
    container.innerHTML = `
      <div class="char-modal-portrait ${char.redagoTheme ? 'redago-theme' : ''}" data-char="${charKey}">
        ${hasImage ? `
          <img src="${char.image}" alt="${char.name}" class="char-modal-portrait-img">
        ` : `
          <div class="image-fallback-placeholder" style="width: 100%; height: 100%; display: flex; flexDirection: column; align-items: center; justify-content: center; background: radial-gradient(circle, ${char.redagoTheme ? 'rgba(255, 18, 79, 0.15)' : 'rgba(0, 229, 255, 0.15)'} 0%, #12121A 100%); border: 1px solid rgba(255,255,255,0.05); position: relative; overflow: hidden; min-height: 450px;">
            <div style="position: absolute; width: 200%; height: 200%; border: 1px dashed rgba(255,255,255,0.02); transform: rotate(45deg);"></div>
            <div style="width: 100px; height: 100px; border-radius: 50%; background: rgba(255, 255, 255, 0.03); border: 2px solid ${glowColor}; box-shadow: 0 0 25px ${glowColor}; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 800; color: #FFF; font-family: var(--font-display); z-index: 2;">${char.name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase()}</div>
            <span style="margin-top: 1.5rem; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.15em; color: ${glowColor}; font-weight: 700; z-index: 2; font-family: var(--font-display);">Season 3 Archive</span>
          </div>
        `}
      </div>
      <div class="char-modal-info">
        <span class="char-modal-faction ${char.redagoTheme ? 'gradient-text-redago' : 'gradient-text-blue'}">${char.faction}</span>
        <h3 class="char-modal-name">${char.name}</h3>
        <p class="char-modal-quote ${char.redagoTheme ? 'redago-quote' : ''}">"${char.quote}"</p>
        <p class="char-modal-desc">${char.desc}</p>
        
        ${charKey === 'scinto' || charKey === 'blackdagger' ? `
          <div class="identity-reveal-badge" style="margin-top: 1rem; margin-bottom: 1rem; padding: 0.75rem; background: rgba(255, 18, 79, 0.12); border: 1px solid var(--color-redago); border-radius: 4px; display: flex; align-items: center; gap: 0.5rem; color: #FFF; font-size: 0.85rem; font-family: var(--font-body); box-shadow: 0 0 10px rgba(255, 18, 79, 0.2);">
            <i class="fa-solid fa-mask" style="color: var(--color-redago); font-size: 1rem; animation: pulse 1.5s infinite;"></i>
            <span><strong>Secret Identity:</strong> Scinto and Black Dagger are the exact same person!</span>
          </div>
        ` : ''}
        
        <div class="char-details-list">
          <div class="char-detail-item">
            <span class="char-detail-label">Signature Weapon</span>
            <span class="char-detail-val">${char.weapon}</span>
          </div>
          <div class="char-detail-item">
            <span class="char-detail-label">Ultimate Move</span>
            <span class="char-detail-val">${char.special}</span>
          </div>
        </div>
        
        <div class="char-stats-section">
          <h4>Attribute Grid</h4>
          
          <div class="char-stat-bar-group">
            <div class="char-stat-bar-label">
              <span>Attack Power</span>
              <span>${char.stats.strength}%</span>
            </div>
            <div class="char-stat-bar-bg">
              <div class="char-stat-bar-fill" style="width: 0%" data-width="${char.stats.strength}"></div>
            </div>
          </div>
          
          <div class="char-stat-bar-group">
            <div class="char-stat-bar-label">
              <span>Agility & Speed</span>
              <span>${char.stats.speed}%</span>
            </div>
            <div class="char-stat-bar-bg">
              <div class="char-stat-bar-fill" style="width: 0%" data-width="${char.stats.speed}"></div>
            </div>
          </div>
          
          <div class="char-stat-bar-group">
            <div class="char-stat-bar-label">
              <span>Destructive Force</span>
              <span>${char.stats.power}%</span>
            </div>
            <div class="char-stat-bar-bg">
              <div class="char-stat-bar-fill" style="width: 0%" data-width="${char.stats.power}"></div>
            </div>
          </div>
          
          <div class="char-stat-bar-group">
            <div class="char-stat-bar-label">
              <span>Tactical Intelligence</span>
              <span>${char.stats.intellect}%</span>
            </div>
            <div class="char-stat-bar-bg">
              <div class="char-stat-bar-fill" style="width: 0%" data-width="${char.stats.intellect}"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    // Trigger Stat Bars Animation
    setTimeout(() => {
      const bars = container.querySelectorAll(".char-stat-bar-fill");
      bars.forEach(bar => {
        bar.style.width = bar.getAttribute("data-width") + "%";
      });
    }, 100);
  };

  const closeCharModal = () => {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  };

  cards.forEach(card => {
    card.addEventListener("click", () => {
      let charKey = card.getAttribute("data-char");
      if (!charKey) {
        if (card.classList.contains("char-bsg")) charKey = "bsg";
        else if (card.classList.contains("char-zalta")) charKey = "zalta";
        else if (card.classList.contains("char-jiggo")) charKey = "jiggo";
        else if (card.classList.contains("char-eysa")) charKey = "eysa";
        else if (card.classList.contains("char-suma")) charKey = "suma";
        else if (card.classList.contains("char-berry")) charKey = "berry";
        else if (card.classList.contains("char-hell")) charKey = "hell";
        else if (card.classList.contains("char-kan")) charKey = "kan";
        else if (card.classList.contains("char-blackdagger")) charKey = "blackdagger";
      }
      if (!charKey) {
        const nameEl = card.querySelector(".character-card-name") || card.querySelector("h3");
        const imgEl = card.querySelector("img");
        const nameText = nameEl ? nameEl.textContent.toLowerCase() : "";
        const altText = imgEl ? (imgEl.getAttribute("alt") || "").toLowerCase() : "";
        if (nameText.includes("bsg") || altText.includes("bsg")) charKey = "bsg";
        else if (nameText.includes("zalta") || altText.includes("zalta")) charKey = "zalta";
        else if (nameText.includes("jiggo") || altText.includes("jiggo")) charKey = "jiggo";
        else if (nameText.includes("eysa") || altText.includes("eysa")) charKey = "eysa";
        else if (nameText.includes("suma") || altText.includes("suma")) charKey = "suma";
        else if (nameText.includes("berry") || altText.includes("berry")) charKey = "berry";
        else if (nameText.includes("hell") || altText.includes("hell")) charKey = "hell";
        else if (nameText.includes("kan") || altText.includes("kan")) charKey = "kan";
        else if (nameText.includes("dagger") || altText.includes("dagger")) charKey = "blackdagger";
      }
      if (charKey) window.openCharModal(charKey);
    });
  });

  closeBtn.addEventListener("click", closeCharModal);
  backdrop.addEventListener("click", closeCharModal);
}

// CONTACT FORM FUNCTIONS
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const alertsContainer = document.getElementById("alert-container");

  const showAlert = (message, isError = false) => {
    const alertCard = document.createElement("div");
    alertCard.className = `alert-card ${isError ? 'error' : ''}`;
    alertCard.innerHTML = `
      <i class="${isError ? 'fa-solid fa-circle-xmark' : 'fa-solid fa-circle-check'}"></i>
      <span>${message}</span>
    `;
    
    alertsContainer.appendChild(alertCard);
    
    // Animate In
    setTimeout(() => {
      alertCard.classList.add("active");
    }, 10);
    
    // Auto-remove
    setTimeout(() => {
      alertCard.classList.remove("active");
      setTimeout(() => {
        alertCard.remove();
      }, 500);
    }, 4000);
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector("button[type='submit']");
    const name = document.getElementById("form-name").value.trim();
    const email = document.getElementById("form-email").value.trim();
    
    if (!name || !email) {
      showAlert("Please fill in all required fields.", true);
      return;
    }
    
    // Loading State Button
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `Sending... <i class="fa-solid fa-spinner fa-spin" style="margin-left: 0.5rem;"></i>`;
    
    // Simulate Form Submission API call
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      
      showAlert(`Thank you, ${name}! Your inquiry has been sent to blueshotconnectx@gmail.com.`);
      form.reset();
    }, 1500);
  });
}

// EPISODE MODAL FUNCTIONS
function initEpisodeModal() {
  const ep1Trigger = document.getElementById("ep-1-card-trigger");
  const recapTrigger = document.getElementById("recap-card-trigger");
  const charTrigger = document.getElementById("characters-card-trigger");
  const modal = document.getElementById("episode-modal");
  if (!modal) return;
  
  const closeBtn = document.getElementById("episode-modal-close");
  const backdrop = modal.querySelector(".modal-backdrop");
  const textContainer = modal.querySelector(".episode-modal-text");
  const modalTitle = modal.querySelector(".char-modal-name");
  const modalSubtitle = modal.querySelector(".section-subtitle");
  const modalImg = modal.querySelector(".episode-modal-header img");
  
  if (!closeBtn || !backdrop || !textContainer) return;
  
  const ep1Story = `
    <p style="margin-bottom: 1.5rem;">On a cold morning, BSG stood atop a tall building, ready to end his life. He had tried many times before but never succeeded. Mocked, judged, and abandoned by people, he was tired of living. He jumped again—but survived once more. Broken yet alive, he realized: <em>If I can’t die, maybe I was meant to live differently.</em></p>
    <p style="margin-bottom: 1.5rem;">Later, while walking through the jungle, BSG met a desperate stranger who lured him with a promise of power. After consuming a mysterious object, BSG was attacked by strange creatures. At first powerless, he unlocked his strength by embracing his anger and pain, destroying the enemies. The stranger revealed they were sent by an evil organization called <strong>DXZ</strong> and asked BSG to follow him.</p>
    <p style="margin-bottom: 1.5rem;">After regaining strength, BSG encountered <strong>Scinto</strong>—an unremarkable, funny man with a weak voice who became his friend and mentor. They lived and trained together, with BSG trusting him deeply. But Scinto’s true identity was hidden. In reality, he was <strong>Black Dagger</strong>, a 150-year-old being—the strongest of all, with unimaginable power. His playful, harmless facade was a mask; his real goal was to extract the force within BSG—<strong>Redago</strong>.</p>
    <p style="margin-bottom: 0;">The bond between them was a lie, a calculated manipulation. BSG saw Scinto as a mentor, but in truth, he was the greatest threat—the mastermind plotting to control the power inside him.</p>
  `;

  const recapStory = `
    <p style="margin-bottom: 1.5rem;"><strong>Season 1 Recap:</strong> The journey of BSG began in the divided world where he fought to survive. After gaining the mysterious Redago power, he faced his first major adversaries and realized the true scale of the DXZ organisation's dark operations.</p>
    <p style="margin-bottom: 1.5rem;"><strong>Season 2 Recap:</strong> Factions clashed as the East and West rulers went to war. Zalta awakened his Dark Bull form to battle Lord Cage, while Hell deployed his God Gifted weapon to rewrite the world's fate. BSG began training under Emperor Jiggo Degan to control the wild Flame Devil form.</p>
    <p style="margin-bottom: 0;"><strong>Season 3 Onwards:</strong> Now, with only one year remaining before the God Butcher DMAGA returns to Earth, the heroes must unite, awaken the Beyond State, and stop Black Dagger from claiming the ultimate cosmic force.</p>
  `;

  window.openEpisodeModal = (type) => {
    if (type === "ep1") {
      if (modalTitle) modalTitle.textContent = "The Journey Begins";
      if (modalSubtitle) modalSubtitle.textContent = "Episode 01";
      if (modalImg) modalImg.src = "https://blueshotwiki.netlify.app/assets/ep1-explanation.jpg";
      textContainer.innerHTML = ep1Story;
    } else if (type === "recap") {
      if (modalTitle) modalTitle.textContent = "S1 & S2 Complete Lore Recap";
      if (modalSubtitle) modalSubtitle.textContent = "Lore Archives";
      if (modalImg) modalImg.src = "https://blueshotwiki.netlify.app/assets/ep1-recap.png";
      textContainer.innerHTML = recapStory;
    }
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  };

  if (ep1Trigger) ep1Trigger.addEventListener("click", (e) => {
    e.preventDefault();
    window.openEpisodeModal("ep1");
  });
  if (recapTrigger) recapTrigger.addEventListener("click", (e) => {
    e.preventDefault();
    window.openEpisodeModal("recap");
  });
  
  if (charTrigger) {
    charTrigger.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.getElementById("characters");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
  
  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);
}

// WIKI SEARCH BAR LOGIC
function initWikiSearch() {
  const searchInput = document.getElementById("wiki-search-input");
  const clearBtn = document.getElementById("search-clear-btn");
  const cards = document.querySelectorAll(".characters-grid .character-card");
  const grid = document.getElementById("characters-grid");
  if (!searchInput || !grid) return;

  // Create "No Results" message element
  const noResultsDiv = document.createElement("div");
  noResultsDiv.className = "search-no-results";
  noResultsDiv.style.display = "none";
  noResultsDiv.innerHTML = `
    <i class="fa-solid fa-circle-question"></i>
    <h3>No Archive Records Found</h3>
    <p>We couldn't find any characters, factions, or abilities matching your search query. Try another term!</p>
  `;
  grid.appendChild(noResultsDiv);

  const handleSearch = () => {
    const query = searchInput.value.trim().toLowerCase();
    
    // Toggle clear button visibility
    if (clearBtn) {
      clearBtn.style.display = query.length > 0 ? "flex" : "none";
    }

    let matchCount = 0;

    cards.forEach(card => {
      const charKey = card.getAttribute("data-char");
      const charData = CHARACTER_DB[charKey];
      
      // If we don't have metadata for this card, fallback to card text
      if (!charData) {
        const textContent = card.textContent.toLowerCase();
        if (textContent.includes(query)) {
          card.style.display = "";
          matchCount++;
        } else {
          card.style.display = "none";
        }
        return;
      }

      // Build text pool from name, faction, quote, desc, weapon, special
      const textPool = [
        charData.name,
        charData.faction,
        charData.quote,
        charData.desc,
        charData.weapon,
        charData.special
      ].join(" ").toLowerCase();

      if (textPool.includes(query)) {
        card.style.display = "";
        matchCount++;
      } else {
        card.style.display = "none";
      }
    });

    // Handle "No Results" display
    noResultsDiv.style.display = matchCount === 0 && query.length > 0 ? "block" : "none";
  };

  searchInput.addEventListener("input", handleSearch);

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      handleSearch();
      searchInput.focus();
    });
  }
}

// ==========================================================================
// EPISODE 26 RELEASE COUNTDOWN TIMER LOGIC
// ==========================================================================
function initEpisodeCountdown() {
  const timerEl = document.getElementById("hero-timer");
  if (!timerEl) return;

  const targetDateStr = "2026-07-07T17:00:00+05:30"; // Target release: Tuesday 5 PM IST
  const targetDate = new Date(targetDateStr).getTime();

  function updateTimer() {
    const now = Date.now();
    const distance = targetDate - now;

    if (distance < 0) {
      timerEl.textContent = "00:00:00";
      const infoContainer = timerEl.parentElement;
      if (infoContainer) {
        const titleEl = infoContainer.querySelector("h3");
        if (titleEl && titleEl.textContent !== "EP 26 IS NOW LIVE! 🎉") {
          titleEl.textContent = "EP 26 IS NOW LIVE! 🎉";
        }
      }
      return;
    }

    const hours = Math.floor(distance / 3600000);
    const minutes = Math.floor((distance % 3600000) / 60000);
    const seconds = Math.floor((distance % 60000) / 1000);

    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    timerEl.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  // Update timer immediately on load, then every second
  updateTimer();
  setInterval(updateTimer, 1000);
}



