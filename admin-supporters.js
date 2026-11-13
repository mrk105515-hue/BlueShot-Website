// ==========================================================================
// THE BLUESHOT SUPPORTERS ADMIN BACKOFFICE LOGIC
// Real-time synchronization with Cloud Firestore & local storage records
// ==========================================================================

(function() {
  'use strict';

  // Constants & Rank Configuration
  const MASTER_ADMIN_EMAIL = "blueshotconnectx@gmail.com";
  const ADMIN_PASSKEYS = ["admin77", "dxzadmin2026", "blueshotadmin"];
  const AUTH_STORAGE_KEY = "dxz_admin_authenticated";
  const ADMIN_USER_STORAGE_KEY = "dxz_admin_user";
  
  const SUPPORTER_RANKS = {
    elite: { name: "ELITE", color: "#ff4d2d", image: "assets/rank-elite.png", baseGlory: 5, price: 5 },
    warlord: { name: "WARLORD", color: "#00a8ff", image: "assets/rank-warlord.png", baseGlory: 10, price: 10 },
    apex: { name: "APEX", color: "#ffaa00", image: "assets/rank-apex.png", baseGlory: 40, price: 40 },
    emperor: { name: "EMPEROR", color: "#b026ff", image: "assets/rank-emperor.png", baseGlory: 100, price: 100 }
  };

  // State Management
  let allSupporters = [];
  let filteredSupporters = [];

  // ==========================================================================
  // 1. AUTHENTICATION & ACCESS LOCK SCREEN (DEFAULT FOR blueshotconnectx@gmail.com)
  // ==========================================================================
  function isMasterAdmin(userOrEmail) {
    if (!userOrEmail) return false;
    const email = typeof userOrEmail === "string" ? userOrEmail : (userOrEmail.email || "");
    return email.trim().toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase();
  }

  function grantAdminAccess(email, name) {
    sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
    const adminUser = {
      email: email || MASTER_ADMIN_EMAIL,
      name: name || "Master Admin",
      isMaster: isMasterAdmin(email || MASTER_ADMIN_EMAIL)
    };
    sessionStorage.setItem(ADMIN_USER_STORAGE_KEY, JSON.stringify(adminUser));
    unlockBackofficeUI();
  }

  function getStoredAdminUser() {
    try {
      const saved = sessionStorage.getItem(ADMIN_USER_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  }

  function updateAdminProfileUI(email, name) {
    const chip = document.getElementById("admin-account-chip");
    const emailEl = document.getElementById("admin-account-email");
    if (chip) {
      chip.style.display = "inline-flex";
      if (emailEl) emailEl.textContent = email || MASTER_ADMIN_EMAIL;
    }
  }

  function checkStoredMasterAdmin() {
    // 1. Session Storage already authorized
    if (sessionStorage.getItem(AUTH_STORAGE_KEY) === "true") {
      return true;
    }

    // 2. Firebase Auth currently logged in
    if (typeof firebase !== "undefined" && firebase.auth && firebase.auth().currentUser) {
      const u = firebase.auth().currentUser;
      if (isMasterAdmin(u)) {
        grantAdminAccess(u.email, u.displayName);
        return true;
      }
    }

    // 3. Demo / LocalStorage user
    try {
      const demoStr = localStorage.getItem("dxz_demo_user");
      if (demoStr) {
        const u = JSON.parse(demoStr);
        if (isMasterAdmin(u)) {
          grantAdminAccess(u.email, u.displayName);
          return true;
        }
      }
    } catch (e) {}

    // 4. Firebase Auth persisted user in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("firebase:authUser")) {
        try {
          const u = JSON.parse(localStorage.getItem(k));
          if (isMasterAdmin(u)) {
            grantAdminAccess(u.email, u.displayName);
            return true;
          }
        } catch (e) {}
      }
    }

    return false;
  }

  window.verifyAdminPasskey = function() {
    const inputEl = document.getElementById("admin-passkey-input");
    const entered = (inputEl ? inputEl.value : "").trim();

    if (ADMIN_PASSKEYS.includes(entered) || entered.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase()) {
      grantAdminAccess(MASTER_ADMIN_EMAIL, "Master Administrator");
      showToast("Access Granted. Welcome Administrator!", true);
    } else {
      showToast("Invalid Admin Passkey. Please try again.", false);
      if (inputEl) {
        inputEl.value = "";
        inputEl.focus();
        inputEl.style.borderColor = "var(--admin-red)";
        setTimeout(() => { inputEl.style.borderColor = ""; }, 1500);
      }
    }
  };

  window.signInWithMasterAdminAccount = async function() {
    if (typeof firebase !== "undefined" && firebase.auth) {
      const curr = firebase.auth().currentUser;
      if (curr && isMasterAdmin(curr)) {
        grantAdminAccess(curr.email, curr.displayName);
        updateAdminProfileUI(curr.email, curr.displayName);
        showToast("Welcome back, Master Admin (" + curr.email + ")!", true);
        return;
      }
    }

    // Default auto-grant for master account
    localStorage.setItem("dxz_demo_user", JSON.stringify({
      uid: "usr_master_admin",
      email: MASTER_ADMIN_EMAIL,
      displayName: "Master Admin"
    }));
    grantAdminAccess(MASTER_ADMIN_EMAIL, "Master Admin");
    updateAdminProfileUI(MASTER_ADMIN_EMAIL, "Master Admin");
    showToast("Master Account Verified: " + MASTER_ADMIN_EMAIL, true);
  };

  window.lockAdminSession = function() {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(ADMIN_USER_STORAGE_KEY);
    const lockScreen = document.getElementById("admin-lock-screen");
    if (lockScreen) lockScreen.style.display = "flex";
    const inputEl = document.getElementById("admin-passkey-input");
    if (inputEl) {
      inputEl.value = "";
      inputEl.focus();
    }
  };

  function unlockBackofficeUI() {
    const lockScreen = document.getElementById("admin-lock-screen");
    if (lockScreen) lockScreen.style.display = "none";
    const user = getStoredAdminUser();
    if (user) {
      updateAdminProfileUI(user.email, user.name);
    }
    initDataListener();
  }

  // ==========================================================================
  // 2. DATA SYNCHRONIZATION (FIRESTORE REAL-TIME + LOCALSTORAGE FALLBACK)
  // ==========================================================================
  function initDataListener() {
    const statusText = document.getElementById("sync-status-text");

    if (typeof firebase !== "undefined" && firebase.firestore) {
      const db = firebase.firestore();
      db.collection("supporters")
        .orderBy("createdAt", "desc")
        .onSnapshot((snapshot) => {
          const list = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            list.push({
              id: doc.id,
              paymentId: data.paymentId || doc.id,
              name: data.name || "Anonymous",
              email: data.email || data.userEmail || "No Email",
              rank: (data.rank || "elite").toLowerCase(),
              amount: Number(data.amount) || 0,
              glory: Number(data.glory) || 0,
              paymentMethod: data.paymentMethod || "razorpay",
              faction: data.faction || "Independent Faction",
              message: data.message || "",
              verified: Boolean(data.verified),
              avatar: data.avatar || "",
              createdAt: data.createdAt ? (data.createdAt.toDate ? data.createdAt.toDate().toISOString() : data.createdAt) : new Date().toISOString()
            });
          });

          // Merge with any local offline purchases
          const localStored = getLocalSupporters();
          localStored.forEach(localItem => {
            if (!list.some(item => item.id === localItem.paymentId || item.paymentId === localItem.paymentId)) {
              list.push({
                ...localItem,
                id: localItem.paymentId || ("loc_" + Date.now().toString(36))
              });
            }
          });

          // Sort by creation date descending
          list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          allSupporters = list;
          if (statusText) statusText.textContent = "Firestore Connected (Real-Time)";
          updateKPIs();
          applyFilters();
        }, (error) => {
          console.warn("Firestore admin listener notice, falling back to local storage:", error);
          loadFromLocalStorageFallback();
        });
    } else {
      loadFromLocalStorageFallback();
    }
  }

  function getLocalSupporters() {
    try {
      const raw = localStorage.getItem("dxz_supporters");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function loadFromLocalStorageFallback() {
    const statusText = document.getElementById("sync-status-text");
    if (statusText) statusText.textContent = "Local Cache (Offline)";

    const localList = getLocalSupporters();
    allSupporters = localList.map(item => ({
      id: item.paymentId || ("loc_" + Math.random().toString(36).substring(2, 8)),
      paymentId: item.paymentId || "N/A",
      name: item.name || "Anonymous",
      email: item.email || item.userEmail || "No Email",
      rank: (item.rank || "elite").toLowerCase(),
      amount: Number(item.amount) || 0,
      glory: Number(item.glory) || 0,
      paymentMethod: item.paymentMethod || "razorpay",
      faction: item.faction || "Independent Faction",
      message: item.message || "",
      verified: Boolean(item.verified),
      avatar: item.avatar || "",
      createdAt: item.createdAt || new Date().toISOString()
    }));

    allSupporters.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    updateKPIs();
    applyFilters();
  }

  window.refreshAdminData = function() {
    initDataListener();
    showToast("Transaction records refreshed from database.", true);
  };

  // ==========================================================================
  // 3. KPI CALCULATIONS & TIER BREAKDOWN
  // ==========================================================================
  function updateKPIs() {
    const totalBuyers = allSupporters.length;
    let totalRevenueINR = 0;
    let totalLoreCash = 0;
    let totalGlory = 0;

    let countEmperor = 0;
    let countApex = 0;
    let countWarlord = 0;
    let countElite = 0;

    allSupporters.forEach(s => {
      const amt = Number(s.amount) || 0;
      const glory = Number(s.glory) || 0;
      totalGlory += glory;

      if (s.paymentMethod === "lore_cash") {
        totalLoreCash += 10000; // $10,000 bounty cash per Elite redemption
      } else {
        totalRevenueINR += amt;
      }

      const r = (s.rank || "").toLowerCase();
      if (r === "emperor") countEmperor++;
      else if (r === "apex") countApex++;
      else if (r === "warlord") countWarlord++;
      else countElite++;
    });

    const totalBuyersEl = document.getElementById("kpi-total-buyers");
    const totalRevenueEl = document.getElementById("kpi-total-revenue");
    const totalLoreCashEl = document.getElementById("kpi-total-lore-cash");
    const totalGloryEl = document.getElementById("kpi-total-glory");

    if (totalBuyersEl) totalBuyersEl.textContent = totalBuyers.toLocaleString('en-IN');
    if (totalRevenueEl) totalRevenueEl.innerHTML = `&#8377;${totalRevenueINR.toLocaleString('en-IN')}`;
    if (totalLoreCashEl) totalLoreCashEl.textContent = `$${totalLoreCash.toLocaleString('en-IN')}`;
    if (totalGloryEl) totalGloryEl.innerHTML = `<span style="color:#ffd700;">⚡</span> ${totalGlory.toLocaleString('en-IN')}`;

    // Tier strip counts
    const empEl = document.getElementById("tier-count-emperor");
    const apexEl = document.getElementById("tier-count-apex");
    const warEl = document.getElementById("tier-count-warlord");
    const eliteEl = document.getElementById("tier-count-elite");

    if (empEl) empEl.textContent = countEmperor;
    if (apexEl) apexEl.textContent = countApex;
    if (warEl) warEl.textContent = countWarlord;
    if (eliteEl) eliteEl.textContent = countElite;
  }

  // ==========================================================================
  // 4. FILTERING, SEARCHING & SORTING
  // ==========================================================================
  window.applyFilters = function() {
    const searchVal = (document.getElementById("admin-search-input")?.value || "").toLowerCase().trim();
    const rankVal = document.getElementById("filter-rank")?.value || "all";
    const methodVal = document.getElementById("filter-method")?.value || "all";
    const verifiedVal = document.getElementById("filter-verified")?.value || "all";
    const sortVal = document.getElementById("sort-selector")?.value || "date-desc";

    filteredSupporters = allSupporters.filter(item => {
      // Search matching
      if (searchVal) {
        const matchesName = (item.name || "").toLowerCase().includes(searchVal);
        const matchesEmail = (item.email || "").toLowerCase().includes(searchVal);
        const matchesId = (item.paymentId || item.id || "").toLowerCase().includes(searchVal);
        const matchesFaction = (item.faction || "").toLowerCase().includes(searchVal);
        const matchesMsg = (item.message || "").toLowerCase().includes(searchVal);
        if (!matchesName && !matchesEmail && !matchesId && !matchesFaction && !matchesMsg) {
          return false;
        }
      }

      // Rank filter
      if (rankVal !== "all" && item.rank !== rankVal) {
        return false;
      }

      // Method filter
      if (methodVal !== "all") {
        if (methodVal === "razorpay" && item.paymentMethod !== "razorpay") return false;
        if (methodVal === "lore_cash" && item.paymentMethod !== "lore_cash") return false;
        if (methodVal === "manual" && item.paymentMethod !== "manual" && item.paymentMethod !== "giveaway") return false;
      }

      // Verified status filter
      if (verifiedVal === "verified" && !item.verified) return false;
      if (verifiedVal === "unverified" && item.verified) return false;

      return true;
    });

    // Sorting
    filteredSupporters.sort((a, b) => {
      if (sortVal === "date-desc") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortVal === "date-asc") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortVal === "glory-desc") return (b.glory || 0) - (a.glory || 0);
      if (sortVal === "amount-desc") return (b.amount || 0) - (a.amount || 0);
      if (sortVal === "name-asc") return (a.name || "").localeCompare(b.name || "");
      return 0;
    });

    renderTable();
  };

  // ==========================================================================
  // 5. TABLE RENDERING
  // ==========================================================================
  function renderTable() {
    const tbody = document.getElementById("admin-table-body");
    const emptyNotice = document.getElementById("table-empty-notice");
    const counterBadge = document.getElementById("records-counter-badge");

    if (counterBadge) counterBadge.textContent = `${filteredSupporters.length} of ${allSupporters.length} Records`;

    if (!tbody) return;

    if (filteredSupporters.length === 0) {
      tbody.innerHTML = "";
      if (emptyNotice) emptyNotice.style.display = "block";
      return;
    }

    if (emptyNotice) emptyNotice.style.display = "none";

    tbody.innerHTML = filteredSupporters.map((s, idx) => {
      const pos = idx + 1;
      const rank = SUPPORTER_RANKS[s.rank] || SUPPORTER_RANKS.elite;
      const safeId = escapeHtml(s.paymentId || s.id);
      const isLore = s.paymentMethod === "lore_cash";
      const isManual = s.paymentMethod === "manual" || s.paymentMethod === "giveaway";

      const amountFormatted = isLore
        ? `<span style="color:#00e5ff;"><i class="fa-solid fa-coins"></i> $10,000</span>`
        : `<strong>&#8377;${(s.amount || rank.price).toLocaleString('en-IN')}</strong>`;

      const methodBadge = isLore
        ? `<span style="font-size:0.68rem; color:#00e5ff; background:rgba(0,229,255,0.1); padding:1px 6px; border-radius:4px;">Lore Cash</span>`
        : isManual
        ? `<span style="font-size:0.68rem; color:#ffd700; background:rgba(255,215,0,0.1); padding:1px 6px; border-radius:4px;">Manual</span>`
        : `<span style="font-size:0.68rem; color:#10b981; background:rgba(16,185,129,0.1); padding:1px 6px; border-radius:4px;">Razorpay</span>`;

      const dateStr = formatDate(s.createdAt);
      const avatarSrc = s.avatar || createInitialsAvatar(s.name);

      return `
        <tr>
          <td style="color:#71717a; font-weight:700;">${pos}</td>
          <td>
            <div class="id-code-badge" onclick="copyToClipboard('${safeId}')" title="Click to copy ID">
              <span>${truncateId(safeId)}</span>
              <i class="fa-regular fa-copy" style="font-size:0.7rem;"></i>
            </div>
            <div style="margin-top: 3px;">${methodBadge}</div>
          </td>
          <td>
            <div class="supporter-cell">
              <img src="${avatarSrc}" alt="${escapeHtml(s.name)}" class="supporter-avatar-mini">
              <div class="supporter-meta-box">
                <div class="supporter-name-line">
                  <span>${escapeHtml(s.name)}</span>
                  ${s.verified ? `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#c084fc" title="Verified Creator/Supporter Badge">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  ` : ''}
                </div>
                ${s.message ? `<span style="font-size:0.72rem; color:#a1a1aa; max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">"${escapeHtml(s.message)}"</span>` : ''}
              </div>
            </div>
          </td>
          <td>
            <a href="mailto:${escapeHtml(s.email)}" style="color:#a1a1aa; text-decoration:none; display:inline-flex; align-items:center; gap:0.35rem;" title="Send Email">
              <i class="fa-regular fa-envelope" style="font-size:0.75rem;"></i>
              <span>${escapeHtml(s.email)}</span>
            </a>
          </td>
          <td>
            <span class="tier-pill ${s.rank}">
              <img src="${rank.image}" alt="${rank.name}" style="width:14px; height:14px; object-fit:contain;">
              <span>${rank.name}</span>
            </span>
          </td>
          <td>
            <span style="font-weight:800; color:#fff; font-family:var(--font-display); letter-spacing:0.04em;">
              <span style="color:#ffd700;">⚡</span> ${(s.glory || 0).toLocaleString('en-IN')}
            </span>
          </td>
          <td>${amountFormatted}</td>
          <td>
            <span style="color:#a1a1aa; font-size:0.8rem;">${escapeHtml(s.faction || "Independent")}</span>
          </td>
          <td>
            <span style="color:#71717a; font-size:0.78rem;">${dateStr}</span>
          </td>
          <td>
            <button type="button" class="tbl-action-btn ${s.verified ? 'btn-verify-active' : ''}" onclick="toggleSupporterVerification('${safeId}')" title="${s.verified ? 'Click to remove verified badge' : 'Click to grant verified badge'}">
              <i class="fa-solid fa-check"></i>
            </button>
          </td>
          <td>
            <div class="action-btn-group">
              <button type="button" class="tbl-action-btn" onclick="openDetailsModal('${safeId}')" title="View Full Transaction Receipt">
                <i class="fa-solid fa-eye"></i>
              </button>
              <button type="button" class="tbl-action-btn btn-del" onclick="deleteSupporterRecord('${safeId}')" title="Delete Supporter Record">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  // ==========================================================================
  // 6. RECORD DETAILS INSPECTOR MODAL
  // ==========================================================================
  window.openDetailsModal = function(id) {
    const item = allSupporters.find(s => s.paymentId === id || s.id === id);
    if (!item) return;

    const modal = document.getElementById("details-modal");
    const container = document.getElementById("details-modal-content");
    const rank = SUPPORTER_RANKS[item.rank] || SUPPORTER_RANKS.elite;

    container.innerHTML = `
      <div style="background:rgba(255,255,255,0.03); border:1px solid var(--admin-border); border-radius:12px; padding:1.25rem; margin-bottom:1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
          <span style="font-size:0.78rem; text-transform:uppercase; color:#71717a; font-weight:700;">Transaction Receipt</span>
          <span class="tier-pill ${item.rank}"><img src="${rank.image}" style="width:14px; height:14px;"> ${rank.name}</span>
        </div>
        <div style="font-size:1.15rem; font-weight:800; color:#fff; margin-bottom:0.25rem;">
          ${escapeHtml(item.name)} ${item.verified ? '<i class="fa-solid fa-circle-check" style="color:#c084fc; font-size:0.9rem;"></i>' : ''}
        </div>
        <div style="font-size:0.85rem; color:#a1a1aa; margin-bottom:1rem;">
          ${escapeHtml(item.email)}
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; font-size:0.82rem; border-top:1px solid rgba(255,255,255,0.06); padding-top:0.75rem;">
          <div><strong style="color:#71717a;">Payment ID:</strong><br><code style="color:var(--admin-cyan);">${escapeHtml(item.paymentId)}</code></div>
          <div><strong style="color:#71717a;">Gateway:</strong><br><span style="text-transform:capitalize;">${escapeHtml(item.paymentMethod)}</span></div>
          <div><strong style="color:#71717a;">Amount Paid:</strong><br>${item.paymentMethod === 'lore_cash' ? '$10,000 Lore Cash' : '₹' + (item.amount || rank.price)}</div>
          <div><strong style="color:#71717a;">Glory Allocated:</strong><br><span style="color:#ffd700; font-weight:800;">⚡ ${(item.glory || 0).toLocaleString('en-IN')}</span></div>
          <div><strong style="color:#71717a;">Clan / Faction:</strong><br>${escapeHtml(item.faction || "Independent")}</div>
          <div><strong style="color:#71717a;">Timestamp:</strong><br>${formatDate(item.createdAt)}</div>
        </div>

        ${item.message ? `
          <div style="margin-top:0.85rem; padding-top:0.85rem; border-top:1px solid rgba(255,255,255,0.06);">
            <strong style="color:#71717a; font-size:0.78rem; text-transform:uppercase;">Supporter Dedication:</strong>
            <p style="margin:0.35rem 0 0; color:#e4e4e7; font-style:italic; font-size:0.88rem;">"${escapeHtml(item.message)}"</p>
          </div>
        ` : ''}
      </div>

      <div style="margin-bottom:1rem;">
        <span style="font-size:0.76rem; text-transform:uppercase; color:#71717a; font-weight:700;">Raw JSON Record</span>
        <pre style="background:rgba(0,0,0,0.6); padding:0.85rem; border-radius:8px; border:1px solid var(--admin-border); font-size:0.74rem; color:#a1a1aa; max-height:160px; overflow-y:auto; margin:0.4rem 0 0;">${escapeHtml(JSON.stringify(item, null, 2))}</pre>
      </div>

      <div style="display:flex; justify-content:flex-end; gap:0.75rem;">
        <button type="button" class="admin-btn" onclick="copyToClipboard('${escapeHtml(JSON.stringify(item))}')">
          <i class="fa-regular fa-copy"></i> Copy JSON
        </button>
        <button type="button" class="admin-btn admin-btn-primary" onclick="closeDetailsModal()">Close</button>
      </div>
    `;

    if (modal) modal.classList.add("active");
  };

  window.closeDetailsModal = function() {
    const modal = document.getElementById("details-modal");
    if (modal) modal.classList.remove("active");
  };

  // ==========================================================================
  // 7. VERIFY TOGGLE & DELETE ACTIONS
  // ==========================================================================
  window.toggleSupporterVerification = function(id) {
    const item = allSupporters.find(s => s.paymentId === id || s.id === id);
    if (!item) return;

    item.verified = !item.verified;

    // 1. Update Firestore
    if (typeof firebase !== "undefined" && firebase.firestore) {
      const db = firebase.firestore();
      db.collection("supporters").doc(item.id || item.paymentId).update({
        verified: item.verified
      }).catch(err => console.warn("Firestore verify update notice:", err));
    }

    // 2. Update localStorage
    const local = getLocalSupporters();
    const locIdx = local.findIndex(s => (s.paymentId || s.id) === id);
    if (locIdx !== -1) {
      local[locIdx].verified = item.verified;
      localStorage.setItem("dxz_supporters", JSON.stringify(local));
    }

    renderTable();
    showToast(item.verified ? `Granted Verified status to ${item.name}!` : `Removed Verified status for ${item.name}.`, true);
  };

  window.deleteSupporterRecord = function(id) {
    const item = allSupporters.find(s => s.paymentId === id || s.id === id);
    if (!item) return;

    const confirmed = confirm(`Are you sure you want to permanently delete supporter record for "${item.name}" (${item.paymentId})?\n\nThis will remove their patronage record from the database.`);
    if (!confirmed) return;

    // 1. Delete from Firestore
    if (typeof firebase !== "undefined" && firebase.firestore) {
      const db = firebase.firestore();
      db.collection("supporters").doc(item.id || item.paymentId).delete().then(() => {
        console.log("Deleted from Firestore.");
      }).catch(err => console.warn("Firestore delete notice:", err));
    }

    // 2. Delete from localStorage
    const local = getLocalSupporters();
    const updated = local.filter(s => (s.paymentId || s.id) !== id);
    localStorage.setItem("dxz_supporters", JSON.stringify(updated));

    // 3. Remove from memory & update UI
    allSupporters = allSupporters.filter(s => (s.paymentId !== id && s.id !== id));
    updateKPIs();
    applyFilters();
    showToast(`Supporter record for ${item.name} has been deleted.`, true);
  };

  // ==========================================================================
  // 8. MANUAL GRANT / ADD SUPPORTER MODAL
  // ==========================================================================
  window.openManualGrantModal = function() {
    const modal = document.getElementById("grant-modal");
    if (modal) {
      modal.classList.add("active");
      const nameInput = document.getElementById("grant-name");
      if (nameInput) nameInput.focus();
    }
  };

  window.closeManualGrantModal = function() {
    const modal = document.getElementById("grant-modal");
    if (modal) modal.classList.remove("active");
  };

  window.syncGrantGloryDefault = function() {
    const rankSelect = document.getElementById("grant-rank");
    const gloryInput = document.getElementById("grant-glory");
    const amountInput = document.getElementById("grant-amount");
    if (!rankSelect || !gloryInput) return;

    const r = SUPPORTER_RANKS[rankSelect.value] || SUPPORTER_RANKS.elite;
    gloryInput.value = r.baseGlory;
    if (amountInput) amountInput.value = r.price;
  };

  window.submitManualGrant = function() {
    const name = document.getElementById("grant-name")?.value.trim();
    const email = document.getElementById("grant-email")?.value.trim();
    const rank = document.getElementById("grant-rank")?.value || "emperor";
    const glory = parseInt(document.getElementById("grant-glory")?.value) || 100;
    const amount = parseFloat(document.getElementById("grant-amount")?.value) || 100;
    const method = document.getElementById("grant-method")?.value || "manual";
    const faction = document.getElementById("grant-faction")?.value.trim() || "BlueShot Community";
    const message = document.getElementById("grant-message")?.value.trim() || "Granted by Admin.";
    const verified = Boolean(document.getElementById("grant-verified")?.checked);

    if (!name || !email) {
      alert("Please provide supporter name and email!");
      return;
    }

    const paymentId = "GRANT_" + Date.now().toString(36).toUpperCase();
    const record = {
      paymentId: paymentId,
      name: name,
      email: email,
      userEmail: email,
      rank: rank,
      glory: glory,
      amount: amount,
      paymentMethod: method,
      faction: faction,
      message: message,
      verified: verified,
      createdAt: new Date().toISOString()
    };

    // 1. Save to Firestore
    if (typeof firebase !== "undefined" && firebase.firestore) {
      const db = firebase.firestore();
      db.collection("supporters").doc(paymentId).set({
        ...record,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        console.log("Manual grant saved to Firestore.");
      }).catch(err => console.warn("Firestore manual write notice:", err));
    }

    // 2. Save to localStorage
    const local = getLocalSupporters();
    local.unshift(record);
    localStorage.setItem("dxz_supporters", JSON.stringify(local));

    // 3. Add to memory list
    allSupporters.unshift({
      ...record,
      id: paymentId
    });

    closeManualGrantModal();
    updateKPIs();
    applyFilters();
    showToast(`Supporter rank awarded to ${name}! Record saved.`, true);

    // Reset form
    document.getElementById("grant-name").value = "";
    document.getElementById("grant-email").value = "";
    document.getElementById("grant-message").value = "";
  };

  // ==========================================================================
  // 9. EXPORT SUPPORTER RECORDS TO CSV
  // ==========================================================================
  window.exportBuyersToCSV = function() {
    if (allSupporters.length === 0) {
      showToast("No records available to export.", false);
      return;
    }

    const headers = [
      "Receipt ID",
      "Supporter Name",
      "Email Address",
      "Rank Tier",
      "Glory Points",
      "Amount Paid",
      "Payment Channel",
      "Clan Faction",
      "Verified",
      "Message",
      "Date Recorded"
    ];

    const rows = allSupporters.map(s => [
      `"${(s.paymentId || s.id || '').replace(/"/g, '""')}"`,
      `"${(s.name || '').replace(/"/g, '""')}"`,
      `"${(s.email || '').replace(/"/g, '""')}"`,
      `"${(s.rank || '').toUpperCase()}"`,
      s.glory || 0,
      s.amount || 0,
      `"${(s.paymentMethod || '').replace(/"/g, '""')}"`,
      `"${(s.faction || '').replace(/"/g, '""')}"`,
      s.verified ? "YES" : "NO",
      `"${(s.message || '').replace(/"/g, '""')}"`,
      `"${formatDate(s.createdAt)}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStamp = new Date().toISOString().split("T")[0];
    link.setAttribute("href", url);
    link.setAttribute("download", `TheBlueShot_Supporters_Audit_${dateStamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("CSV file exported successfully!", true);
  };

  // ==========================================================================
  // 10. UTILITIES
  // ==========================================================================
  function createInitialsAvatar(name) {
    const cleanName = (name || "Player").trim();
    const parts = cleanName.split(/\s+/);
    const initials = (parts[0] ? parts[0][0] : "P") + (parts[1] ? parts[1][0] : "");
    let hash = 0;
    for (let i = 0; i < cleanName.length; i++) {
      hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue1 = Math.abs(hash) % 360;
    const hue2 = (hue1 + 45) % 360;
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><defs><linearGradient id='usrGrad_${hue1}' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='hsl(${hue1}, 75%, 45%)'/><stop offset='100%' stop-color='hsl(${hue2}, 85%, 35%)'/></linearGradient></defs><rect width='100' height='100' rx='50' fill='url(#usrGrad_${hue1})'/><text x='50' y='62' font-family='sans-serif' font-size='36' font-weight='800' fill='#ffffff' text-anchor='middle'>${initials.toUpperCase()}</text></svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  window.copyToClipboard = function(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast("Copied to clipboard: " + truncateId(text), true);
      }).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  };

  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      showToast("Copied to clipboard!", true);
    } catch (e) {}
    document.body.removeChild(ta);
  }

  function showToast(msg, isSuccess = true) {
    const toast = document.getElementById("admin-toast");
    const toastText = document.getElementById("admin-toast-text");
    if (!toast || !toastText) return;

    toastText.textContent = msg;
    const icon = toast.querySelector("i");
    if (icon) {
      icon.className = isSuccess ? "fa-solid fa-circle-check" : "fa-solid fa-triangle-exclamation";
      icon.style.color = isSuccess ? "var(--admin-green)" : "var(--admin-red)";
    }

    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  }

  function truncateId(str) {
    if (!str) return "";
    if (str.length <= 15) return str;
    return str.substring(0, 7) + "..." + str.substring(str.length - 5);
  }

  function formatDate(isoStr) {
    if (!isoStr) return "Just now";
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return "Recent";
      return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (e) {
      return "Recent";
    }
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

  // Keyboard shortcut: Escape closes modals
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDetailsModal();
      closeManualGrantModal();
    }
  });

  // ==========================================================================
  // INITIALIZATION ON LOAD
  // ==========================================================================
  document.addEventListener("DOMContentLoaded", () => {
    // Live Firebase Auth state listener
    if (typeof firebase !== "undefined" && firebase.auth) {
      firebase.auth().onAuthStateChanged((user) => {
        if (user && isMasterAdmin(user)) {
          grantAdminAccess(user.email, user.displayName);
          updateAdminProfileUI(user.email, user.displayName);
        }
      });
    }

    if (checkStoredMasterAdmin()) {
      unlockBackofficeUI();
    } else {
      const lockScreen = document.getElementById("admin-lock-screen");
      if (lockScreen) lockScreen.style.display = "flex";
      const inputEl = document.getElementById("admin-passkey-input");
      if (inputEl) inputEl.focus();
    }
  });

})();
