// ==========================================================================
// DXZ COMMUNITY HUB SYSTEM
// Poll voting, comment section, community join & notifications
// All data persisted in localStorage
// ==========================================================================

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  try {
    initPoll();
    initComments();
    initJoinForm();
    updateStatsCounters();
  } catch (e) {
    console.error("Error initializing hub script:", e);
  }
});

// ==========================================================================
// 1. DESIGN POLL SYSTEM
// ==========================================================================
const DESIGNS = ["flame-devil", "redago-aura", "obsidian-emperor", "curse-god"];

function getPollData() {
  const saved = localStorage.getItem("dxz_poll");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return { votes: {}, userVote: null };
    }
  }
  // Initialize with zero votes for each design
  const init = { votes: {}, userVote: null };
  DESIGNS.forEach(d => init.votes[d] = 0);
  return init;
}

function savePollData(data) {
  localStorage.setItem("dxz_poll", JSON.stringify(data));
}

function initPoll() {
  const pollData = getPollData();
  const buttons = document.querySelectorAll(".poll-vote-btn");
  const statusEl = document.getElementById("poll-status");

  // If user already voted, show results and lock
  if (pollData.userVote) {
    showPollResults(pollData);
    lockPollCards(pollData.userVote);
    if (statusEl) {
      statusEl.textContent = `You voted for "${getDesignLabel(pollData.userVote)}". Thanks for your vote!`;
      statusEl.classList.add("visible");
    }
  }

  // Attach vote handlers
  buttons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const design = btn.getAttribute("data-design");
      if (!design) return;

      const currentData = getPollData();
      if (currentData.userVote) {
        showNotification("You've already voted! One vote per person.", true);
        return;
      }

      // Record vote
      if (!currentData.votes[design]) currentData.votes[design] = 0;
      currentData.votes[design] += 1;
      currentData.userVote = design;
      savePollData(currentData);

      // Update UI
      showPollResults(currentData);
      lockPollCards(design);
      updateStatsCounters();

      if (statusEl) {
        statusEl.textContent = `You voted for "${getDesignLabel(design)}"! Thanks for your voice 🔥`;
        statusEl.classList.add("visible");
      }

      showNotification(`Vote recorded for ${getDesignLabel(design)}!`);
    });
  });
}

function showPollResults(pollData) {
  const totalVotes = Object.values(pollData.votes).reduce((sum, v) => sum + v, 0);

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
        btn.style.opacity = "0.4";
        btn.style.cursor = "not-allowed";
      }
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

// ==========================================================================
// 2. COMMENT SECTION
// ==========================================================================
function getComments() {
  const saved = localStorage.getItem("dxz_comments");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return [];
    }
  }
  return [];
}

function saveComments(comments) {
  localStorage.setItem("dxz_comments", JSON.stringify(comments));
}

function initComments() {
  renderComments();

  const form = document.getElementById("comment-form");
  const textarea = document.getElementById("comment-text");
  const charCount = document.getElementById("char-count");

  // Character counter
  if (textarea && charCount) {
    textarea.addEventListener("input", () => {
      charCount.textContent = `${textarea.value.length} / 500`;
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("comment-name");
      const textInput = document.getElementById("comment-text");

      const name = nameInput.value.trim();
      const text = textInput.value.trim();

      if (!name || !text) {
        showNotification("Please fill in your name and message.", true);
        return;
      }

      const comments = getComments();
      const newComment = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
        name: name,
        text: text,
        timestamp: Date.now()
      };

      comments.unshift(newComment); // Add to top
      saveComments(comments);
      renderComments();
      updateStatsCounters();

      // Reset form
      form.reset();
      if (charCount) charCount.textContent = "0 / 500";

      showNotification("Comment posted! 💬");
    });
  }
}

function renderComments() {
  const container = document.getElementById("comments-list");
  const emptyMsg = document.getElementById("comments-empty");
  const comments = getComments();

  if (!container) return;

  // Clear everything except the empty message placeholder
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

    const initials = comment.name.charAt(0).toUpperCase();
    const timeAgo = getTimeAgo(comment.timestamp);

    card.innerHTML = `
      <div class="comment-card-header">
        <div class="comment-author">
          <div class="comment-avatar">${initials}</div>
          <span class="comment-author-name">${escapeHtml(comment.name)}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span class="comment-time">${timeAgo}</span>
          <button class="comment-delete-btn" data-id="${comment.id}" title="Delete">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
      <div class="comment-body">${escapeHtml(comment.text)}</div>
    `;

    container.appendChild(card);
  });

  // Attach delete handlers
  container.querySelectorAll(".comment-delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      deleteComment(id);
    });
  });
}

function deleteComment(id) {
  let comments = getComments();
  comments = comments.filter(c => c.id !== id);
  saveComments(comments);
  renderComments();
  updateStatsCounters();
  showNotification("Comment deleted.", true);
}

function getTimeAgo(timestamp) {
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
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ==========================================================================
// 3. COMMUNITY JOIN & NOTIFICATION SYSTEM
// ==========================================================================
function getMembers() {
  const saved = localStorage.getItem("dxz_members");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return [];
    }
  }
  return [];
}

function saveMembers(members) {
  localStorage.setItem("dxz_members", JSON.stringify(members));
}

function isAlreadyMember() {
  return localStorage.getItem("dxz_member_joined") === "true";
}

function initJoinForm() {
  const form = document.getElementById("join-form");
  const submitBtn = document.getElementById("join-submit-btn");
  const successPanel = document.getElementById("join-success-panel");
  const enableNotifBtn = document.getElementById("enable-notif-btn");
  const testNotifBtn = document.getElementById("test-notif-btn");

  // If already joined, show success state
  if (isAlreadyMember()) {
    if (form) form.style.display = "none";
    if (successPanel) successPanel.style.display = "block";

    // Check current notification permission
    if ("Notification" in window && Notification.permission === "granted") {
      if (enableNotifBtn) {
        enableNotifBtn.innerHTML = '<i class="fa-solid fa-bell"></i> Notifications Enabled';
        enableNotifBtn.disabled = true;
        enableNotifBtn.style.opacity = "0.6";
      }
      if (testNotifBtn) testNotifBtn.style.display = "flex";
    }
  }

  // Join form submission
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("join-name");
      const emailInput = document.getElementById("join-email");

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();

      if (!name || !email) {
        showNotification("Please enter your name and email.", true);
        return;
      }

      // Save member
      const members = getMembers();
      members.push({
        name: name,
        email: email,
        joinedAt: Date.now()
      });
      saveMembers(members);
      localStorage.setItem("dxz_member_joined", "true");

      // UI Switch
      form.style.display = "none";
      if (successPanel) successPanel.style.display = "block";

      updateStatsCounters();
      showNotification(`Welcome to the faction, ${name}! 🎉`);
    });
  }

  // Enable Notifications Button
  if (enableNotifBtn) {
    enableNotifBtn.addEventListener("click", async () => {
      if (!("Notification" in window)) {
        showNotification("Your browser does not support notifications.", true);
        return;
      }

      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        enableNotifBtn.innerHTML = '<i class="fa-solid fa-bell"></i> Notifications Enabled';
        enableNotifBtn.disabled = true;
        enableNotifBtn.style.opacity = "0.6";
        if (testNotifBtn) testNotifBtn.style.display = "flex";
        showNotification("Notifications enabled! You'll be alerted on new drops.");

        // Send a welcome notification
        new Notification("Welcome to The BlueShot Faction! 🔥", {
          body: "You'll now receive alerts for new DXZ episodes, merch drops, and community polls.",
          icon: "assets/char-bsg.png"
        });
      } else if (permission === "denied") {
        showNotification("Notification permission was denied. You can enable it in browser settings.", true);
      }
    });
  }

  // Test Notification Button
  if (testNotifBtn) {
    testNotifBtn.addEventListener("click", () => {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("🔔 DXZ Alert — Test Notification", {
          body: "This is a test! Real notifications will inform you about new episodes, merch drops, and polls.",
          icon: "assets/char-bsg.png"
        });
        showNotification("Test notification sent! Check your desktop notifications.");
      } else {
        showNotification("Please enable notifications first.", true);
      }
    });
  }
}

// ==========================================================================
// 4. STATS COUNTERS (ANIMATED)
// ==========================================================================
function updateStatsCounters() {
  const memberCountEl = document.getElementById("member-count");
  const totalVotesEl = document.getElementById("total-votes");
  const totalCommentsEl = document.getElementById("total-comments");

  const members = getMembers();
  const pollData = getPollData();
  const comments = getComments();

  const totalVotes = Object.values(pollData.votes).reduce((sum, v) => sum + v, 0);

  if (memberCountEl) animateCounter(memberCountEl, members.length);
  if (totalVotesEl) animateCounter(totalVotesEl, totalVotes);
  if (totalCommentsEl) animateCounter(totalCommentsEl, comments.length);
}

function animateCounter(el, target) {
  const current = parseInt(el.textContent) || 0;
  if (current === target) return;

  const duration = 800;
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(current + (target - current) * eased);

    el.textContent = value;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

// ==========================================================================
// 5. TOAST NOTIFICATION SYSTEM
// ==========================================================================
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

  // Transition In
  setTimeout(() => {
    alertCard.classList.add("active");
  }, 10);

  // Remove after duration
  setTimeout(() => {
    alertCard.classList.remove("active");
    setTimeout(() => {
      alertCard.remove();
    }, 500);
  }, 3500);
}
