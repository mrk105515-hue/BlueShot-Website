// ==========================================================================
// DXZ SUPPORTERS & GLOBAL RANK SYSTEM
// Handles Rank Purchases (Razorpay & Lore Game Cash), Glory Boosting,
// Strict Authentication Gating, and Live Special Board Leaderboard.
// ==========================================================================

(function() {
  'use strict';

  // 1. RANK DEFINITIONS
  const SUPPORTER_RANKS = {
    elite: {
      id: "elite",
      name: "ELITE",
      price: 5,
      minGlory: 5,
      gameCashPrice: 10000,
      image: "assets/rank-elite.png",
      color: "#ff7b25",
      rgb: "255, 123, 37",
      title: "Faction Vanguard",
      tagline: "The steadfast foundation of the resistance.",
      perks: [
        "Official Bronze Crest on Special Board",
        "Unlock with ₹5 OR $10,000 Lore Game Cash",
        "Permanent Supporter Profile Badge",
        "Custom Glory Boosting to rise to #1"
      ]
    },
    warlord: {
      id: "warlord",
      name: "WARLORD",
      price: 10,
      minGlory: 10,
      image: "assets/rank-warlord.jpg",
      color: "#00e5ff",
      rgb: "0, 229, 255",
      title: "Battle Commander",
      tagline: "Leading the frontlines into cosmic battle.",
      perks: [
        "Silver & Ice Blue Crest on Special Board",
        "Cyan highlighted card on the Special Board",
        "Battle Commander badge on profile",
        "Custom Glory Boosting to claim #1"
      ]
    },
    apex: {
      id: "apex",
      name: "APEX",
      price: 40,
      minGlory: 40,
      image: "assets/rank-apex.jpg",
      color: "#ffd700",
      rgb: "255, 215, 0",
      title: "Zenith Sovereign",
      popular: true,
      tagline: "Unrivaled warriors reaching the peak of cosmic power.",
      perks: [
        "Radiant Golden Crest on Special Board",
        "Top 3 Podium Spotlight Eligibility",
        "Golden Glowing Nameplate on Leaderboard",
        "Custom Glory Boosting to claim #1"
      ]
    },
    emperor: {
      id: "emperor",
      name: "EMPEROR",
      price: 100,
      minGlory: 100,
      image: "assets/rank-emperor.jpg",
      color: "#c742ff",
      rgb: "199, 66, 255",
      title: "Cosmic Overlord",
      supreme: true,
      tagline: "Supreme rulers who shape the destiny of DXZ.",
      perks: [
        "Mythic Violet Crest on Special Board",
        "Guaranteed Hero Section Spotlight Feature",
        "Permanent Cosmic Flame Border Animation",
        "Supreme Leaderboard Priority & Glory Boost"
      ]
    }
  };

  // Default seed supporters for instant rich display
  const DEFAULT_SUPPORTERS = [
    {
      id: "sup_seed_1",
      name: "Neeraj Saklani",
      rank: "emperor",
      glory: 5000,
      amount: 5000,
      faction: "Flame Devil",
      message: "Creator of DXZ. To the Beyond State! 🔥",
      createdAt: "2026-10-15T10:00:00Z"
    },
    {
      id: "sup_seed_2",
      name: "BSG_Vanguard",
      rank: "apex",
      glory: 1250,
      amount: 1250,
      faction: "Blue Shot Guild",
      message: "Protecting the Redago legacy at all costs.",
      createdAt: "2026-10-18T14:30:00Z"
    },
    {
      id: "sup_seed_3",
      name: "ShadowStrike",
      rank: "warlord",
      glory: 480,
      amount: 480,
      faction: "Shadow Syndicate",
      message: "Watch your back, Black Dagger.",
      createdAt: "2026-10-22T08:15:00Z"
    },
    {
      id: "sup_seed_4",
      name: "Detective_NJ",
      rank: "elite",
      glory: 250,
      amount: 250,
      faction: "Detective Division",
      message: "Redeemed with $10,000 crime syndicate bounties! 🕵️‍♂️",
      createdAt: "2026-10-25T19:00:00Z"
    },
    {
      id: "sup_seed_5",
      name: "CyberRonin_99",
      rank: "warlord",
      glory: 120,
      amount: 120,
      faction: "Independent Faction",
      message: "Glory to the fighters.",
      createdAt: "2026-10-28T11:20:00Z"
    }
  ];

  let supportersData = [];
  let activeFilter = "all";
  let currentSelectedRank = "elite";
  let currentUser = null;
  let pendingRankClaim = null;

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================
  document.addEventListener("DOMContentLoaded", () => {
    initAuthListener();
    initAuthModal();
    renderRankCards();
    loadSupportersFromDatabase();
    initSupporterModal();
  });

  // ==========================================================================
  // AUTHENTICATION MANAGEMENT
  // ==========================================================================
  function initAuthListener() {
    if (typeof firebase !== "undefined" && firebase.auth) {
      firebase.auth().onAuthStateChanged((user) => {
        currentUser = user;
        updateAuthUI(user);
        
        // Auto-fill inputs if supporter modal is open
        if (user) {
          const nameInput = document.getElementById("supporter-name-input");
          const emailInput = document.getElementById("supporter-email-input");
          if (nameInput && !nameInput.value) {
            nameInput.value = user.displayName || user.email.split("@")[0];
          }
          if (emailInput && !emailInput.value) {
            emailInput.value = user.email || "";
          }
        }
      });
    } else {
      // Local demo mode check
      const demoUser = localStorage.getItem("dxz_demo_user");
      if (demoUser) {
        try {
          currentUser = JSON.parse(demoUser);
          updateAuthUI(currentUser);
        } catch (e) {}
      } else {
        updateAuthUI(null);
      }
    }
  }

  function updateAuthUI(user) {
    const authBar = document.getElementById("supporter-auth-bar");
    if (!authBar) return;

    if (user) {
      const displayName = user.displayName || (user.email ? user.email.split("@")[0] : "Supporter");
      authBar.innerHTML = `
        <div class="auth-bar-logged-in">
          <div class="auth-user-chip">
            <span class="auth-status-dot online"></span>
            <div class="auth-user-meta">
              <span class="auth-greeting">Signed In As</span>
              <strong class="auth-username">${escapeHtml(displayName)}</strong>
              <span class="auth-email">(${escapeHtml(user.email || "")})</span>
            </div>
          </div>
          <div class="auth-actions">
            <span class="auth-verified-badge"><i class="fa-solid fa-circle-check"></i> Eligible to Claim Ranks</span>
            <button class="btn btn-sm btn-outline-danger" onclick="signOutSupporterUser()">
              <i class="fa-solid fa-arrow-right-from-bracket"></i> Sign Out
            </button>
          </div>
        </div>
      `;
    } else {
      authBar.innerHTML = `
        <div class="auth-bar-logged-out">
          <div class="auth-lock-info">
            <i class="fa-solid fa-shield-halved auth-lock-icon"></i>
            <div>
              <strong>Authentication Required to Claim Ranks</strong>
              <p>You can view ranks and the Special Board, but you must be logged in to claim a rank and link your profile to the leaderboard.</p>
            </div>
          </div>
          <button class="btn btn-outline-cyan auth-bar-btn" onclick="openAuthModal('login')">
            <i class="fa-solid fa-right-to-bracket"></i> Log In / Register
          </button>
        </div>
      `;
    }
  }

  // Claim click handler with strict authentication check
  window.handleClaimClick = function(rankId) {
    if (!currentUser) {
      pendingRankClaim = rankId;
      const rank = SUPPORTER_RANKS[rankId];
      const rankName = rank ? rank.name : "Rank";
      openAuthModal('login', `Please log in or register to claim the ${rankName} rank!`);
      return;
    }
    openSupporterModal(rankId);
  };

  // Auth Modal Management
  function initAuthModal() {
    const modal = document.getElementById("supporter-auth-modal");
    if (!modal) return;

    const closeBtn = document.getElementById("supporter-auth-close");
    const backdrop = document.getElementById("supporter-auth-backdrop");
    if (closeBtn) closeBtn.onclick = closeAuthModal;
    if (backdrop) backdrop.onclick = closeAuthModal;

    const loginForm = document.getElementById("supporter-login-form");
    if (loginForm) {
      loginForm.onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById("supporter-auth-email").value.trim();
        const pass = document.getElementById("supporter-auth-pass").value;
        const submitBtn = document.getElementById("supporter-login-submit");
        const alertBox = document.getElementById("supporter-auth-alert");

        if (alertBox) alertBox.style.display = "none";
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Signing In...`;
        }

        try {
          if (typeof firebase !== "undefined" && firebase.auth) {
            await firebase.auth().signInWithEmailAndPassword(email, pass);
          } else {
            // Local fallback
            currentUser = { uid: "usr_" + Date.now(), email: email, displayName: email.split("@")[0] };
            localStorage.setItem("dxz_demo_user", JSON.stringify(currentUser));
            updateAuthUI(currentUser);
          }
          closeAuthModal();
          
          if (pendingRankClaim) {
            const nextRank = pendingRankClaim;
            pendingRankClaim = null;
            setTimeout(() => openSupporterModal(nextRank), 300);
          }
        } catch (err) {
          if (alertBox) {
            alertBox.textContent = err.message || "Failed to sign in. Please verify your credentials.";
            alertBox.style.display = "block";
          }
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> Sign In`;
          }
        }
      };
    }

    const regForm = document.getElementById("supporter-register-form");
    if (regForm) {
      regForm.onsubmit = async (e) => {
        e.preventDefault();
        const name = document.getElementById("supporter-reg-name").value.trim();
        const email = document.getElementById("supporter-reg-email").value.trim();
        const pass = document.getElementById("supporter-reg-pass").value;
        const submitBtn = document.getElementById("supporter-reg-submit");
        const alertBox = document.getElementById("supporter-auth-alert");

        if (alertBox) alertBox.style.display = "none";
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Creating Account...`;
        }

        try {
          if (typeof firebase !== "undefined" && firebase.auth) {
            const cred = await firebase.auth().createUserWithEmailAndPassword(email, pass);
            await cred.user.updateProfile({ displayName: name });
            if (firebase.firestore) {
              await firebase.firestore().collection("members").doc(cred.user.uid).set({
                uid: cred.user.uid,
                email: email,
                displayName: name,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
              }).catch(() => {});
            }
          } else {
            currentUser = { uid: "usr_" + Date.now(), email: email, displayName: name };
            localStorage.setItem("dxz_demo_user", JSON.stringify(currentUser));
            updateAuthUI(currentUser);
          }
          closeAuthModal();

          if (pendingRankClaim) {
            const nextRank = pendingRankClaim;
            pendingRankClaim = null;
            setTimeout(() => openSupporterModal(nextRank), 300);
          }
        } catch (err) {
          if (alertBox) {
            alertBox.textContent = err.message || "Registration failed. Try again with a stronger password.";
            alertBox.style.display = "block";
          }
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i class="fa-solid fa-user-plus"></i> Create Account`;
          }
        }
      };
    }
  }

  window.openAuthModal = function(mode, customNotice) {
    const modal = document.getElementById("supporter-auth-modal");
    if (!modal) return;

    const noticeEl = document.getElementById("supporter-auth-custom-notice");
    if (noticeEl) {
      if (customNotice) {
        noticeEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${escapeHtml(customNotice)}`;
        noticeEl.style.display = "block";
      } else {
        noticeEl.style.display = "none";
      }
    }

    const alertBox = document.getElementById("supporter-auth-alert");
    if (alertBox) alertBox.style.display = "none";

    switchAuthMode(mode || 'login');
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  window.closeAuthModal = function() {
    const modal = document.getElementById("supporter-auth-modal");
    if (modal) modal.classList.remove("active");
    document.body.style.overflow = "";
  };

  window.switchAuthMode = function(mode) {
    const tabLogin = document.getElementById("auth-tab-login");
    const tabReg = document.getElementById("auth-tab-reg");
    const loginForm = document.getElementById("supporter-login-form");
    const regForm = document.getElementById("supporter-register-form");

    if (mode === 'register') {
      if (tabLogin) tabLogin.classList.remove("active");
      if (tabReg) tabReg.classList.add("active");
      if (loginForm) loginForm.style.display = "none";
      if (regForm) regForm.style.display = "block";
    } else {
      if (tabLogin) tabLogin.classList.add("active");
      if (tabReg) tabReg.classList.remove("active");
      if (loginForm) loginForm.style.display = "block";
      if (regForm) regForm.style.display = "none";
    }
  };

  window.signOutSupporterUser = async function() {
    if (confirm("Are you sure you want to sign out?")) {
      if (typeof firebase !== "undefined" && firebase.auth) {
        await firebase.auth().signOut().catch(() => {});
      }
      localStorage.removeItem("dxz_demo_user");
      currentUser = null;
      updateAuthUI(null);
    }
  };

  // ==========================================================================
  // RENDER 4 RANK CARDS (MINIMAL & RESPONSIVE)
  // ==========================================================================
  function renderRankCards() {
    const container = document.getElementById("ranks-showcase-grid");
    if (!container) return;

    const ranksArray = [
      SUPPORTER_RANKS.elite,
      SUPPORTER_RANKS.warlord,
      SUPPORTER_RANKS.apex,
      SUPPORTER_RANKS.emperor
    ];

    container.innerHTML = ranksArray.map(rank => {
      const isElite = rank.id === "elite";
      const isPopular = rank.popular;
      const isSupreme = rank.supreme;

      return `
        <div class="rank-card ${rank.id}-card" data-rank="${rank.id}">
          <div class="rank-card-glow" style="background: radial-gradient(circle, rgba(${rank.rgb}, 0.28) 0%, transparent 70%);"></div>

          ${isSupreme ? '<div class="rank-card-pill supreme"><i class="fa-solid fa-crown"></i> SUPREME OVERLORD</div>' : ''}
          ${isPopular ? '<div class="rank-card-pill popular"><i class="fa-solid fa-fire"></i> MOST POPULAR</div>' : ''}

          <div class="rank-crest-wrapper">
            <img src="${rank.image}" alt="${rank.name} Crest" class="rank-crest-img">
          </div>

          <div class="rank-header">
            <h3 class="rank-name" style="color: ${rank.color};">${rank.name}</h3>
            <span class="rank-title">${rank.title}</span>
            <p class="rank-tagline">${rank.tagline}</p>
          </div>

          <div class="rank-pricing-block">
            <div class="rank-price-main">
              <span class="currency">₹</span><span class="amount">${rank.price}</span>
            </div>
            ${isElite ? `
              <div class="rank-lore-cash-tag" title="Can also be claimed using in-game cash from Detective NJ!">
                <i class="fa-solid fa-gamepad"></i> OR <strong>$10,000</strong> Lore Game Cash
              </div>
            ` : `
              <div class="rank-glory-tag">
                <i class="fa-solid fa-bolt"></i> Grants <strong>${rank.minGlory}</strong> Glory Points Base
              </div>
            `}
          </div>

          <div class="glory-rule-callout">
            <i class="fa-solid fa-angles-up" style="color: ${rank.color};"></i>
            <span>Contribute <strong>above ₹${rank.price}</strong> anytime to gain extra Glory &amp; reach #1!</span>
          </div>

          <ul class="rank-perks-list">
            ${rank.perks.map(perk => `
              <li><i class="fa-solid fa-circle-check" style="color: ${rank.color};"></i> <span>${perk}</span></li>
            `).join('')}
          </ul>

          <button class="btn rank-claim-btn" onclick="handleClaimClick('${rank.id}')" style="background: linear-gradient(135deg, ${rank.color}, rgba(${rank.rgb}, 0.7));">
            <i class="fa-solid fa-shield-halved"></i> Claim ${rank.name}
          </button>
        </div>
      `;
    }).join('');
  }

  // ==========================================================================
  // FETCH & SYNC SUPPORTERS (FIRESTORE + SEED FALLBACK)
  // ==========================================================================
  window.loadSupportersFromDatabase = function() {
    if (typeof firebase !== "undefined" && firebase.firestore) {
      const db = firebase.firestore();
      db.collection("supporters")
        .orderBy("glory", "desc")
        .limit(100)
        .onSnapshot((snapshot) => {
          const list = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            list.push({
              id: doc.id,
              name: data.name || "Anonymous",
              rank: data.rank || "elite",
              glory: Number(data.glory) || 0,
              amount: Number(data.amount) || 0,
              faction: data.faction || "Independent Faction",
              message: data.message || "",
              createdAt: data.createdAt ? (data.createdAt.toDate ? data.createdAt.toDate().toISOString() : data.createdAt) : new Date().toISOString()
            });
          });

          // Merge with DEFAULT_SUPPORTERS to ensure rich visual leaderboard
          const merged = [...list];
          DEFAULT_SUPPORTERS.forEach(seed => {
            if (!merged.find(item => item.id === seed.id || item.name.toLowerCase() === seed.name.toLowerCase())) {
              merged.push(seed);
            }
          });

          // Sort descending by Glory Points
          merged.sort((a, b) => b.glory - a.glory);
          supportersData = merged;
          renderLeaderboard();
          updateHeroSpotlight();
        }, (error) => {
          console.warn("Firestore Supporters listener notice (using seed cache):", error);
          loadLocalSupporters();
        });
    } else {
      loadLocalSupporters();
    }
  };

  function loadLocalSupporters() {
    const stored = localStorage.getItem("dxz_supporters");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        supportersData = [...parsed, ...DEFAULT_SUPPORTERS].sort((a, b) => b.glory - a.glory);
      } catch (e) {
        supportersData = [...DEFAULT_SUPPORTERS];
      }
    } else {
      supportersData = [...DEFAULT_SUPPORTERS];
    }
    renderLeaderboard();
    updateHeroSpotlight();
  }

  // ==========================================================================
  // LEADERBOARD & PODIUM RENDERING
  // ==========================================================================
  function renderLeaderboard() {
    const podiumContainer = document.getElementById("supporters-podium-container");
    const tableBody = document.getElementById("supporters-leaderboard-body");
    if (!podiumContainer || !tableBody) return;

    // Filter by rank if selected
    const filtered = activeFilter === "all" 
      ? supportersData 
      : supportersData.filter(s => (s.rank || "").toLowerCase() === activeFilter.toLowerCase());

    // 1. Render Top 3 Podium
    const topThree = filtered.slice(0, 3);
    const podiumPlaces = [
      { pos: 2, label: "2ND PLACE", class: "second-place", icon: "fa-medal" },
      { pos: 1, label: "1ST PLACE - SUPREME", class: "first-place", icon: "fa-crown" },
      { pos: 3, label: "3RD PLACE", class: "third-place", icon: "fa-award" }
    ];

    podiumContainer.innerHTML = podiumPlaces.map(p => {
      const idx = p.pos - 1;
      const supporter = topThree[idx];
      if (supporter) {
        const rankInfo = SUPPORTER_RANKS[supporter.rank] || SUPPORTER_RANKS.elite;
        return `
          <div class="podium-card ${p.class}">
            <div class="podium-crown"><i class="fa-solid ${p.icon}"></i> ${p.label}</div>
            <div class="podium-crest-box">
              <img src="${rankInfo.image}" alt="${rankInfo.name}" class="podium-crest-img">
            </div>
            <h4 class="podium-name">${escapeHtml(supporter.name)}</h4>
            <div class="podium-faction">${escapeHtml(supporter.faction || "Faction Member")}</div>
            <div class="podium-glory" style="color: ${rankInfo.color};">
              <i class="fa-solid fa-bolt"></i> ${(supporter.glory || 0).toLocaleString('en-IN')} GLORY
            </div>
            ${supporter.message ? `<p class="podium-quote">"${escapeHtml(supporter.message)}"</p>` : ''}
          </div>
        `;
      } else {
        return `
          <div class="podium-card ${p.class} empty-podium">
            <div class="podium-crown"><i class="fa-solid ${p.icon}"></i> ${p.label}</div>
            <div class="podium-crest-placeholder"><i class="fa-solid fa-lock"></i></div>
            <h4 style="color:var(--text-muted); font-size: 0.9rem;">Vacant Rank</h4>
            <p style="font-size: 0.75rem; color: var(--text-muted);">Contribute Glory to claim this spot!</p>
          </div>
        `;
      }
    }).join('');

    // 2. Render Full Ranked Table
    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          <i class="fa-solid fa-shield-halved" style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--color-blue-neon);"></i>
          <p>No supporters found in this category yet. Be the first to claim this rank!</p>
        </div>
      `;
      return;
    }

    let rowsHtml = filtered.map((supporter, idx) => {
      const rankInfo = SUPPORTER_RANKS[supporter.rank] || SUPPORTER_RANKS.elite;
      const rankNum = idx + 1;
      let badgeClass = "badge-number";
      if (rankNum === 1) badgeClass += " top-1";
      else if (rankNum === 2) badgeClass += " top-2";
      else if (rankNum === 3) badgeClass += " top-3";

      const formattedGlory = (supporter.glory || 0).toLocaleString('en-IN');
      const isLoreRedeemed = supporter.paymentMethod === "lore_cash";

      return `
        <tr class="supporter-row">
          <td class="col-rank">
            <span class="${badgeClass}">#${rankNum}</span>
          </td>
          <td class="col-user">
            <div class="supporter-name-box">
              <strong class="supporter-name">${escapeHtml(supporter.name)}</strong>
              ${supporter.message ? `<div class="supporter-lore-msg">"${escapeHtml(supporter.message)}"</div>` : ''}
            </div>
          </td>
          <td class="col-tier">
            <div class="tier-cell">
              <img src="${rankInfo.image}" alt="${rankInfo.name}" class="table-crest-thumb">
              <span class="table-rank-pill" style="color: ${rankInfo.color}; border: 1px solid rgba(${rankInfo.rgb}, 0.3); background: rgba(${rankInfo.rgb}, 0.1);">
                ${rankInfo.name}
              </span>
            </div>
          </td>
          <td class="col-faction">
            <span class="supporter-faction-tag">${escapeHtml(supporter.faction || "Independent")}</span>
            ${isLoreRedeemed ? '<span class="lore-cash-chip" title="Unlocked using $10k Detective NJ bounty cash!"><i class="fa-solid fa-gamepad"></i> Game Cash</span>' : ''}
          </td>
          <td class="col-glory" style="text-align: right;">
            <div class="glory-number" style="color: ${rankInfo.color}; font-weight: 800; font-family: var(--font-display);">
              <i class="fa-solid fa-bolt"></i> ${formattedGlory}
            </div>
          </td>
        </tr>
      `;
    }).join('');

    tableBody.innerHTML = `
      <div class="supporters-table-wrap">
        <table class="supporters-table">
          <thead>
            <tr>
              <th style="width: 70px;">Rank</th>
              <th>Supporter</th>
              <th>Rank Tier</th>
              <th>Faction</th>
              <th style="text-align: right;">Glory Points</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;
  }

  // Update Hero Spotlight if element exists (on index.html)
  function updateHeroSpotlight() {
    if (!supportersData || supportersData.length === 0) return;
    const topSupporter = supportersData[0];
    const rankInfo = SUPPORTER_RANKS[topSupporter.rank] || SUPPORTER_RANKS.emperor;

    const crestEl = document.getElementById("hero-spotlight-crest");
    const nameEl = document.getElementById("hero-spotlight-name");
    const gloryEl = document.getElementById("hero-spotlight-glory");
    const rankEl = document.getElementById("hero-spotlight-rank");

    if (crestEl) crestEl.src = rankInfo.image;
    if (nameEl) nameEl.textContent = topSupporter.name;
    if (gloryEl) gloryEl.innerHTML = `<i class="fa-solid fa-bolt"></i> ${(topSupporter.glory || 0).toLocaleString('en-IN')} Glory Points`;
    if (rankEl) {
      rankEl.textContent = `${rankInfo.name} RANK`;
      rankEl.style.background = `linear-gradient(135deg, ${rankInfo.color}, rgba(${rankInfo.rgb}, 0.6))`;
    }
  }

  // Filter Buttons
  window.filterSupporters = function(rankKey, btnEl) {
    activeFilter = rankKey;
    document.querySelectorAll(".board-filter-btn").forEach(btn => btn.classList.remove("active"));
    if (btnEl) btnEl.classList.add("active");
    renderLeaderboard();
  };

  // ==========================================================================
  // SUPPORTER PURCHASE / REDEMPTION MODAL
  // ==========================================================================
  function initSupporterModal() {
    const modal = document.getElementById("supporter-modal");
    if (!modal) return;

    const closeBtn = document.getElementById("supporter-modal-close");
    const backdrop = document.getElementById("supporter-modal-backdrop");
    if (closeBtn) closeBtn.onclick = closeSupporterModal;
    if (backdrop) backdrop.onclick = closeSupporterModal;

    const amountInput = document.getElementById("supporter-amount-input");
    if (amountInput) {
      amountInput.addEventListener("input", updateGloryPreview);
    }
  }

  window.openSupporterModal = function(rankId) {
    // Enforce Login Gate
    if (!currentUser) {
      pendingRankClaim = rankId;
      openAuthModal('login', `Please log in to claim this rank.`);
      return;
    }

    currentSelectedRank = rankId || "elite";
    const rank = SUPPORTER_RANKS[currentSelectedRank] || SUPPORTER_RANKS.elite;
    const modal = document.getElementById("supporter-modal");
    if (!modal) return;

    // Set modal details
    document.getElementById("modal-crest-img").src = rank.image;
    document.getElementById("modal-rank-name").textContent = rank.name;
    document.getElementById("modal-rank-name").style.color = rank.color;
    document.getElementById("modal-rank-title").textContent = rank.title;
    document.getElementById("modal-base-price").textContent = `Base Plan: ₹${rank.price}`;

    // Pre-fill user profile fields
    const nameInput = document.getElementById("supporter-name-input");
    const emailInput = document.getElementById("supporter-email-input");
    if (nameInput) nameInput.value = currentUser.displayName || (currentUser.email ? currentUser.email.split("@")[0] : "");
    if (emailInput) emailInput.value = currentUser.email || "";

    const amountInput = document.getElementById("supporter-amount-input");
    amountInput.min = rank.price;
    amountInput.value = rank.price;

    // Lore Game Cash Check ($10,000 for Elite)
    const loreCashSection = document.getElementById("lore-cash-tab-btn");
    const savedLoreState = localStorage.getItem('dxz_detective_nj_game_state_v2.6.0');
    let gameWalletBalance = 0;
    if (savedLoreState) {
      try {
        const parsed = JSON.parse(savedLoreState);
        gameWalletBalance = parsed.walletBalance || 0;
      } catch (e) {}
    }

    const loreBalanceDisplay = document.getElementById("lore-wallet-balance-num");
    if (loreBalanceDisplay) {
      loreBalanceDisplay.textContent = `$${gameWalletBalance.toLocaleString('en-IN')}`;
    }

    if (currentSelectedRank === "elite") {
      if (loreCashSection) loreCashSection.style.display = "inline-flex";
      const claimLoreBtn = document.getElementById("claim-lore-cash-btn");
      if (claimLoreBtn) {
        if (gameWalletBalance >= 10000) {
          claimLoreBtn.disabled = false;
          claimLoreBtn.innerHTML = `<i class="fa-solid fa-check-circle"></i> Redeem 10,000$ Game Cash (Instant Claim)`;
          claimLoreBtn.classList.remove("disabled");
        } else {
          claimLoreBtn.disabled = true;
          claimLoreBtn.innerHTML = `<i class="fa-solid fa-lock"></i> Need $10,000 Lore Cash (You have $${gameWalletBalance})`;
          claimLoreBtn.classList.add("disabled");
        }
      }
    } else {
      if (loreCashSection) loreCashSection.style.display = "none";
      switchPaymentTab('razorpay');
    }

    updateGloryPreview();
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  window.closeSupporterModal = function() {
    const modal = document.getElementById("supporter-modal");
    if (modal) modal.classList.remove("active");
    document.body.style.overflow = "";
  };

  window.addExtraGlory = function(extraAmount) {
    const input = document.getElementById("supporter-amount-input");
    if (!input) return;
    const current = parseFloat(input.value) || 0;
    input.value = Math.max(0, current + extraAmount);
    updateGloryPreview();
  };

  function updateGloryPreview() {
    const rank = SUPPORTER_RANKS[currentSelectedRank] || SUPPORTER_RANKS.elite;
    const input = document.getElementById("supporter-amount-input");
    const previewEl = document.getElementById("modal-glory-preview");
    if (!input || !previewEl) return;

    const val = parseFloat(input.value) || 0;
    const calculatedGlory = Math.max(rank.minGlory, Math.round(val));

    previewEl.innerHTML = `<i class="fa-solid fa-bolt" style="color:#ffd700;"></i> <strong>${calculatedGlory.toLocaleString('en-IN')}</strong> GLORY POINTS`;
  }

  window.switchPaymentTab = function(tabName) {
    const rzpBtn = document.getElementById("pay-tab-razorpay");
    const loreBtn = document.getElementById("lore-cash-tab-btn");
    const rzpPanel = document.getElementById("razorpay-pay-box");
    const lorePanel = document.getElementById("lore-cash-pay-box");

    if (tabName === "lore") {
      if (rzpBtn) rzpBtn.classList.remove("active");
      if (loreBtn) loreBtn.classList.add("active");
      if (rzpPanel) rzpPanel.style.display = "none";
      if (lorePanel) lorePanel.style.display = "block";
    } else {
      if (rzpBtn) rzpBtn.classList.add("active");
      if (loreBtn) loreBtn.classList.remove("active");
      if (rzpPanel) rzpPanel.style.display = "block";
      if (lorePanel) lorePanel.style.display = "none";
    }
  };

  // ==========================================================================
  // PAYMENT HANDLER 1: RAZORPAY UPI / CARDS
  // ==========================================================================
  window.submitRazorpaySupporter = function() {
    if (!currentUser) {
      alert("You must be signed in to complete your rank claim.");
      openAuthModal('login');
      return;
    }

    const rank = SUPPORTER_RANKS[currentSelectedRank] || SUPPORTER_RANKS.elite;
    const name = document.getElementById("supporter-name-input").value.trim();
    const email = document.getElementById("supporter-email-input").value.trim();
    const faction = document.getElementById("supporter-faction-input").value.trim() || "Independent Faction";
    const message = document.getElementById("supporter-message-input").value.trim();
    const amountVal = parseFloat(document.getElementById("supporter-amount-input").value) || rank.price;

    if (!name) {
      alert("Please enter your Supporter Name / Gamer Tag!");
      return;
    }
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address for receipt!");
      return;
    }
    if (amountVal < rank.price) {
      alert(`Minimum contribution for ${rank.name} is ₹${rank.price}.`);
      return;
    }

    const calculatedGlory = Math.max(rank.minGlory, Math.round(amountVal));
    const amountPaise = Math.round(amountVal * 100);

    const options = {
      key: "rzp_live_T113tFIoQSy60O",
      amount: amountPaise,
      currency: "INR",
      name: "The BlueShot Faction",
      description: `${rank.name} Rank Patronage (${calculatedGlory} Glory Points)`,
      image: "https://blueshot.online/assets/favicon.png",
      prefill: {
        name: name,
        email: email
      },
      theme: {
        color: rank.color
      },
      handler: function(response) {
        completeSupporterRegistration({
          paymentId: response.razorpay_payment_id,
          paymentMethod: "razorpay",
          userId: currentUser.uid,
          userEmail: currentUser.email,
          name: name,
          email: email,
          rank: rank.id,
          amount: amountVal,
          glory: calculatedGlory,
          faction: faction,
          message: message
        });
      }
    };

    if (typeof Razorpay !== "undefined") {
      const rzp = new Razorpay(options);
      rzp.open();
    } else {
      alert("Razorpay gateway is initializing, please try again in a moment.");
    }
  };

  // ==========================================================================
  // PAYMENT HANDLER 2: REDEEM LORE GAME CASH ($10,000 FOR ELITE)
  // ==========================================================================
  window.redeemLoreCashSupporter = function() {
    if (!currentUser) {
      alert("You must be signed in to redeem your lore game cash.");
      openAuthModal('login');
      return;
    }

    if (currentSelectedRank !== "elite") return;

    const name = document.getElementById("supporter-name-input").value.trim();
    const email = document.getElementById("supporter-email-input").value.trim() || currentUser.email;
    const faction = document.getElementById("supporter-faction-input").value.trim() || "Detective NJ Squad";
    const message = document.getElementById("supporter-message-input").value.trim() || "Redeemed with $10,000 Detective NJ bounty cash!";

    if (!name) {
      alert("Please enter your Supporter Name / Gamer Tag!");
      return;
    }

    const STORAGE_KEY = 'dxz_detective_nj_game_state_v2.6.0';
    const saved = localStorage.getItem(STORAGE_KEY);
    let state = null;
    try {
      state = saved ? JSON.parse(saved) : null;
    } catch (e) {}

    if (!state || (state.walletBalance || 0) < 10000) {
      alert("Insufficient Lore Game Cash! You need at least $10,000 from the Detective NJ Mystery Game.");
      return;
    }

    // Deduct $10,000 from Detective NJ wallet
    state.walletBalance -= 10000;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    const paymentId = "LORE_CASH_" + Date.now().toString(36).toUpperCase();
    completeSupporterRegistration({
      paymentId: paymentId,
      paymentMethod: "lore_cash",
      userId: currentUser.uid,
      userEmail: currentUser.email,
      name: name,
      email: email,
      rank: "elite",
      amount: 5,
      glory: 100, // 100 Glory points reward for $10k lore cash!
      faction: faction,
      message: message
    });
  };

  // ==========================================================================
  // SUCCESSFUL REGISTRATION & FIRESTORE STORAGE
  // ==========================================================================
  function completeSupporterRegistration(data) {
    data.createdAt = new Date().toISOString();

    // 1. Save to local storage
    const local = JSON.parse(localStorage.getItem("dxz_supporters") || "[]");
    local.unshift(data);
    localStorage.setItem("dxz_supporters", JSON.stringify(local));

    // 2. Save to Firestore collection 'supporters'
    if (typeof firebase !== "undefined" && firebase.firestore) {
      const db = firebase.firestore();
      db.collection("supporters").doc(data.paymentId).set({
        ...data,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        console.log("Supporter saved to Firestore successfully!");
      }).catch(err => {
        console.warn("Firestore supporter write notice:", err);
      });
    }

    // 3. Close modal & re-render board
    closeSupporterModal();
    window.loadSupportersFromDatabase();

    // 4. Show Celebration Alert
    showSupporterCelebration(data);
  }

  function showSupporterCelebration(data) {
    const rank = SUPPORTER_RANKS[data.rank] || SUPPORTER_RANKS.elite;
    alert(`🎉 CONGRATULATIONS ${data.name.toUpperCase()}!\n\nYou have officially unlocked the ${rank.name} RANK with ${data.glory} Glory Points!\n\nYour profile has been immortalized on the global Special Board.`);
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

})();
