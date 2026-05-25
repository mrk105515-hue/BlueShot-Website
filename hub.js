// ==========================================================================
// DXZ COMMUNITY HUB SYSTEM
// Poll voting, comment section, community join & notifications
// Integrates with Firebase Auth & Firestore, falls back to localStorage in Demo Mode
// ==========================================================================

// Global state variables
let db = null;
let auth = null;
let isDemoMode = true;
let currentUser = null;
let unsubscribeComments = null;
let unsubscribeVotes = null;
let unsubscribeMembers = null;

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  try {
    initFirebase();
    initAuthUI();
    initPoll();
    initComments();
    initNotificationSettings();
    updateStatsCounters();
  } catch (e) {
    console.error("Error initializing hub script:", e);
  }
});

// ==========================================================================
// FIREBASE ENGINE INITIALIZATION
// ==========================================================================
function initFirebase() {
  const banner = document.getElementById("dxz-demo-banner");
  
  // Check if firebase Config is valid and loaded
  const isConfigured = typeof firebaseConfig !== 'undefined' && 
                       firebaseConfig.apiKey && 
                       firebaseConfig.apiKey !== "YOUR_API_KEY";

  if (typeof firebase !== 'undefined' && isConfigured) {
    try {
      firebase.initializeApp(firebaseConfig);
      db = firebase.firestore();
      auth = firebase.auth();
      isDemoMode = false;
      
      if (banner) banner.style.display = "none";
      console.log("DXZ Hub: Firebase Initialized (Live Online Mode)");
    } catch (e) {
      console.error("DXZ Hub: Firebase init failed. Falling back to Demo Mode.", e);
      setupDemoState();
    }
  } else {
    setupDemoState();
  }
}

function setupDemoState() {
  isDemoMode = true;
  const banner = document.getElementById("dxz-demo-banner");
  if (banner) banner.style.display = "block";
  console.log("DXZ Hub: Operating in Local Demo Mode (localStorage)");
}

// ==========================================================================
// USER AUTHENTICATION & PORTAL
// ==========================================================================
function getCurrentUser() {
  if (isDemoMode) {
    const saved = localStorage.getItem("dxz_demo_user");
    return saved ? JSON.parse(saved) : null;
  }
  return auth ? auth.currentUser : null;
}

function initAuthUI() {
  const loginTab = document.getElementById("tab-login-btn");
  const registerTab = document.getElementById("tab-register-btn");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const authBox = document.getElementById("auth-box-wrap");
  const profilePanel = document.getElementById("profile-panel");
  const logoutBtn = document.getElementById("logout-btn");

  // Tab Navigation switching
  if (loginTab && registerTab) {
    loginTab.addEventListener("click", () => {
      loginTab.classList.add("active");
      registerTab.classList.remove("active");
      if (loginForm) loginForm.style.display = "flex";
      if (registerForm) registerForm.style.display = "none";
    });

    registerTab.addEventListener("click", () => {
      registerTab.classList.add("active");
      loginTab.classList.remove("active");
      if (loginForm) loginForm.style.display = "none";
      if (registerForm) registerForm.style.display = "flex";
    });
  }

  // Handle Sign-Up/Register Form Submission
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("register-name").value.trim();
      const email = document.getElementById("register-email").value.trim();
      const password = document.getElementById("register-password").value;

      if (!name || !email || !password) return;

      const submitBtn = document.getElementById("register-submit-btn");
      const origHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `Creating Account... <i class="fa-solid fa-spinner fa-spin"></i>`;

      if (isDemoMode) {
        // Simulate registration
        setTimeout(() => {
          const mockUser = { displayName: name, email: email, uid: "demo-" + Math.random().toString(36).substr(2, 9) };
          localStorage.setItem("dxz_demo_user", JSON.stringify(mockUser));
          
          // Add to mock member database
          let members = getLocalMembers();
          members.push({ uid: mockUser.uid, name: name, email: email, joinedAt: Date.now() });
          saveLocalMembers(members);
          
          submitBtn.disabled = false;
          submitBtn.innerHTML = origHTML;
          registerForm.reset();
          showNotification(`Account created! Welcome, ${name}!`);
          onUserStateChange(mockUser);
        }, 1000);
      } else {
        try {
          // Live firebase register
          const userCredential = await auth.createUserWithEmailAndPassword(email, password);
          await userCredential.user.updateProfile({ displayName: name });
          
          // Save member document in Firestore
          await db.collection("members").doc(userCredential.user.uid).set({
            uid: userCredential.user.uid,
            name: name,
            email: email,
            joinedAt: firebase.firestore.FieldValue.serverTimestamp()
          });

          submitBtn.disabled = false;
          submitBtn.innerHTML = origHTML;
          registerForm.reset();
          showNotification(`Account created! Welcome, ${name}!`);
          // onAuthStateChanged will fire and handle UI
        } catch (err) {
          console.error("Register Error:", err);
          submitBtn.disabled = false;
          submitBtn.innerHTML = origHTML;
          showNotification(err.message, true);
        }
      }
    });
  }

  // Handle Login Form Submission
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value;

      if (!email || !password) return;

      const submitBtn = document.getElementById("login-submit-btn");
      const origHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `Logging In... <i class="fa-solid fa-spinner fa-spin"></i>`;

      if (isDemoMode) {
        // Simulate Login
        setTimeout(() => {
          const members = getLocalMembers();
          const found = members.find(m => m.email.toLowerCase() === email.toLowerCase());
          
          submitBtn.disabled = false;
          submitBtn.innerHTML = origHTML;

          if (found) {
            const mockUser = { displayName: found.name, email: found.email, uid: found.uid };
            localStorage.setItem("dxz_demo_user", JSON.stringify(mockUser));
            loginForm.reset();
            showNotification(`Logged in! Welcome back, ${found.name}.`);
            onUserStateChange(mockUser);
          } else {
            // Create user on-the-fly for easy local testing if email is new
            const defaultName = email.split('@')[0];
            const mockUser = { displayName: defaultName, email: email, uid: "demo-" + Math.random().toString(36).substr(2, 9) };
            localStorage.setItem("dxz_demo_user", JSON.stringify(mockUser));
            
            let allMembers = getLocalMembers();
            allMembers.push({ uid: mockUser.uid, name: defaultName, email: email, joinedAt: Date.now() });
            saveLocalMembers(allMembers);

            loginForm.reset();
            showNotification(`Created demo account for ${defaultName}!`);
            onUserStateChange(mockUser);
          }
        }, 800);
      } else {
        try {
          await auth.signInWithEmailAndPassword(email, password);
          submitBtn.disabled = false;
          submitBtn.innerHTML = origHTML;
          loginForm.reset();
          showNotification("Logged in successfully! 🔑");
        } catch (err) {
          console.error("Login Error:", err);
          submitBtn.disabled = false;
          submitBtn.innerHTML = origHTML;
          showNotification(err.message, true);
        }
      }
    });
  }

  // Handle Logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      if (isDemoMode) {
        localStorage.removeItem("dxz_demo_user");
        showNotification("Logged out.", true);
        onUserStateChange(null);
      } else {
        try {
          await auth.signOut();
          showNotification("Logged out successfully.", true);
        } catch (err) {
          showNotification(err.message, true);
        }
      }
    });
  }

  // Bind Authentication change triggers
  if (!isDemoMode && auth) {
    auth.onAuthStateChanged((user) => {
      onUserStateChange(user);
    });
  } else {
    // Initial load state check for local mode
    const localUser = getCurrentUser();
    onUserStateChange(localUser);
  }
}

function onUserStateChange(user) {
  currentUser = user;
  const authBox = document.getElementById("auth-box-wrap");
  const profilePanel = document.getElementById("profile-panel");
  const profileName = document.getElementById("profile-display-name");
  const profileEmail = document.getElementById("profile-email-text");
  const profileInitials = document.getElementById("profile-avatar-initials");

  if (user) {
    // Show profile panel, hide signup forms
    if (authBox) authBox.style.display = "none";
    if (profilePanel) profilePanel.style.display = "flex";
    
    if (profileName) profileName.textContent = user.displayName || "Faction Member";
    if (profileEmail) profileEmail.textContent = user.email || "";
    
    if (profileInitials) {
      const name = user.displayName || "F M";
      profileInitials.textContent = name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
    }
  } else {
    // Show signup forms, hide profile
    if (authBox) authBox.style.display = "block";
    if (profilePanel) profilePanel.style.display = "none";
  }

  // Refresh comment input states and load appropriate data
  updateCommentFormState(user);
  refreshPollUI();
  refreshCommentsUI();
  updateStatsCounters();
}

// Local storage helper databases for Demo Mode
function getLocalMembers() {
  const saved = localStorage.getItem("dxz_members");
  return saved ? JSON.parse(saved) : [];
}
function saveLocalMembers(arr) {
  localStorage.setItem("dxz_members", JSON.stringify(arr));
}

// ==========================================================================
// 1. DESIGN POLL SYSTEM
// ==========================================================================
const DESIGNS = ["flame-devil", "redago-aura", "obsidian-emperor", "curse-god"];

function initPoll() {
  const buttons = document.querySelectorAll(".poll-vote-btn");

  // Attach click listeners to vote buttons
  buttons.forEach(btn => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      
      if (!currentUser) {
        showNotification("Please log in or register to cast your vote!", true);
        document.getElementById("join-faction").scrollIntoView({ behavior: "smooth" });
        return;
      }

      const design = btn.getAttribute("data-design");
      if (!design) return;

      const submitBtn = btn;
      submitBtn.disabled = true;

      if (isDemoMode) {
        const localPoll = getLocalPollData();
        if (localPoll.userVotes && localPoll.userVotes[currentUser.uid]) {
          showNotification("You've already cast your vote!", true);
          submitBtn.disabled = false;
          return;
        }

        // Record vote
        if (!localPoll.votes[design]) localPoll.votes[design] = 0;
        localPoll.votes[design] += 1;
        if (!localPoll.userVotes) localPoll.userVotes = {};
        localPoll.userVotes[currentUser.uid] = design;
        
        saveLocalPollData(localPoll);
        showNotification(`Vote cast for ${getDesignLabel(design)}! 🎉`);
        refreshPollUI();
        updateStatsCounters();
      } else {
        try {
          // Check if user already voted in Firestore
          const voteDoc = await db.collection("votes").doc(currentUser.uid).get();
          if (voteDoc.exists) {
            showNotification("You've already cast your vote!", true);
            submitBtn.disabled = false;
            return;
          }

          // Record vote doc
          await db.collection("votes").doc(currentUser.uid).set({
            uid: currentUser.uid,
            design: design,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          });

          showNotification(`Vote recorded for ${getDesignLabel(design)}! 🎉`);
          // UI will auto-update via Firestore listener in subscribeToPoll()
        } catch (err) {
          console.error("Voting Error:", err);
          submitBtn.disabled = false;
          showNotification("Failed to save vote. Check security rules.", true);
        }
      }
    });
  });
}

function refreshPollUI() {
  if (isDemoMode) {
    const localPoll = getLocalPollData();
    const votedDesign = currentUser && localPoll.userVotes ? localPoll.userVotes[currentUser.uid] : null;
    
    if (votedDesign) {
      showPollResults(localPoll);
      lockPollCards(votedDesign);
    } else {
      unlockPollCards();
    }
  } else {
    // Setup Firestore live poll listener
    subscribeToPoll();
  }
}

function subscribeToPoll() {
  if (unsubscribeVotes) unsubscribeVotes();

  if (!db) return;

  unsubscribeVotes = db.collection("votes").onSnapshot(snapshot => {
    // Tally votes from snapshot
    const tally = { votes: {}, userVotes: {} };
    DESIGNS.forEach(d => tally.votes[d] = 0);

    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.design && DESIGNS.includes(data.design)) {
        tally.votes[data.design] += 1;
      }
      tally.userVotes[doc.id] = data.design;
    });

    const votedDesign = currentUser ? tally.userVotes[currentUser.uid] : null;
    
    showPollResults(tally);
    if (votedDesign) {
      lockPollCards(votedDesign);
    } else {
      unlockPollCards();
    }
  }, err => {
    console.error("Firestore poll subscribe error:", err);
  });
}

function showPollResults(pollData) {
  const totalVotes = Object.values(pollData.votes).reduce((sum, v) => sum + v, 0);
  const statusEl = document.getElementById("poll-status");

  DESIGNS.forEach(design => {
    const votes = pollData.votes[design] || 0;
    const percent = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

    const barFill = document.querySelector(`.poll-bar-fill[data-design="${design}"]`);
    const barPercent = barFill ? barFill.closest(".poll-result-bar").querySelector(".poll-bar-percent") : null;

    if (barFill) {
      setTimeout(() => {
        barFill.style.width = percent + "%";
      }, 100);
    }
    if (barPercent) {
      barPercent.textContent = `${percent}% (${votes} vote${votes !== 1 ? "s" : ""})`;
    }
  });

  if (currentUser && pollData.userVotes && pollData.userVotes[currentUser.uid] && statusEl) {
    const userVote = pollData.userVotes[currentUser.uid];
    statusEl.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #2ECC71; margin-right: 0.5rem;"></i> You voted for <strong>"${getDesignLabel(userVote)}"</strong>. Thanks for participating!`;
    statusEl.classList.add("visible");
  } else if (statusEl) {
    statusEl.classList.remove("visible");
  }
}

function lockPollCards(votedDesign) {
  const cards = document.querySelectorAll(".poll-card");
  cards.forEach(card => {
    const design = card.getAttribute("data-design");
    const btn = card.querySelector(".poll-vote-btn");

    if (design === votedDesign) {
      card.classList.add("voted");
      if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Voted';
        btn.disabled = true;
      }
    } else {
      if (btn) {
        btn.disabled = true;
        btn.style.opacity = "0.3";
        btn.style.cursor = "not-allowed";
      }
    }
  });
}

function unlockPollCards() {
  const cards = document.querySelectorAll(".poll-card");
  cards.forEach(card => {
    card.classList.remove("voted");
    const btn = card.querySelector(".poll-vote-btn");
    const design = card.getAttribute("data-design");
    if (btn) {
      btn.disabled = false;
      btn.style.opacity = "";
      btn.style.cursor = "";
      
      // Restore icons
      let icon = "fa-fire";
      if (design === "redago-aura") icon = "fa-bolt";
      else if (design === "obsidian-emperor") icon = "fa-crown";
      else if (design === "curse-god") icon = "fa-skull";
      btn.innerHTML = `<i class="fa-solid ${icon}"></i> Vote`;
    }
  });
}

function getDesignLabel(design) {
  const labels = {
    "flame-devil": "Flame Devil",
    "redago-aura": "Redago Aura",
    "obsidian-emperor": "Obsidian Emperor",
    "curse-god": "Curse God Zalta"
  };
  return labels[design] || design;
}

// Local Storage Poll Data structure (fallback)
function getLocalPollData() {
  const saved = localStorage.getItem("dxz_poll");
  if (saved) {
    try {
      const data = JSON.parse(saved);
      if (!data.userVotes) data.userVotes = {};
      return data;
    } catch (e) {
      // Fallback fallback
    }
  }
  const init = { votes: {}, userVotes: {} };
  DESIGNS.forEach(d => init.votes[d] = 0);
  return init;
}
function saveLocalPollData(data) {
  localStorage.setItem("dxz_poll", JSON.stringify(data));
}

// ==========================================================================
// 2. COMMENT SECTION
// ==========================================================================
function initComments() {
  const form = document.getElementById("comment-form");
  const textarea = document.getElementById("comment-text");
  const charCount = document.getElementById("char-count");

  if (textarea && charCount) {
    textarea.addEventListener("input", () => {
      charCount.textContent = `${textarea.value.length} / 500`;
    });
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      if (!currentUser) {
        showNotification("Please log in first!", true);
        return;
      }

      const textInput = document.getElementById("comment-text");
      const text = textInput.value.trim();

      if (!text) {
        showNotification("Please write a message.", true);
        return;
      }

      const submitBtn = form.querySelector("button[type='submit']");
      submitBtn.disabled = true;

      if (isDemoMode) {
        // Save locally
        const comments = getLocalComments();
        const newComment = {
          id: Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
          name: currentUser.displayName,
          authorId: currentUser.uid,
          text: text,
          timestamp: Date.now()
        };

        comments.unshift(newComment);
        saveLocalComments(comments);
        
        submitBtn.disabled = false;
        textInput.value = "";
        if (charCount) charCount.textContent = "0 / 500";
        showNotification("Comment posted! 💬");
        
        refreshCommentsUI();
        updateStatsCounters();
      } else {
        try {
          // Write to Firestore
          await db.collection("comments").add({
            name: currentUser.displayName || "Anonymous",
            authorId: currentUser.uid,
            text: text,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          });

          submitBtn.disabled = false;
          textInput.value = "";
          if (charCount) charCount.textContent = "0 / 500";
          showNotification("Comment posted! 💬");
          // UI will auto-refresh via Firestore onSnapshot
        } catch (err) {
          console.error("Firestore Add Comment Error:", err);
          submitBtn.disabled = false;
          showNotification("Failed to post comment. Check security rules.", true);
        }
      }
    });
  }
}

function updateCommentFormState(user) {
  const nameInput = document.getElementById("comment-name");
  const textInput = document.getElementById("comment-text");
  const submitBtn = document.querySelector(".comment-submit-btn");

  if (!nameInput || !textInput || !submitBtn) return;

  if (user) {
    nameInput.value = user.displayName || "Anonymous";
    nameInput.disabled = true; // Locked to user account profile name
    textInput.disabled = false;
    textInput.placeholder = "Share your thoughts, theories, or requests...";
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Post Comment`;
    submitBtn.onclick = null;
  } else {
    nameInput.value = "";
    nameInput.disabled = true;
    textInput.disabled = true;
    textInput.placeholder = "Log in or register to join the discussion and post comments...";
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> Log In to Comment`;
    submitBtn.onclick = (e) => {
      e.preventDefault();
      document.getElementById("join-faction").scrollIntoView({ behavior: "smooth" });
    };
  }
}

function refreshCommentsUI() {
  if (isDemoMode) {
    renderCommentsList(getLocalComments());
  } else {
    subscribeToComments();
  }
}

function subscribeToComments() {
  if (unsubscribeComments) unsubscribeComments();

  if (!db) return;

  unsubscribeComments = db.collection("comments")
    .orderBy("timestamp", "desc")
    .onSnapshot(snapshot => {
      const comments = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        comments.push({
          id: doc.id,
          name: data.name,
          authorId: data.authorId,
          text: data.text,
          timestamp: data.timestamp ? (data.timestamp.seconds * 1000) : Date.now()
        });
      });
      renderCommentsList(comments);
      updateStatsCounters();
    }, err => {
      console.error("Firestore comments subscribe error:", err);
    });
}

function renderCommentsList(comments) {
  const container = document.getElementById("comments-list");
  if (!container) return;

  container.innerHTML = "";

  if (comments.length === 0) {
    container.innerHTML = `
      <div class="comments-empty">
        <i class="fa-solid fa-comment-dots"></i>
        <p>No comments yet. Be the first to share your thoughts!</p>
      </div>
    `;
    return;
  }

  comments.forEach(comment => {
    const card = document.createElement("div");
    card.className = "comment-card";

    const initials = comment.name ? comment.name.charAt(0).toUpperCase() : "?";
    const timeAgo = getTimeAgo(comment.timestamp);
    const isAuthor = currentUser && currentUser.uid === comment.authorId;

    card.innerHTML = `
      <div class="comment-card-header">
        <div class="comment-author">
          <div class="comment-avatar">${initials}</div>
          <span class="comment-author-name">${escapeHtml(comment.name)}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span class="comment-time">${timeAgo}</span>
          ${isAuthor ? `
            <button class="comment-delete-btn" data-id="${comment.id}" title="Delete">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          ` : ''}
        </div>
      </div>
      <div class="comment-body">${escapeHtml(comment.text)}</div>
    `;

    container.appendChild(card);
  });

  // Bind delete button listeners
  container.querySelectorAll(".comment-delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      triggerDeleteComment(id);
    });
  });
}

async function triggerDeleteComment(id) {
  if (isDemoMode) {
    let comments = getLocalComments();
    comments = comments.filter(c => c.id !== id);
    saveLocalComments(comments);
    showNotification("Comment deleted.", true);
    refreshCommentsUI();
    updateStatsCounters();
  } else {
    try {
      await db.collection("comments").doc(id).delete();
      showNotification("Comment deleted.", true);
      // UI updates via snapshot listener
    } catch (err) {
      console.error("Firestore Delete Comment Error:", err);
      showNotification("Failed to delete comment.", true);
    }
  }
}

// Local storage comments fallback database
function getLocalComments() {
  const saved = localStorage.getItem("dxz_comments");
  return saved ? JSON.parse(saved) : [];
}
function saveLocalComments(arr) {
  localStorage.setItem("dxz_comments", JSON.stringify(arr));
}

// ==========================================================================
// 3. COMMUNITY MEMBERSHIP & NOTIFICATIONS
// ==========================================================================
function initNotificationSettings() {
  const enableNotifBtn = document.getElementById("enable-notif-btn");
  const testNotifBtn = document.getElementById("test-notif-btn");

  // Load notification configuration trigger states
  if ("Notification" in window && Notification.permission === "granted") {
    if (enableNotifBtn) {
      enableNotifBtn.innerHTML = '<i class="fa-solid fa-bell"></i> Notifications Enabled';
      enableNotifBtn.disabled = true;
      enableNotifBtn.style.opacity = "0.6";
    }
    if (testNotifBtn) testNotifBtn.style.display = "flex";
  }

  // Request notifications permission
  if (enableNotifBtn) {
    enableNotifBtn.addEventListener("click", async () => {
      if (!("Notification" in window)) {
        showNotification("Your browser does not support desktop notifications.", true);
        return;
      }

      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        enableNotifBtn.innerHTML = '<i class="fa-solid fa-bell"></i> Notifications Enabled';
        enableNotifBtn.disabled = true;
        enableNotifBtn.style.opacity = "0.6";
        if (testNotifBtn) testNotifBtn.style.display = "flex";
        showNotification("Notifications enabled! You will receive future announcements.");

        new Notification("Welcome to The BlueShot Faction! 🔥", {
          body: "Notifications are successfully configured. You will be alerted on new episodes and drops.",
          icon: "assets/char-bsg.png"
        });
      } else if (permission === "denied") {
        showNotification("Notification permission was denied. You can enable it in browser settings.", true);
      }
    });
  }

  // Send test desktop notification
  if (testNotifBtn) {
    testNotifBtn.addEventListener("click", () => {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("🔔 DXZ Alert — Test Notification", {
          body: "This is a test notification. Real alerts will notify you of new Season 3 content releases and products.",
          icon: "assets/char-bsg.png"
        });
        showNotification("Test notification sent! Check your desktop notifications.");
      } else {
        showNotification("Please enable notifications first.", true);
      }
    });
  }
}

// Setup real-time member counters
function updateStatsCounters() {
  if (isDemoMode) {
    const members = getLocalMembers();
    const pollData = getLocalPollData();
    const comments = getLocalComments();

    const totalVotes = Object.values(pollData.votes).reduce((sum, v) => sum + v, 0);

    animateCounter("member-count", members.length);
    animateCounter("total-votes", totalVotes);
    animateCounter("total-comments", comments.length);
  } else {
    subscribeToStats();
  }
}

function subscribeToStats() {
  if (!db) return;

  // Real-time counting of members collection
  if (unsubscribeMembers) unsubscribeMembers();
  unsubscribeMembers = db.collection("members").onSnapshot(snap => {
    animateCounter("member-count", snap.size);
  });

  // Realtime comments count
  db.collection("comments").onSnapshot(snap => {
    animateCounter("total-comments", snap.size);
  });

  // Realtime votes count
  db.collection("votes").onSnapshot(snap => {
    animateCounter("total-votes", snap.size);
  });
}

function animateCounter(elementId, target) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const current = parseInt(el.textContent) || 0;
  if (current === target) return;

  const duration = 800;
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
    const value = Math.round(current + (target - current) * eased);

    el.textContent = value;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

// ==========================================================================
// UTILITY HELPERS
// ==========================================================================
function getTimeAgo(timestamp) {
  if (!timestamp) return "just now";
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function escapeHtml(str) {
  if (!str) return "";
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function rgbToHex(rgbStr) {
  if (!rgbStr) return "#ffffff";
  if (!rgbStr.startsWith("rgb")) return rgbStr;
  const match = rgbStr.match(/\d+/g);
  if (!match) return rgbStr;
  const r = parseInt(match[0]);
  const g = parseInt(match[1]);
  const b = parseInt(match[2]);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function showNotification(message, isError = false) {
  const alertsContainer = document.getElementById("alert-container");
  if (!alertsContainer) return;

  const alertCard = document.createElement("div");
  alertCard.className = `alert-card ${isError ? 'error' : ''}`;
  alertCard.innerHTML = `
    <i class="${isError ? 'fa-solid fa-circle-xmark' : 'fa-solid fa-circle-check'}"></i>
    <span>${message}</span>
  `;

  alertsContainer.appendChild(alertCard);

  setTimeout(() => {
    alertCard.classList.add("active");
  }, 10);

  setTimeout(() => {
    alertCard.classList.remove("active");
    setTimeout(() => {
      alertCard.remove();
    }, 500);
  }, 3500);
}
