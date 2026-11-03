// ==========================================================================
// DXZ SUPPORTERS & GLOBAL RANK SYSTEM
// Handles Rank Purchases (Razorpay & Lore Game Cash), Glory Boosting,
// and Live Leaderboard / Special Board Synchronization.
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
      tagline: "The foundation of the resistance.",
      perks: [
        "Official Bronze Crest on Global Board",
        "Unlock with ₹5 OR $10,000 Lore Game Cash",
        "Permanent Supporter Profile Badge",
        "Custom Glory Boosting to rise in rank"
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
        "Silver & Ice Blue Crest on Global Board",
        "Cyan highlighted card on the Special Board",
        "Faction Commander badge on profile",
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
      tagline: "Unrivaled warriors reaching the peak of power.",
      perks: [
        "Radiant Golden Crest on Global Board",
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
        "Mythic Violet Crest on Global Board",
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
      faction: "East Empire",
      message: "Standing firm against Kraven and the Abyss.",
      createdAt: "2026-10-20T14:30:00Z"
    },
    {
      id: "sup_seed_3",
      name: "ShadowDagger",
      rank: "warlord",
      glory: 600,
      amount: 600,
      faction: "Dark Magic",
      message: "Dominance through sheer will.",
      createdAt: "2026-10-24T18:00:00Z"
    },
    {
      id: "sup_seed_4",
      name: "Detective_NJ_Ace",
      rank: "elite",
      glory: 150,
      amount: 150,
      faction: "Investigator",
      paymentMethod: "lore_cash",
      message: "Bounty cashed in from solved mysteries! 🕵️‍♂️",
      createdAt: "2026-10-28T12:15:00Z"
    }
  ];

  let currentSelectedRank = "elite";
  let activeFilter = "all";
  let loadedSupporters = [];

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================
  document.addEventListener("DOMContentLoaded", () => {
    initSupportersSection();
    loadSupportersFromDatabase();
    initSupporterModal();
  });

  // ==========================================================================
  // RENDER RANKS GRID IN SUPPORTERS SECTION
  // ==========================================================================
  function initSupportersSection() {
    const grid = document.getElementById("ranks-showcase-grid");
    if (!grid) return;

    grid.innerHTML = Object.values(SUPPORTER_RANKS).map(rank => {
      const isElite = rank.id === "elite";
      const badgePill = rank.supreme 
        ? `<span class="rank-card-pill supreme"><i class="fa-solid fa-crown"></i> SUPREME RANK</span>`
        : rank.popular 
        ? `<span class="rank-card-pill popular"><i class="fa-solid fa-fire"></i> MOST POPULAR</span>`
        : '';

      return `
        <div class="rank-card ${rank.id}-card" data-rank="${rank.id}">
          <div class="rank-card-glow" style="background: radial-gradient(circle, rgba(${rank.rgb}, 0.22) 0%, transparent 70%);"></div>
          ${badgePill}
          
          <div class="rank-crest-wrapper">
            <img src="${rank.image}" alt="${rank.name} Crest" class="rank-crest-img">
          </div>

          <div class="rank-header">
            <span class="rank-badge-tag" style="background: rgba(${rank.rgb}, 0.15); color: ${rank.color}; border: 1px solid rgba(${rank.rgb}, 0.35);">
              ${rank.title}
            </span>
            <h3 class="rank-title" style="color: #fff; text-shadow: 0 0 15px rgba(${rank.rgb}, 0.5);">${rank.name}</h3>
            <p class="rank-tagline">${rank.tagline}</p>
          </div>

          <div class="rank-pricing-box">
            <div class="rank-main-price">
              <span class="currency">₹</span><span class="price-val">${rank.price}</span>
            </div>
            ${isElite ? `
              <div class="rank-lore-cash-tag" title="Can also be claimed using in-game cash from Detective NJ!">
                <i class="fa-solid fa-gamepad"></i> OR <strong>$10,000</strong> Lore Game Cash
              </div>
            ` : `
              <div class="rank-glory-boost-hint">
                <i class="fa-solid fa-bolt"></i> Grants <strong>${rank.minGlory}+</strong> Base Glory
              </div>
            `}
          </div>

          <ul class="rank-perks-list">
            ${rank.perks.map(p => `<li><i class="fa-solid fa-check" style="color: ${rank.color};"></i> ${p}</li>`).join("")}
          </ul>

          <button class="btn rank-claim-btn" onclick="openSupporterModal('${rank.id}')" style="background: linear-gradient(135deg, ${rank.color}, rgba(${rank.rgb}, 0.7));">
            <i class="fa-solid fa-shield-halved"></i> Claim ${rank.name}
          </button>
        </div>
      `;
    }).join("");
  }

  // ==========================================================================
  // DATABASE / FIRESTORE LOADER & LEADERBOARD SYNC
  // ==========================================================================
  window.loadSupportersFromDatabase = function() {
    const listContainer = document.getElementById("supporters-leaderboard-body");
    if (!listContainer) return;

    listContainer.innerHTML = `<div style="text-align:center; padding: 3rem; color:var(--text-muted);"><i class="fa-solid fa-spinner fa-spin fa-2x"></i><p style="margin-top:0.75rem;">Loading Special Supporter Board...</p></div>`;

    if (typeof firebase !== "undefined" && firebase.firestore) {
      const db = firebase.firestore();
      db.collection("supporters")
        .orderBy("glory", "desc")
        .limit(100)
        .get()
        .then((snapshot) => {
          const list = [];
          snapshot.forEach(doc => {
            const data = doc.data();
            list.push({ ...data, id: doc.id });
          });

          // Fallback / merge local and seed supporters if Firestore collection has few items
          const localStored = JSON.parse(localStorage.getItem("dxz_supporters") || "[]");
          const mergedMap = new Map();
          
          DEFAULT_SUPPORTERS.forEach(s => mergedMap.set(s.name.toLowerCase(), s));
          localStored.forEach(s => mergedMap.set(s.name.toLowerCase(), s));
          list.forEach(s => mergedMap.set(s.name.toLowerCase(), s));

          loadedSupporters = Array.from(mergedMap.values()).sort((a, b) => (b.glory || 0) - (a.glory || 0));
          renderLeaderboard();
          updateHeroSpotlight();
        })
        .catch(err => {
          console.warn("Firestore supporters read error, using fallback seed:", err);
          fallbackToLocalStorage();
        });
    } else {
      fallbackToLocalStorage();
    }
  };

  function fallbackToLocalStorage() {
    const localStored = JSON.parse(localStorage.getItem("dxz_supporters") || "[]");
    const mergedMap = new Map();
    DEFAULT_SUPPORTERS.forEach(s => mergedMap.set(s.name.toLowerCase(), s));
    localStored.forEach(s => mergedMap.set(s.name.toLowerCase(), s));

    loadedSupporters = Array.from(mergedMap.values()).sort((a, b) => (b.glory || 0) - (a.glory || 0));
    renderLeaderboard();
    updateHeroSpotlight();
  }

  // ==========================================================================
  // RENDER SPECIAL BOARD (PODIUM + RANKED TABLE)
  // ==========================================================================
  function renderLeaderboard() {
    const container = document.getElementById("supporters-leaderboard-body");
    const podiumContainer = document.getElementById("supporters-podium-container");
    if (!container) return;

    let filtered = loadedSupporters;
    if (activeFilter !== "all") {
      filtered = loadedSupporters.filter(s => (s.rank || "").toLowerCase() === activeFilter.toLowerCase());
    }

    // 1. Render Top 3 Podium (for 'all' or filtered with at least 1)
    if (podiumContainer) {
      if (filtered.length >= 1) {
        podiumContainer.style.display = "flex";
        const first = filtered[0];
        const second = filtered[1] || null;
        const third = filtered[2] || null;

        const renderPodiumCard = (supporter, placeNum, placeClass, placeLabel) => {
          if (!supporter) {
            return `
              <div class="podium-card empty-podium ${placeClass}">
                <div class="podium-rank-tag">${placeLabel}</div>
                <div class="podium-crest-placeholder"><i class="fa-solid fa-lock"></i></div>
                <h4 style="color:var(--text-muted); font-size: 0.9rem;">Vacant Rank</h4>
                <p style="font-size: 0.75rem; color: var(--text-muted);">Contribute Glory to claim this spot!</p>
              </div>
            `;
          }

          const rankInfo = SUPPORTER_RANKS[supporter.rank] || SUPPORTER_RANKS.elite;
          return `
            <div class="podium-card ${placeClass}">
              <div class="podium-crown"><i class="fa-solid fa-crown"></i> ${placeLabel}</div>
              <div class="podium-crest-box">
                <img src="${rankInfo.image}" alt="${rankInfo.name}" class="podium-crest-img">
              </div>
              <span class="podium-rank-badge" style="background: rgba(${rankInfo.rgb}, 0.2); color: ${rankInfo.color}; border: 1px solid ${rankInfo.color};">
                ${rankInfo.name}
              </span>
              <h3 class="podium-name">${escapeHtml(supporter.name)}</h3>
              <div class="podium-faction">${escapeHtml(supporter.faction || "Faction Warrior")}</div>
              <div class="podium-glory"><i class="fa-solid fa-bolt"></i> ${(supporter.glory || 0).toLocaleString('en-IN')} GLORY</div>
              ${supporter.message ? `<p class="podium-quote">"${escapeHtml(supporter.message)}"</p>` : ''}
            </div>
          `;
        };

        podiumContainer.innerHTML = `
          ${renderPodiumCard(second, 2, "second-place", "2ND PLACE")}
          ${renderPodiumCard(first, 1, "first-place", "CHAMPION")}
          ${renderPodiumCard(third, 3, "third-place", "3RD PLACE")}
        `;
      } else {
        podiumContainer.style.display = "none";
      }
    }

    // 2. Render Full Ranked List
    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          <i class="fa-solid fa-shield-halved" style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--color-blue-neon);"></i>
          <p>No supporters found in this category yet. Be the first to claim this rank!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="supporters-table-wrap">
        <table class="supporters-table">
          <thead>
            <tr>
              <th style="width: 70px;">RANK</th>
              <th>SUPPORTER</th>
              <th>CREST & TIER</th>
              <th>FACTION</th>
              <th>GLORY POINTS</th>
              <th>DATE</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map((s, idx) => {
              const rankInfo = SUPPORTER_RANKS[s.rank] || SUPPORTER_RANKS.elite;
              const dateStr = s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Season 3';
              const rankNum = idx + 1;
              const isTop3 = rankNum <= 3;
              const badgeBadge = isTop3 ? `<span class="badge-number top-${rankNum}">#${rankNum}</span>` : `<span class="badge-number">#${rankNum}</span>`;

              return `
                <tr class="supporter-row ${s.rank}-row ${isTop3 ? 'top-three-row' : ''}">
                  <td>${badgeBadge}</td>
                  <td>
                    <div class="supporter-user-cell">
                      <strong class="supporter-name">${escapeHtml(s.name)}</strong>
                      ${s.message ? `<div class="supporter-lore-msg">"${escapeHtml(s.message)}"</div>` : ''}
                    </div>
                  </td>
                  <td>
                    <div class="tier-cell">
                      <img src="${rankInfo.image}" alt="${rankInfo.name}" class="table-crest-thumb">
                      <span class="table-rank-pill" style="background: rgba(${rankInfo.rgb}, 0.15); color: ${rankInfo.color}; border: 1px solid rgba(${rankInfo.rgb}, 0.35);">
                        ${rankInfo.name}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span class="supporter-faction-tag">${escapeHtml(s.faction || "Faction Rebel")}</span>
                  </td>
                  <td>
                    <div class="glory-cell" style="color: ${rankInfo.color};">
                      <i class="fa-solid fa-bolt"></i> <strong>${(s.glory || 0).toLocaleString('en-IN')}</strong> PTS
                      ${s.paymentMethod === 'lore_cash' ? '<span class="lore-cash-chip" title="Unlocked via Detective NJ Bounty Cash">$10K GAME CASH</span>' : ''}
                    </div>
                  </td>
                  <td style="color: var(--text-muted); font-size: 0.82rem;">${dateStr}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  // ==========================================================================
  // HERO SECTION SPOTLIGHT SYNC
  // ==========================================================================
  function updateHeroSpotlight() {
    const crestEl = document.getElementById("hero-spotlight-crest");
    const nameEl = document.getElementById("hero-spotlight-name");
    const gloryEl = document.getElementById("hero-spotlight-glory");
    const rankEl = document.getElementById("hero-spotlight-rank");

    if (!loadedSupporters || loadedSupporters.length === 0) return;

    // Pick top emperor or highest overall
    const topSupporter = loadedSupporters[0];
    const rankInfo = SUPPORTER_RANKS[topSupporter.rank] || SUPPORTER_RANKS.emperor;

    if (crestEl) crestEl.src = rankInfo.image;
    if (nameEl) nameEl.textContent = topSupporter.name;
    if (gloryEl) gloryEl.innerHTML = `<i class="fa-solid fa-bolt"></i> ${(topSupporter.glory || 0).toLocaleString('en-IN')} Glory Points`;
    if (rankEl) {
      rankEl.textContent = `${rankInfo.name} RANK`;
      rankEl.style.background = `linear-gradient(135deg, ${rankInfo.color}, rgba(${rankInfo.rgb}, 0.6))`;
    }
  }

  // ==========================================================================
  // LEADERBOARD FILTER BUTTONS
  // ==========================================================================
  window.filterSupporters = function(rankKey, btnEl) {
    activeFilter = rankKey;
    document.querySelectorAll(".board-filter-btn").forEach(btn => btn.classList.remove("active"));
    if (btnEl) btnEl.classList.add("active");
    renderLeaderboard();
  };

  // ==========================================================================
  // SUPPORTER PURCHASE MODAL
  // ==========================================================================
  function initSupporterModal() {
    const modal = document.getElementById("supporter-modal");
    if (!modal) return;

    const closeBtn = document.getElementById("supporter-modal-close");
    const backdrop = document.getElementById("supporter-modal-backdrop");
    if (closeBtn) closeBtn.onclick = closeSupporterModal;
    if (backdrop) backdrop.onclick = closeSupporterModal;

    // Amount input Glory preview listener
    const amountInput = document.getElementById("supporter-amount-input");
    if (amountInput) {
      amountInput.addEventListener("input", updateGloryPreview);
    }
  }

  window.openSupporterModal = function(rankId) {
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

    const amountInput = document.getElementById("supporter-amount-input");
    amountInput.min = rank.price;
    amountInput.value = rank.price;

    // Check Lore Game Cash ($10,000 for Elite)
    const loreCashSection = document.getElementById("lore-cash-tab-btn");
    const loreCashPanel = document.getElementById("lore-cash-pay-box");
    
    // Read Detective NJ Game State from localStorage
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
    // 1 Rupee = 1 Glory point. Any payment at or above base grants full Glory.
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
      alert("Razorpay gateway is loading, please try again in a moment.");
    }
  };

  // ==========================================================================
  // PAYMENT HANDLER 2: REDEEM LORE GAME CASH ($10,000 FOR ELITE)
  // ==========================================================================
  window.redeemLoreCashSupporter = function() {
    if (currentSelectedRank !== "elite") return;

    const name = document.getElementById("supporter-name-input").value.trim();
    const email = document.getElementById("supporter-email-input").value.trim() || "game_user@blueshot.online";
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
      name: name,
      email: email,
      rank: "elite",
      amount: 5,
      glory: 100, // Rewarding $10K lore cash with 100 Glory points!
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
    alert(`🎉 CONGRATULATIONS ${data.name.toUpperCase()}!\n\nYou have officially unlocked the ${rank.name} RANK with ${data.glory} Glory Points!\n\nYour name and rank crest are now immortalized on the global Supporters Board.`);
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
