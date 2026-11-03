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
    renderMergedRankBoards();
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

  // 1. ORDER OF RANKS (DESCENDING: EMPEROR -> APEX -> WARLORD -> ELITE)
  const RANK_ORDER = ["emperor", "apex", "warlord", "elite"];

  // ==========================================================================
  // MERGED RANK SHOP & SPECIAL LEADERBOARD RENDERING
  // ==========================================================================
  function renderMergedRankBoards() {
    const container = document.getElementById("merged-rank-boards");
    if (!container) return;

    container.innerHTML = RANK_ORDER.map(rankId => {
      const rank = SUPPORTER_RANKS[rankId];
      if (!rank) return "";

      const isElite = rank.id === "elite";
      const isEmperor = rank.id === "emperor";

      // Filter supporters belonging to this specific rank tier, sorted descending by glory
      const tierSupporters = supportersData
        .filter(s => (s.rank || "").toLowerCase() === rankId)
        .sort((a, b) => (b.glory || 0) - (a.glory || 0));

      // Guarantee at least 3 entries (1., 2., 3.) plus any extra supporters
      const totalEntriesToShow = Math.max(3, tierSupporters.length);
      const entriesHtml = [];

      for (let i = 0; i < totalEntriesToShow; i++) {
        const pos = i + 1;
        const supporter = tierSupporters[i];

        let posClass = "entry-rank-pos";
        let rowClass = "tier-board-entry";
        if (pos === 1) {
          posClass += " top-1";
          rowClass += " top-1";
        } else if (pos === 2) {
          posClass += " top-2";
          rowClass += " top-2";
        } else if (pos === 3) {
          posClass += " top-3";
          rowClass += " top-3";
        }

        if (supporter) {
          const isLorePaid = supporter.paymentMethod === "lore_cash";
          const formattedGlory = (supporter.glory || 0).toLocaleString('en-IN');
          entriesHtml.push(`
            <div class="${rowClass}">
              <div class="${posClass}">${pos}.</div>
              <div class="entry-supporter-main">
                <div class="entry-supporter-header-row">
                  <span class="entry-supporter-name">${escapeHtml(supporter.name)}</span>
                  ${supporter.faction ? `<span class="entry-faction-tag">${escapeHtml(supporter.faction)}</span>` : ''}
                  ${isLorePaid ? '<span class="lore-cash-chip" title="Claimed with $10k game cash!"><i class="fa-solid fa-gamepad"></i> Game Cash</span>' : ''}
                </div>
                ${supporter.message ? `<div class="entry-supporter-quote">"${escapeHtml(supporter.message)}"</div>` : ''}
              </div>
              <div class="entry-glory-side">
                <div class="entry-glory-value" style="color: ${rank.color};">
                  <i class="fa-solid fa-bolt"></i> ${formattedGlory} GLORY
                </div>
              </div>
            </div>
          `);
        } else {
          // Vacant slot so 1., 2., 3. are always displayed
          entriesHtml.push(`
            <div class="${rowClass} vacant-entry">
              <div class="${posClass}">${pos}.</div>
              <div class="entry-supporter-main">
                <div class="entry-vacant-text">
                  <i class="fa-solid fa-shield-halved" style="color: ${rank.color};"></i>
                  <span>Vacant Rank Spot — Claim to be #${pos} ${rank.name}!</span>
                </div>
              </div>
              <div class="entry-glory-side">
                <button type="button" class="btn-claim-vacant-spot" onclick="handleClaimClick('${rank.id}')">
                  <i class="fa-solid fa-plus"></i> Claim #${pos} Spot
                </button>
              </div>
            </div>
          `);
        }
      }

      return `
        <section class="rank-tier-board-section ${rank.id}-tier-board" id="tier-board-${rank.id}">
          <div class="tier-glow-accent" style="background: ${rank.color};"></div>

          <!-- Header: Rank Identity + [BUY] Button -->
          <div class="tier-board-header">
            <div class="tier-board-identity">
              <div class="tier-crest-wrap">
                <img src="${rank.image}" alt="${rank.name} Crest" class="tier-crest-img">
              </div>
              <div class="tier-identity-text">
                <div class="tier-badge-row">
                  <span class="tier-rank-badge ${rank.id}-badge">${isEmperor ? 'SUPREME OVERLORD' : (rank.popular ? 'POPULAR TIER' : 'FACTION TIER')}</span>
                  <span class="tier-rank-title">${rank.title}</span>
                </div>
                <h2 class="tier-rank-name" style="color: ${rank.color};">${rank.name}</h2>
                <div class="tier-price-row">
                  <span class="tier-price-highlight">Base: ₹${rank.price}</span>
                  ${isElite ? `
                    <span>or</span>
                    <span class="tier-lore-cash-tag"><i class="fa-solid fa-gamepad"></i> $10,000 Lore Game Cash</span>
                  ` : `
                    <span>· Grants ${rank.minGlory}+ Glory Points (₹1 = 1 Glory)</span>
                  `}
                </div>
              </div>
            </div>

            <!-- BUY Button -->
            <div class="tier-board-actions">
              <button class="btn btn-tier-buy ${rank.id}-buy-btn" onclick="handleClaimClick('${rank.id}')">
                <i class="fa-solid fa-shield-halved"></i> BUY ${rank.name} · ₹${rank.price}
              </button>
            </div>
          </div>

          <!-- Leaderboard Area (1. 2. 3. ...) -->
          <div class="tier-leaderboard-area">
            <div class="tier-leaderboard-subhead">
              <span><i class="fa-solid fa-trophy" style="color: ${rank.color};"></i> ${rank.name} SPECIAL BOARD</span>
              <span>Ranked by Glory Points</span>
            </div>
            <div class="tier-entries-list">
              ${entriesHtml.join('')}
            </div>
          </div>
        </section>
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
          renderMergedRankBoards();
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
    renderMergedRankBoards();
    updateHeroSpotlight();
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
    renderMergedRankBoards();
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
