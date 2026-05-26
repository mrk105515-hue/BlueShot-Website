// ==========================================================================
// DXZ BATTLE ARENA SYSTEMS
// Character select, audio synthesis, timing gauges, combat loop & scores
// ==========================================================================

// Global state variables
let db = null;
let auth = null;
let isDemoMode = true;
let currentUser = null;
let activeFighter = null;

// Game state variables
let playerHP = 100;
let playerMaxHP = 100;
let playerEnergy = 0;
let opponentHP = 100;
let opponentMaxHP = 100;
let opponentEnergy = 0;
let currentOpponent = null;
let combatPhase = "select"; // select, battle, result
let perfectHits = 0;
let totalTurns = 0;

// Multiplayer matchmaking & synchronization state
let activeMatchId = null;
let activeMatchRef = null;
let unsubscribeMatch = null;
let playerRole = null; // "host" or "opponent"
let lastProcessedTurn = null;
let lastActionTimestamp = null;

// Matchmaking timeout timer state
let matchmakingTimerId = null;
let matchmakingTimeLeft = 60;

// Gauge physics loop
let gaugePosition = 0;
let gaugeDirection = 1;
let gaugeSpeed = 2.5; // Controls moving pointer speed
let isPointerMoving = false;
let animationFrameId = null;
let activeAttackIndex = null; // 1, 2, or 3
let attackCooldowns = [0, 0, 0]; // Turn cooldown trackers for player attacks

// Synth Audio Engine
let audioCtx = null;

// Character Master Database
const CHARACTERS = {
  bsg: {
    name: "BSG",
    title: "Flame Devil V3.0",
    avatar: "BF",
    hp: 120,
    attack: 25,
    speed: 1.2,
    redago: false,
    dialogues: {
      intro: "You cannot stand against the Flame Devil aura. Taste revenge!",
      strike: "Flame Slash! Burn!",
      special: "Dragon Aura surge! Speed up!",
      ultimate: "1% Celestial Beast Release! DIE!",
      damaged: "Urgh... I'll strike back twice as hard!",
      victory: "The Beyond State is mine. Conquer your dark self!"
    },
    moves: [
      { name: "Flame Slash", dmg: 10, speed: 2.0, cd: 0, desc: "A quick slash with low damage, slow slider speed, and no cooldown." },
      { name: "Dragon Aura", dmg: 20, speed: 3.5, cd: 2, desc: "An aura burst with medium damage. 2 turns cooldown." },
      { name: "Celestial Release", dmg: 45, speed: 5.5, cd: 4, desc: "Release 1% power. Devastating damage, extremely fast slider speed. Requires 100% Energy." }
    ]
  },
  hell: {
    name: "Hell",
    title: "West Emperor",
    avatar: "HE",
    hp: 100,
    attack: 30,
    speed: 1.0,
    redago: true,
    dialogues: {
      intro: "Your fate has already been written. It ends here.",
      strike: "Fate Cut! Your timeline splits.",
      special: "Timeline Edit... Rewriting your attacks.",
      ultimate: "Absolute Erase! Wipe from existence!",
      damaged: "A scratch... You cannot change the author's script.",
      victory: "As written. Your demise was foretold."
    },
    moves: [
      { name: "Fate Cut", dmg: 12, speed: 2.2, cd: 0, desc: "Quick blade strike with low damage, easy speed, no cooldown." },
      { name: "Timeline Edit", dmg: 24, speed: 3.8, cd: 2, desc: "Alter probability for high damage. 2 turns cooldown." },
      { name: "Absolute Erase", dmg: 55, speed: 6.0, cd: 4, desc: "Erase the opponent. High critical scaling. Requires 100% Energy." }
    ]
  },
  jiggo: {
    name: "Emperor Jiggo",
    title: "Legendary Mentor",
    avatar: "JD",
    hp: 140,
    attack: 20,
    speed: 1.4,
    redago: false,
    dialogues: {
      intro: "Step into the dark dimension. Let's see your combat timing.",
      strike: "Portal Strike! Watch your back.",
      special: "Void Swap! Control the spacing.",
      ultimate: "Eastern Dimension Shatter! Absorb their power!",
      damaged: "Good timing. But your foundation is lacking.",
      victory: "Control your mind. Only then can you conquer power."
    },
    moves: [
      { name: "Portal Strike", dmg: 8, speed: 1.8, cd: 0, desc: "Ambush from portal. Slow slider speed, no cooldown." },
      { name: "Void Swap", dmg: 18, speed: 3.0, cd: 2, desc: "Swapping positions to confuse defenses. 2 turns cooldown." },
      { name: "Eastern Dimension", dmg: 38, speed: 5.0, cd: 4, desc: "Summon the dimensional void. Medium timing bar. Requires 100% Energy." }
    ]
  },
  zalta: {
    name: "Curse God Zalta",
    title: "Dark Bull Beast",
    avatar: "CZ",
    hp: 150,
    attack: 22,
    speed: 0.85,
    redago: true,
    dialogues: {
      intro: "I escaped Infinity Prison for this! Crush you!",
      strike: "Bull Stomp! Tremble before me!",
      special: "Rampage Stride! Unstoppable force!",
      ultimate: "Curse God Awaken! Destructive rage!",
      damaged: "RAAARGH! That only made me angry!",
      victory: "Zalta is the strongest! Back to the cage with you!"
    },
    moves: [
      { name: "Bull Stomp", dmg: 9, speed: 2.5, cd: 0, desc: "Heavy stomp. Average speed, no cooldown." },
      { name: "Rampage Stride", dmg: 19, speed: 4.0, cd: 2, desc: "A brutal charge. 2 turns cooldown." },
      { name: "Curse God Awaken", dmg: 40, speed: 6.5, cd: 4, desc: "Unleash curse bull energy. Destructive timing window. Requires 100% Energy." }
    ]
  }
};

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  try {
    initFirebaseConnection();
    setupAuthListeners();
    setupLobbyControls();
    setupCombatControls();
    loadLeaderboardUI();

    // Cleanup match document on unexpected tab closes/reloads
    window.addEventListener("beforeunload", () => {
      if (activeMatchRef) {
        if (playerRole === "host" && combatPhase === "select") {
          activeMatchRef.delete();
        } else if (combatPhase === "battle") {
          activeMatchRef.update({
            status: "forfeited",
            forfeitedBy: currentUser.uid
          });
        }
      }
    });
  } catch (e) {
    console.error("DXZ Arena: Setup failed:", e);
  }
});

// ==========================================================================
// AUDIO SYNTH ENGINE (WEB AUDIO API)
// ==========================================================================
function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playSound(type) {
  try {
    initAudio();
    if (!audioCtx) return;

    const time = audioCtx.currentTime;
    
    if (type === "click") {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, time);
      osc.frequency.exponentialRampToValueAtTime(100, time + 0.1);
      gain.gain.setValueAtTime(0.1, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(time);
      osc.stop(time + 0.1);
    }
    
    else if (type === "critical") {
      // Powerful metal explosion/synth burst
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(150, time);
      osc1.frequency.linearRampToValueAtTime(800, time + 0.25);
      
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(154, time);
      osc2.frequency.linearRampToValueAtTime(808, time + 0.25);

      filter.type = "peaking";
      filter.frequency.setValueAtTime(200, time);
      filter.frequency.exponentialRampToValueAtTime(2000, time + 0.3);

      gain.gain.setValueAtTime(0.25, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.45);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + 0.45);
      osc2.stop(time + 0.45);
    }
    
    else if (type === "hit") {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(300, time);
      osc.frequency.linearRampToValueAtTime(100, time + 0.25);
      gain.gain.setValueAtTime(0.15, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(time);
      osc.stop(time + 0.25);
    }
    
    else if (type === "miss") {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(180, time);
      osc.frequency.linearRampToValueAtTime(80, time + 0.4);
      gain.gain.setValueAtTime(0.15, time);
      gain.gain.linearRampToValueAtTime(0.001, time + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(time);
      osc.stop(time + 0.4);
    }
    
    else if (type === "victory") {
      // Arpeggio
      const notes = [261.63, 329.63, 392.00, 523.25]; // C E G C
      notes.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, time + (index * 0.12));
        gain.gain.setValueAtTime(0.1, time + (index * 0.12));
        gain.gain.exponentialRampToValueAtTime(0.001, time + (index * 0.12) + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(time + (index * 0.12));
        osc.stop(time + (index * 0.12) + 0.35);
      });
    }
    
    else if (type === "defeat") {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(120, time);
      osc.frequency.linearRampToValueAtTime(40, time + 0.7);
      gain.gain.setValueAtTime(0.15, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.7);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(time);
      osc.stop(time + 0.7);
    }
  } catch (e) {
    console.warn("Synth Audio Error:", e);
  }
}

// ==========================================================================
// FIREBASE CONNECTIONS
// ==========================================================================
function initFirebaseConnection() {
  const isConfigured = typeof firebaseConfig !== 'undefined' && 
                       firebaseConfig.apiKey && 
                       firebaseConfig.apiKey !== "YOUR_API_KEY";

  if (typeof firebase !== 'undefined' && isConfigured) {
    try {
      if (firebase.apps.length === 0) {
        firebase.initializeApp(firebaseConfig);
      }
      db = firebase.firestore();
      auth = firebase.auth();
      isDemoMode = false;
      console.log("DXZ Arena: Firebase Initialized (Live Online Mode)");
    } catch (e) {
      console.error("DXZ Arena: Firebase init failed. Falling back to Demo Mode.", e);
      isDemoMode = true;
    }
  } else {
    isDemoMode = true;
    console.log("DXZ Arena: Operating in Local Demo Mode (localStorage)");
  }
}

function setupAuthListeners() {
  const guestLock = document.getElementById("arena-guest-lock");
  const lobby = document.getElementById("arena-lobby");
  const combat = document.getElementById("arena-combat");

  const updateUIForAuth = (user) => {
    currentUser = user;
    if (user) {
      if (guestLock) guestLock.style.display = "none";
      if (combatPhase === "battle") {
        if (combat) combat.style.display = "block";
        if (lobby) lobby.style.display = "none";
      } else {
        if (lobby) lobby.style.display = "block";
        if (combat) combat.style.display = "none";
      }
    } else {
      if (guestLock) guestLock.style.display = "flex";
      if (lobby) lobby.style.display = "none";
      if (combat) combat.style.display = "none";
    }
    loadLeaderboardUI();
  };

  if (!isDemoMode && auth) {
    auth.onAuthStateChanged((user) => {
      updateUIForAuth(user);
    });
  } else {
    // Local Demo Auth checking
    const checkDemoUser = () => {
      const saved = localStorage.getItem("dxz_demo_user");
      const user = saved ? JSON.parse(saved) : null;
      updateUIForAuth(user);
    };
    checkDemoUser();
    window.addEventListener("dxz_user_changed", checkDemoUser);
  }
}

// ==========================================================================
// GAME LOBBY LOGIC
// ==========================================================================
function setupLobbyControls() {
  const cards = document.querySelectorAll(".select-card");
  const placeholder = document.getElementById("lobby-details-placeholder");
  const content = document.getElementById("lobby-details-content");

  cards.forEach(card => {
    card.addEventListener("click", () => {
      playSound("click");
      cards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");

      const key = card.getAttribute("data-char");
      showCharacterDetails(key);
    });
  });

  const startBtn = document.getElementById("btn-start-fight");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      if (activeFighter) {
        playSound("victory");
        enterCombatState();
      }
    });
  }

  const startPracticeBtn = document.getElementById("btn-start-practice");
  if (startPracticeBtn) {
    startPracticeBtn.addEventListener("click", () => {
      if (activeFighter) {
        playSound("victory");
        startOfflineMatch();
      }
    });
  }
}

function showCharacterDetails(key) {
  const char = CHARACTERS[key];
  if (!char) return;

  activeFighter = key;

  const placeholder = document.getElementById("lobby-details-placeholder");
  const content = document.getElementById("lobby-details-content");

  if (placeholder) placeholder.style.display = "none";
  if (content) content.style.display = "block";

  // Bind values
  document.getElementById("details-name").textContent = char.name;
  document.getElementById("details-title").textContent = char.title;
  
  const badge = document.getElementById("details-title");
  if (char.redago) {
    badge.className = "faction-badge redago-theme";
  } else {
    badge.className = "faction-badge";
  }

  document.getElementById("details-hp").textContent = char.hp;
  document.getElementById("details-attack").textContent = char.attack;
  document.getElementById("details-speed").textContent = Math.round(char.speed * 100) + "%";

  const avatar = document.getElementById("details-avatar");
  avatar.textContent = char.avatar;
  avatar.style.background = char.redago ? 
    "linear-gradient(135deg, var(--color-redago), #e74c3c)" : 
    "linear-gradient(135deg, var(--color-blue-electric), var(--color-blue-neon))";
  avatar.style.borderColor = char.redago ? "var(--color-redago)" : "var(--color-blue-neon)";
  avatar.style.boxShadow = char.redago ? "0 0 8px var(--color-redago)" : "0 0 8px var(--color-blue-neon)";

  // Load Move details
  document.getElementById("move1-name").textContent = char.moves[0].name;
  document.getElementById("move1-desc").textContent = char.moves[0].desc;
  document.getElementById("move2-name").textContent = char.moves[1].name;
  document.getElementById("move2-desc").textContent = char.moves[1].desc;
  document.getElementById("move3-name").textContent = char.moves[2].name;
  document.getElementById("move3-desc").textContent = char.moves[2].desc;
}

// ==========================================================================
// COMBAT DECK CONTROLS
// ==========================================================================
function setupCombatControls() {
  const attack1 = document.getElementById("btn-attack-1");
  const attack2 = document.getElementById("btn-attack-2");
  const attack3 = document.getElementById("btn-attack-3");
  const forfeit = document.getElementById("btn-forfeit");
  
  const resultLobby = document.getElementById("btn-result-lobby");
  const resultLboard = document.getElementById("btn-result-leaderboard");

  if (attack1) {
    attack1.addEventListener("click", () => triggerAttack(0));
  }
  if (attack2) {
    attack2.addEventListener("click", () => triggerAttack(1));
  }
  if (attack3) {
    attack3.addEventListener("click", () => triggerAttack(2));
  }
  
  if (forfeit) {
    forfeit.addEventListener("click", async () => {
      playSound("defeat");
      if (!isDemoMode && activeMatchRef) {
        try {
          await activeMatchRef.update({
            status: "forfeited",
            forfeitedBy: currentUser.uid
          });
        } catch (e) {
          console.error("Error setting forfeit status:", e);
        }
      } else {
        endCombat(false);
      }
    });
  }

  // Mobile/Mouse tap direct-on-gauge timing execution
  const timingGauge = document.getElementById("timing-gauge");
  if (timingGauge) {
    const handleGaugeTap = (e) => {
      if (isPointerMoving) {
        e.preventDefault();
        executeTimingCapture();
      }
    };
    timingGauge.addEventListener("click", handleGaugeTap);
    timingGauge.addEventListener("touchstart", handleGaugeTap, { passive: false });
  }

  // Keyboard actions for timings (Keys 1, 2, 3 and Spacebar)
  document.addEventListener("keydown", (e) => {
    if (combatPhase !== "battle") return;

    if (e.key === "1") {
      triggerAttack(0);
    } else if (e.key === "2") {
      triggerAttack(1);
    } else if (e.key === "3") {
      triggerAttack(2);
    } else if (e.key === " " || e.code === "Space") {
      // Space trigger executes the currently active choice button
      e.preventDefault();
      if (activeAttackIndex !== null) {
        executeTimingCapture();
      } else {
        // Default to Attack 1 if none active
        triggerAttack(0);
      }
    }
  });

  if (resultLobby) {
    resultLobby.addEventListener("click", () => {
      playSound("click");
      document.getElementById("arena-result").style.display = "none";
      combatPhase = "select";
      setupAuthListeners(); // refreshes view
    });
  }

  if (resultLboard) {
    resultLboard.addEventListener("click", () => {
      playSound("click");
      document.getElementById("arena-result").style.display = "none";
      combatPhase = "select";
      setupAuthListeners();
      document.querySelector(".leaderboard-section").scrollIntoView({ behavior: "smooth" });
    });
  }
}

// ==========================================================================
// BATTLE ARENA ENGINE (COMBAT STATE MACHINE)
// ==========================================================================
function enterCombatState() {
  if (!currentUser) {
    showNotification("Access Denied: Only authenticated faction members can enter combat!", true);
    return;
  }

  // Reset matchmaking state
  activeMatchId = null;
  activeMatchRef = null;
  unsubscribeMatch = null;
  playerRole = null;
  lastProcessedTurn = null;
  lastActionTimestamp = null;

  if (isDemoMode) {
    startOfflineMatch();
  } else {
    // Show matchmaking overlay
    document.getElementById("arena-lobby").style.display = "none";
    document.getElementById("arena-matchmaking").style.display = "flex";
    document.getElementById("arena-combat").style.display = "none";
    document.getElementById("arena-result").style.display = "none";
    
    findMultiplayerMatch();
  }
}

async function findMultiplayerMatch() {
  const p = CHARACTERS[activeFighter];
  const cancelBtn = document.getElementById("btn-cancel-matchmaking");
  
  document.getElementById("matchmaking-fighter-name").textContent = p.name;
  
  if (cancelBtn) {
    cancelBtn.onclick = () => {
      cancelMatchmaking();
    };
  }

  // Start 1 minute matchmaking countdown
  startMatchmakingTimer();

  try {
    const matchesRef = db.collection("matches");
    const snapshot = await matchesRef
      .where("status", "==", "waiting")
      .limit(1)
      .get();
      
    if (!snapshot.empty) {
      // Join existing match
      const doc = snapshot.docs[0];
      activeMatchId = doc.id;
      activeMatchRef = doc.ref;
      playerRole = "opponent";
      
      const matchData = doc.data();
      currentOpponent = matchData.host.fighter;
      
      await activeMatchRef.update({
        opponent: {
          uid: currentUser.uid,
          name: currentUser.displayName || "Warrior",
          fighter: activeFighter,
          maxHp: p.hp,
          hp: p.hp,
          energy: 0
        },
        status: "active",
        currentTurn: "host",
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      console.log("Multiplayer: Joined match " + activeMatchId + " as opponent");
      setupMatchListeners();
    } else {
      // Create new match
      playerRole = "host";
      
      const newMatchDoc = await matchesRef.add({
        host: {
          uid: currentUser.uid,
          name: currentUser.displayName || "Warrior",
          fighter: activeFighter,
          maxHp: p.hp,
          hp: p.hp,
          energy: 0
        },
        opponent: null,
        status: "waiting",
        currentTurn: "host",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      activeMatchId = newMatchDoc.id;
      activeMatchRef = newMatchDoc;
      
      console.log("Multiplayer: Created new match " + activeMatchId + " as host. Waiting for opponent...");
      setupMatchListeners();
    }
  } catch (err) {
    console.error("Matchmaking error:", err);
    showNotification("Matchmaking failed. Switching to offline AI Practice Mode.", true);
    startOfflineMatch();
  }
}

async function cancelMatchmaking() {
  playSound("defeat");
  
  // Clear matchmaking timer
  clearMatchmakingTimer();

  if (unsubscribeMatch) {
    unsubscribeMatch();
    unsubscribeMatch = null;
  }
  
  if (activeMatchRef && playerRole === "host") {
    try {
      await activeMatchRef.delete();
      console.log("Matchmaking cancelled: match document deleted");
    } catch (e) {
      console.error("Error deleting match doc:", e);
    }
  }
  
  activeMatchId = null;
  activeMatchRef = null;
  playerRole = null;
  
  document.getElementById("arena-matchmaking").style.display = "none";
  document.getElementById("arena-lobby").style.display = "block";
}

function startMatchmakingTimer() {
  // Clear any existing timer first
  clearMatchmakingTimer();

  matchmakingTimeLeft = 60;
  const timerEl = document.getElementById("matchmaking-timer");
  if (timerEl) {
    timerEl.textContent = `Finding opponent... (Auto-practice in ${matchmakingTimeLeft}s)`;
  }

  matchmakingTimerId = setInterval(() => {
    matchmakingTimeLeft--;
    if (timerEl) {
      timerEl.textContent = `Finding opponent... (Auto-practice in ${matchmakingTimeLeft}s)`;
    }

    if (matchmakingTimeLeft <= 0) {
      clearMatchmakingTimer();
      handleMatchmakingTimeout();
    }
  }, 1000);
}

function clearMatchmakingTimer() {
  if (matchmakingTimerId) {
    clearInterval(matchmakingTimerId);
    matchmakingTimerId = null;
  }
}

async function handleMatchmakingTimeout() {
  console.log("Matchmaking timed out (1 min). Switching to AI Practice Mode...");
  showNotification("No online players found. Switching to AI Practice Mode!", false);

  if (unsubscribeMatch) {
    unsubscribeMatch();
    unsubscribeMatch = null;
  }

  if (activeMatchRef && playerRole === "host") {
    try {
      await activeMatchRef.delete();
      console.log("Matchmaking timeout: host match document deleted");
    } catch (e) {
      console.error("Error deleting match doc on timeout:", e);
    }
  }

  activeMatchId = null;
  activeMatchRef = null;
  playerRole = null;

  startOfflineMatch();
}

function setupMatchListeners() {
  if (!activeMatchRef) return;
  
  unsubscribeMatch = activeMatchRef.onSnapshot((doc) => {
    if (!doc.exists) return;
    
    const data = doc.data();
    
    // 1. If matchmaking wait
    if (data.status === "waiting") {
      document.getElementById("arena-lobby").style.display = "none";
      document.getElementById("arena-matchmaking").style.display = "flex";
      document.getElementById("arena-combat").style.display = "none";
      return;
    }
    
    // 2. If match is active
    if (data.status === "active") {
      // Clear matchmaking timer since match is found
      clearMatchmakingTimer();

      document.getElementById("arena-matchmaking").style.display = "none";
      document.getElementById("arena-lobby").style.display = "none";
      document.getElementById("arena-combat").style.display = "block";
      
      const hostData = data.host;
      const oppData = data.opponent;
      
      if (!oppData) return;
      
      currentOpponent = playerRole === "host" ? oppData.fighter : hostData.fighter;
      
      const playerStat = playerRole === "host" ? hostData : oppData;
      const oppStat = playerRole === "host" ? oppData : hostData;
      
      playerHP = playerStat.hp;
      playerMaxHP = playerStat.maxHp;
      playerEnergy = playerStat.energy;
      
      opponentHP = oppStat.hp;
      opponentMaxHP = oppStat.maxHp;
      opponentEnergy = oppStat.energy;
      
      const pChar = CHARACTERS[activeFighter];
      const oChar = CHARACTERS[currentOpponent];
      
      document.getElementById("player-fighter-name").textContent = playerStat.name + " (" + pChar.name + ")";
      document.getElementById("player-fighter-title").textContent = pChar.title;
      document.getElementById("player-fighter-title").className = pChar.redago ? "faction-badge redago-theme" : "faction-badge";
      
      const pAvatar = document.getElementById("player-avatar");
      pAvatar.textContent = "";
      pAvatar.style.backgroundImage = `url(assets/char-${activeFighter}.png)`;
      pAvatar.style.backgroundSize = "cover";
      pAvatar.style.backgroundPosition = "center top";
      pAvatar.style.backgroundRepeat = "no-repeat";
      pAvatar.style.border = pChar.redago ? "2px solid var(--color-redago)" : "2px solid var(--color-blue-neon)";
      
      document.getElementById("opponent-fighter-name").textContent = oppStat.name + " (" + oChar.name + ")";
      document.getElementById("opponent-fighter-title").textContent = oChar.title;
      document.getElementById("opponent-fighter-title").className = oChar.redago ? "faction-badge redago-theme" : "faction-badge";
      
      const oAvatar = document.getElementById("opponent-avatar");
      oAvatar.textContent = "";
      oAvatar.style.backgroundImage = `url(assets/char-${currentOpponent}.png)`;
      oAvatar.style.backgroundSize = "cover";
      oAvatar.style.backgroundPosition = "center top";
      oAvatar.style.backgroundRepeat = "no-repeat";
      oAvatar.style.border = oChar.redago ? "2px solid var(--color-redago)" : "2px solid var(--color-blue-neon)";
      
      updateMeterBars();
      
      const turnRole = data.currentTurn;
      const isMyTurn = playerRole === turnRole;
      
      if (combatPhase !== "battle") {
        combatPhase = "battle";
        
        const log = document.getElementById("chat-messages");
        log.innerHTML = `
          <div class="chat-msg system"><i class="fa-solid fa-swords"></i> Multiplayer Match Started!</div>
          <div class="chat-msg system">Host: <strong>${hostData.name}</strong> vs Opponent: <strong>${oppData.name}</strong></div>
        `;
        
        appendChatLog(hostData.fighter, CHARACTERS[hostData.fighter].dialogues.intro);
        setTimeout(() => {
          appendChatLog(oppData.fighter, CHARACTERS[oppData.fighter].dialogues.intro);
          runMultiplayerTurnState(isMyTurn, turnRole);
        }, 1200);
      } else {
        runMultiplayerTurnState(isMyTurn, turnRole);
      }
      
      if (data.lastAction && data.lastAction.timestamp) {
        handleOpponentActionSync(data.lastAction);
      }
    }
    
    // 3. If forfeited
    if (data.status === "forfeited") {
      if (unsubscribeMatch) {
        unsubscribeMatch();
        unsubscribeMatch = null;
      }
      activeMatchId = null;
      activeMatchRef = null;
      
      const isWinner = data.forfeitedBy !== currentUser.uid;
      endCombat(isWinner);
    }
    
    // 4. If finished
    if (data.status === "finished") {
      if (unsubscribeMatch) {
        unsubscribeMatch();
        unsubscribeMatch = null;
      }
      activeMatchId = null;
      activeMatchRef = null;
      
      const isWinner = data.winnerUid === currentUser.uid;
      endCombat(isWinner);
    }
  }, (err) => {
    console.error("Match snap listener failed:", err);
  });
}

function runMultiplayerTurnState(isMyTurn, turnRole) {
  if (lastProcessedTurn === turnRole) return;
  lastProcessedTurn = turnRole;

  if (isMyTurn) {
    totalTurns++;
    document.getElementById("combat-phase-text").textContent = "Your Turn";
    document.getElementById("combat-player-card").classList.add("active-turn");
    document.getElementById("combat-opponent-card").classList.remove("active-turn");
    
    for (let i = 0; i < attackCooldowns.length; i++) {
      if (attackCooldowns[i] > 0) attackCooldowns[i]--;
    }
    
    updateActionButtonDeck();
  } else {
    document.getElementById("combat-phase-text").textContent = "Enemy Turn";
    document.getElementById("combat-player-card").classList.remove("active-turn");
    document.getElementById("combat-opponent-card").classList.add("active-turn");
    
    disableAllActionButtons();
    
    const feedback = document.getElementById("timing-feedback");
    feedback.textContent = "WAITING FOR ENEMY STRIKE...";
    feedback.className = "timing-feedback";
  }
}

function handleOpponentActionSync(lastAction) {
  if (lastAction.by === playerRole || lastAction.timestamp === lastActionTimestamp) return;
  lastActionTimestamp = lastAction.timestamp;
  
  const o = CHARACTERS[currentOpponent];
  const p = CHARACTERS[activeFighter];
  
  const multiplier = lastAction.multiplier;
  const finalDmg = lastAction.damage;
  const moveName = lastAction.moveName;
  const rankText = lastAction.resultText;
  const dialogue = lastAction.dialogueText;
  
  let soundType = "miss";
  if (multiplier === 2.5) {
    soundType = "critical";
    triggerScreenFlash();
  } else if (multiplier > 0) {
    soundType = "hit";
  }
  
  playSound(soundType);
  
  if (multiplier === 0) {
    appendChatLog(currentOpponent, `*misses attack* "Missed! How did that happen?!"`);
    appendChatMsg("system", `* Opponent's <strong>${moveName}</strong> missed completely.`, "system");
  } else {
    appendChatLog(currentOpponent, dialogue);
    
    const pCard = document.getElementById("combat-player-card");
    if (pCard) {
      pCard.classList.add("damaged");
      setTimeout(() => pCard.classList.remove("damaged"), 400);
    }
    
    let criticalFlag = multiplier === 2.5 ? " critical" : "";
    appendChatMsg("action" + criticalFlag, `💥 ${o.name} lands ${moveName} (${rankText}) dealing <strong>${finalDmg} damage</strong>!`);
    
    if (playerHP > 0) {
      setTimeout(() => {
        appendChatLog(activeFighter, p.dialogues.damaged);
      }, 700);
    }
  }
}

function startOfflineMatch() {
  console.log("Starting Local offline practice match...");
  
  combatPhase = "battle";
  
  document.getElementById("arena-lobby").style.display = "none";
  document.getElementById("arena-matchmaking").style.display = "none";
  document.getElementById("arena-combat").style.display = "block";
  document.getElementById("arena-result").style.display = "none";

  const player = CHARACTERS[activeFighter];
  playerHP = player.hp;
  playerMaxHP = player.hp;
  playerEnergy = 0;
  perfectHits = 0;
  totalTurns = 0;
  attackCooldowns = [0, 0, 0];

  document.getElementById("player-fighter-name").textContent = player.name + " (AI Practice)";
  document.getElementById("player-fighter-title").textContent = player.title;
  document.getElementById("player-fighter-title").className = player.redago ? "faction-badge redago-theme" : "faction-badge";
  
  const pAvatar = document.getElementById("player-avatar");
  pAvatar.textContent = "";
  pAvatar.style.backgroundImage = `url(assets/char-${activeFighter}.png)`;
  pAvatar.style.backgroundSize = "cover";
  pAvatar.style.backgroundPosition = "center top";
  pAvatar.style.backgroundRepeat = "no-repeat";
  pAvatar.style.border = player.redago ? "2px solid var(--color-redago)" : "2px solid var(--color-blue-neon)";

  updateMeterBars();

  document.getElementById("btn-attack1-label").textContent = player.moves[0].name;
  document.getElementById("btn-attack2-label").textContent = player.moves[1].name;
  document.getElementById("btn-attack3-label").textContent = player.moves[2].name;

  const charKeys = Object.keys(CHARACTERS).filter(k => k !== activeFighter);
  const randomOpp = charKeys[Math.floor(Math.random() * charKeys.length)];
  currentOpponent = randomOpp;

  const opponent = CHARACTERS[currentOpponent];
  opponentHP = opponent.hp;
  opponentMaxHP = opponent.hp;
  opponentEnergy = 0;

  document.getElementById("opponent-fighter-name").textContent = opponent.name + " (Practice AI)";
  document.getElementById("opponent-fighter-title").textContent = opponent.title;
  document.getElementById("opponent-fighter-title").className = opponent.redago ? "faction-badge redago-theme" : "faction-badge";

  const oAvatar = document.getElementById("opponent-avatar");
  oAvatar.textContent = "";
  oAvatar.style.backgroundImage = `url(assets/char-${currentOpponent}.png)`;
  oAvatar.style.backgroundSize = "cover";
  oAvatar.style.backgroundPosition = "center top";
  oAvatar.style.backgroundRepeat = "no-repeat";
  oAvatar.style.border = opponent.redago ? "2px solid var(--color-redago)" : "2px solid var(--color-blue-neon)";

  const log = document.getElementById("chat-messages");
  log.innerHTML = `
    <div class="chat-msg system"><i class="fa-solid fa-swords"></i> Local AI Practice Started!</div>
    <div class="chat-msg system">Opponent matched: <strong>${opponent.name} (${opponent.title})</strong></div>
  `;

  document.getElementById("combat-phase-text").textContent = "Practice Ready!";
  
  setTimeout(() => {
    appendChatLog(currentOpponent, CHARACTERS[currentOpponent].dialogues.intro);
    setTimeout(() => {
      appendChatLog(activeFighter, CHARACTERS[activeFighter].dialogues.intro);
      startPlayerTurn();
    }, 1200);
  }, 1000);
}

function startPlayerTurn() {
  if (playerHP <= 0 || opponentHP <= 0) return;

  totalTurns++;
  combatPhase = "battle";
  document.getElementById("combat-phase-text").textContent = "Your Turn";
  document.getElementById("combat-player-card").classList.add("active-turn");
  document.getElementById("combat-opponent-card").classList.remove("active-turn");

  // Reduce cooldowns
  for (let i = 0; i < attackCooldowns.length; i++) {
    if (attackCooldowns[i] > 0) attackCooldowns[i]--;
  }

  // Update button decks
  updateActionButtonDeck();
}

function updateActionButtonDeck() {
  const p = CHARACTERS[activeFighter];
  
  const btn1 = document.getElementById("btn-attack-1");
  const btn2 = document.getElementById("btn-attack-2");
  const btn3 = document.getElementById("btn-attack-3");

  const cool1 = document.getElementById("cooldown-1");
  const cool2 = document.getElementById("cooldown-2");
  const cool3 = document.getElementById("cooldown-3");

  btn1.classList.remove("active-choice");
  btn2.classList.remove("active-choice");
  btn3.classList.remove("active-choice");

  // Basic Strike
  btn1.disabled = false;
  cool1.textContent = "READY";

  // Special Skill (Cooldown)
  if (attackCooldowns[1] > 0) {
    btn2.disabled = true;
    cool2.textContent = `${attackCooldowns[1]} TURNS`;
  } else {
    btn2.disabled = false;
    cool2.textContent = "READY";
  }

  // Ultimate (Energy requirement)
  if (playerEnergy < 100) {
    btn3.disabled = true;
    cool3.textContent = `${playerEnergy}% CHARGED`;
  } else {
    btn3.disabled = false;
    cool3.textContent = "READY";
  }
}

function triggerAttack(index) {
  // If pointer is already moving, click executes the timing capture strike
  if (isPointerMoving) {
    executeTimingCapture();
    return;
  }

  // Verify move availability
  if (index === 1 && attackCooldowns[1] > 0) return;
  if (index === 2 && playerEnergy < 100) return;

  playSound("click");

  // Set active choice
  activeAttackIndex = index;
  
  document.getElementById("btn-attack-1").classList.remove("active-choice");
  document.getElementById("btn-attack-2").classList.remove("active-choice");
  document.getElementById("btn-attack-3").classList.remove("active-choice");
  
  const selectedBtn = document.getElementById(`btn-attack-${index + 1}`);
  if (selectedBtn) selectedBtn.classList.add("active-choice");

  // Start Timing Gauge physics loop
  startTimingGauge();
}

// ==========================================================================
// TIMING GAUGE PHYSICS ENGINE
// ==========================================================================
function startTimingGauge() {
  if (isPointerMoving) return;

  isPointerMoving = true;
  gaugePosition = 0;
  gaugeDirection = 1;
  
  const char = CHARACTERS[activeFighter];
  const attackInfo = char.moves[activeAttackIndex];
  
  // Speed multiplier: base speed modified by the specific attack speed and the fighter's base speed attribute
  gaugeSpeed = (attackInfo.speed) * (1 / char.speed);

  document.getElementById("timing-feedback").textContent = "PRESS SPACE / TAP BUTTON TO STRIKE!";
  document.getElementById("timing-feedback").className = "timing-feedback";

  // Pulse the active attack button with striking animations and text
  const activeBtn = document.getElementById(`btn-attack-${activeAttackIndex + 1}`);
  if (activeBtn) {
    activeBtn.classList.add("striking-active");
  }
  const coolLabel = document.getElementById(`cooldown-${activeAttackIndex + 1}`);
  if (coolLabel) {
    coolLabel.textContent = "STRIKE!";
    coolLabel.style.color = "var(--color-blue-neon)";
  }

  // Start Animation frame loop
  runGaugeLoop();
}

function runGaugeLoop() {
  if (!isPointerMoving) return;

  gaugePosition += (gaugeDirection * gaugeSpeed);
  
  if (gaugePosition >= 100) {
    gaugePosition = 100;
    gaugeDirection = -1;
  } else if (gaugePosition <= 0) {
    gaugePosition = 0;
    gaugeDirection = 1;
  }

  const pointer = document.getElementById("gauge-pointer");
  if (pointer) {
    pointer.style.left = gaugePosition + "%";
  }

  animationFrameId = requestAnimationFrame(runGaugeLoop);
}

function executeTimingCapture() {
  if (!isPointerMoving) return;

  // Stop physics loop
  isPointerMoving = false;
  if (animationFrameId) cancelAnimationFrame(animationFrameId);

  // Disable buttons while executing attack animation
  disableAllActionButtons();

  // Clear striking-active states
  document.getElementById("btn-attack-1").classList.remove("striking-active");
  document.getElementById("btn-attack-2").classList.remove("striking-active");
  document.getElementById("btn-attack-3").classList.remove("striking-active");

  const cool1 = document.getElementById("cooldown-1");
  const cool2 = document.getElementById("cooldown-2");
  const cool3 = document.getElementById("cooldown-3");
  if (cool1) cool1.style.color = "";
  if (cool2) cool2.style.color = "";
  if (cool3) cool3.style.color = "";

  const p = gaugePosition;
  let multiplier = 0;
  let resultText = "MISS";
  let feedbackClass = "miss-hit";
  let soundType = "miss";

  // Zone checks: Perfect center is 46% - 54%
  if (p >= 46 && p <= 54) {
    multiplier = 2.5;
    resultText = "CRITICAL PERFECT!";
    feedbackClass = "perfect-hit";
    soundType = "critical";
    perfectHits++;
    triggerScreenFlash();
  }
  // Great: 38% - 46% or 54% - 62%
  else if ((p >= 38 && p < 46) || (p > 54 && p <= 62)) {
    multiplier = 1.5;
    resultText = "GREAT HIT";
    feedbackClass = "great-hit";
    soundType = "hit";
  }
  // Normal: 25% - 38% or 62% - 75%
  else if ((p >= 25 && p < 38) || (p > 62 && p <= 75)) {
    multiplier = 1.0;
    resultText = "NORMAL STRIKE";
    feedbackClass = "normal-hit";
    soundType = "hit";
  }
  // Miss: 0% - 25% or 75% - 100%
  else {
    multiplier = 0.0;
    resultText = "ATTACK MISSED";
    feedbackClass = "miss-hit";
    soundType = "miss";
  }

  playSound(soundType);

  // Show visual feedback in Timing panel
  const feedback = document.getElementById("timing-feedback");
  feedback.textContent = resultText;
  feedback.className = `timing-feedback ${feedbackClass}`;

  // Execute damage calculations
  executePlayerAttack(multiplier, resultText);
}

// ==========================================================================
// DAMAGE LOGGING & ACTIONS
// ==========================================================================
async function executePlayerAttack(multiplier, rankText) {
  const p = CHARACTERS[activeFighter];
  const o = CHARACTERS[currentOpponent];
  const move = p.moves[activeAttackIndex];

  // Base Damage scaled by multiplier
  let finalDmg = Math.round(move.dmg * multiplier);

  // Apply cooldown if move has one
  if (move.cd > 0) {
    attackCooldowns[activeAttackIndex] = move.cd + 1; // +1 to account for current turn
  }

  // Resolve Energy charges
  if (activeAttackIndex === 2) {
    playerEnergy = 0;
  } else {
    let energyGain = multiplier === 2.5 ? 30 : multiplier > 0 ? 15 : 0;
    playerEnergy = Math.min(playerEnergy + energyGain, 100);
  }

  opponentHP = Math.max(opponentHP - finalDmg, 0);

  // Multiplayer sync block
  if (!isDemoMode && activeMatchRef) {
    try {
      const matchUpdate = {};
      const hostOrOpp = playerRole; // "host" or "opponent"
      const targetRole = playerRole === "host" ? "opponent" : "host";
      
      matchUpdate[`${hostOrOpp}.hp`] = playerHP; // playerHP is unchanged
      matchUpdate[`${hostOrOpp}.energy`] = playerEnergy;
      matchUpdate[`${targetRole}.hp`] = opponentHP;
      matchUpdate.currentTurn = targetRole;
      
      if (opponentHP <= 0) {
        matchUpdate.status = "finished";
        matchUpdate.winnerUid = currentUser.uid;
      }
      
      matchUpdate.lastAction = {
        by: hostOrOpp,
        moveName: move.name,
        damage: finalDmg,
        multiplier: multiplier,
        resultText: rankText,
        dialogueText: multiplier === 2.5 ? p.dialogues.ultimate : activeAttackIndex === 1 ? p.dialogues.special : p.dialogues.strike,
        timestamp: Date.now()
      };
      
      matchUpdate.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
      
      await activeMatchRef.update(matchUpdate);
      
      // Log local action directly for smooth performance
      if (multiplier === 0) {
        appendChatLog(activeFighter, `*misses attack* "Darn, my timing was off!"`);
        appendChatMsg("system", `* Player's <strong>${move.name}</strong> missed completely.`, "system");
      } else {
        appendChatLog(activeFighter, matchUpdate.lastAction.dialogueText);
        
        const oppCard = document.getElementById("combat-opponent-card");
        if (oppCard) {
          oppCard.classList.add("damaged");
          setTimeout(() => oppCard.classList.remove("damaged"), 400);
        }
        
        let criticalFlag = multiplier === 2.5 ? " critical" : "";
        appendChatMsg("action" + criticalFlag, `⚔️ ${p.name} lands ${move.name} (${rankText}) dealing <strong>${finalDmg} damage</strong>!`);
      }
      
      updateMeterBars();
    } catch (err) {
      console.error("Firestore multiplayer attack sync failed:", err);
      showNotification("Communication with server lost. Match failed.", true);
      endCombat(false);
    }
  } else {
    // Local AI Practice Mode logic (original local offline loop)
    if (multiplier === 0) {
      appendChatLog(activeFighter, `*misses attack* "Darn, my timing was off!"`);
      appendChatMsg("system", `* Player's <strong>${move.name}</strong> missed completely.`, "system");
    } else {
      let dialogue = p.dialogues.strike;
      if (multiplier === 2.5) dialogue = p.dialogues.ultimate;
      else if (activeAttackIndex === 1) dialogue = p.dialogues.special;

      appendChatLog(activeFighter, dialogue);
      
      const oppCard = document.getElementById("combat-opponent-card");
      if (oppCard) {
        oppCard.classList.add("damaged");
        setTimeout(() => oppCard.classList.remove("damaged"), 400);
      }

      let criticalFlag = multiplier === 2.5 ? " critical" : "";
      appendChatMsg("action" + criticalFlag, `⚔️ ${p.name} lands ${move.name} (${rankText}) dealing <strong>${finalDmg} damage</strong>!`);
      
      if (opponentHP > 0) {
        setTimeout(() => {
          appendChatLog(currentOpponent, o.dialogues.damaged);
        }, 700);
      }
    }

    updateMeterBars();
    activeAttackIndex = null;

    if (opponentHP <= 0) {
      setTimeout(() => {
        appendChatLog(currentOpponent, o.dialogues.victory);
        setTimeout(() => endCombat(true), 1200);
      }, 1000);
      return;
    }

    setTimeout(startOpponentTurn, 2200);
  }
}

function startOpponentTurn() {
  if (playerHP <= 0 || opponentHP <= 0) return;

  combatPhase = "opponent";
  document.getElementById("combat-phase-text").textContent = "Enemy Turn";
  document.getElementById("combat-player-card").classList.remove("active-turn");
  document.getElementById("combat-opponent-card").classList.add("active-turn");

  // Simple Opponent AI logic
  setTimeout(() => {
    executeOpponentAI();
  }, 1000);
}

function executeOpponentAI() {
  const o = CHARACTERS[currentOpponent];
  const p = CHARACTERS[activeFighter];

  // Decide move index (AI defaults to Ult if 100% Energy, otherwise 40% chance special, 60% base)
  let moveIdx = 0;
  if (opponentEnergy >= 100) {
    moveIdx = 2;
  } else {
    moveIdx = Math.random() < 0.4 ? 1 : 0;
  }

  const move = o.moves[moveIdx];
  
  // Simulated timing gauge slider for AI:
  // AI Hit rates: 15% Perfect, 35% Great, 40% Normal, 10% Miss
  let rand = Math.random();
  let multiplier = 0;
  let rankText = "MISS";
  let soundType = "miss";

  if (rand < 0.15) {
    multiplier = 2.5;
    rankText = "CRITICAL PERFECT!";
    soundType = "critical";
    triggerScreenFlash();
  } else if (rand < 0.5) {
    multiplier = 1.5;
    rankText = "GREAT HIT";
    soundType = "hit";
  } else if (rand < 0.9) {
    multiplier = 1.0;
    soundType = "hit";
    rankText = "NORMAL STRIKE";
  } else {
    multiplier = 0.0;
    soundType = "miss";
    rankText = "ATTACK MISSED";
  }

  // Start animated AI sliding simulator
  animateAIGaugeSlide(multiplier, () => {
    // Execute AI attack calculations
    playSound(soundType);

    if (moveIdx === 2) {
      opponentEnergy = 0;
    } else {
      let energyGain = multiplier === 2.5 ? 30 : multiplier > 0 ? 15 : 0;
      opponentEnergy = Math.min(opponentEnergy + energyGain, 100);
    }

    if (multiplier === 0) {
      appendChatLog(currentOpponent, `*misses attack* "Missed! How did that happen?!"`);
      appendChatMsg("system", `* Opponent's <strong>${move.name}</strong> missed completely.`, "system");
    } else {
      let dialogue = o.dialogues.strike;
      if (multiplier === 2.5) dialogue = o.dialogues.ultimate;
      else if (moveIdx === 1) dialogue = o.dialogues.special;

      appendChatLog(currentOpponent, dialogue);

      // Shake Player card
      const pCard = document.getElementById("combat-player-card");
      if (pCard) {
        pCard.classList.add("damaged");
        setTimeout(() => pCard.classList.remove("damaged"), 400);
      }

      // Apply Damage
      let finalDmg = Math.round(move.dmg * multiplier);
      playerHP = Math.max(playerHP - finalDmg, 0);

      let criticalFlag = multiplier === 2.5 ? " critical" : "";
      appendChatMsg("action" + criticalFlag, `💥 ${o.name} lands ${move.name} (${rankText}) dealing <strong>${finalDmg} damage</strong>!`);

      if (playerHP > 0) {
        setTimeout(() => {
          appendChatLog(activeFighter, p.dialogues.damaged);
        }, 700);
      }
    }

    updateMeterBars();

    // Check defeat condition
    if (playerHP <= 0) {
      setTimeout(() => {
        appendChatLog(activeFighter, p.dialogues.victory); // Player final words
        setTimeout(() => endCombat(false), 1200);
      }, 1000);
      return;
    }

    // Go back to Player turn
    setTimeout(startPlayerTurn, 2200);
  });
}

function animateAIGaugeSlide(multiplier, callback) {
  isPointerMoving = true;
  gaugePosition = 0;
  gaugeDirection = 1;
  gaugeSpeed = 4.0; // Fixed quick slide for AI

  const feedback = document.getElementById("timing-feedback");
  feedback.textContent = "ENEMY IS ALIGNING STRIKE...";
  feedback.className = "timing-feedback";

  const runAISlide = () => {
    if (!isPointerMoving) return;

    gaugePosition += (gaugeDirection * gaugeSpeed);
    if (gaugePosition >= 100) {
      gaugePosition = 100;
      gaugeDirection = -1;
    } else if (gaugePosition <= 0) {
      gaugePosition = 0;
      gaugeDirection = 1;
    }

    const pointer = document.getElementById("gauge-pointer");
    if (pointer) {
      pointer.style.left = gaugePosition + "%";
    }

    animationFrameId = requestAnimationFrame(runAISlide);
  };

  runAISlide();

  // Stop slider at a logical position reflecting the target multiplier
  setTimeout(() => {
    isPointerMoving = false;
    if (animationFrameId) cancelAnimationFrame(animationFrameId);

    // Set slider position to match multiplier zone
    let stopPos = 10; // Default Miss
    if (multiplier === 2.5) stopPos = 50; // Perfect Center
    else if (multiplier === 1.5) stopPos = 42; // Great
    else if (multiplier === 1.0) stopPos = 30; // Normal

    const pointer = document.getElementById("gauge-pointer");
    if (pointer) pointer.style.left = stopPos + "%";

    callback();
  }, 1000);
}

// ==========================================================================
// COMBAT END / RESULTS SCORING
// ==========================================================================
async function endCombat(isVictory) {
  combatPhase = "result";
  disableAllActionButtons();

  // Clean up match real-time subscription and references
  if (unsubscribeMatch) {
    unsubscribeMatch();
    unsubscribeMatch = null;
  }
  activeMatchId = null;
  activeMatchRef = null;

  const overlay = document.getElementById("arena-result");
  overlay.style.display = "flex";

  const badge = document.getElementById("result-badge");
  const title = document.getElementById("result-title");
  const desc = document.getElementById("result-desc");

  if (isVictory) {
    playSound("victory");
    badge.className = "game-badge";
    badge.innerHTML = `<i class="fa-solid fa-trophy"></i> Victory`;
    title.textContent = "Victory Achieved! 🏆";
    desc.textContent = "Your timing was stellar! You conquered your opponent and advanced your Beyond State limits.";

    // Score calculations
    let scoreHp = playerHP * 15;
    let scorePerfect = perfectHits * 150;
    let turnReduction = Math.max(1000 - (totalTurns * 40), 100);
    let finalScore = scoreHp + scorePerfect + turnReduction;

    document.getElementById("score-hp").textContent = `+${scoreHp} (${playerHP} HP left)`;
    document.getElementById("score-perfects").textContent = `+${scorePerfect} (${perfectHits} Perfects)`;
    document.getElementById("score-time").textContent = `+${turnReduction} (${totalTurns} Turns)`;
    document.getElementById("score-total").textContent = finalScore;

    // Submit score to Database
    submitHighScore(finalScore);
  } else {
    playSound("defeat");
    badge.className = "game-badge redago-theme";
    badge.innerHTML = `<i class="fa-solid fa-skull"></i> Defeat`;
    title.textContent = "Defeat in Battle 💀";
    desc.textContent = "You fell in the arena. Recalibrate your mind, practice your timing, and try again.";

    document.getElementById("score-hp").textContent = "+0 (0 HP left)";
    document.getElementById("score-perfects").textContent = `+0 (${perfectHits} Perfects)`;
    document.getElementById("score-time").textContent = `+0 (${totalTurns} Turns)`;
    document.getElementById("score-total").textContent = 0;
  }
}

async function submitHighScore(score) {
  if (!currentUser) return;

  const charName = CHARACTERS[activeFighter].name;

  if (isDemoMode) {
    let leaderboard = getLocalLeaderboard();
    leaderboard.push({
      name: currentUser.displayName || "Anonymous Faction Member",
      character: charName,
      score: score,
      timestamp: Date.now()
    });
    // Sort and keep top 10
    leaderboard.sort((a, b) => b.score - a.score);
    saveLocalLeaderboard(leaderboard);

    showNotification("Score saved locally!");
    loadLeaderboardUI();
  } else {
    try {
      await db.collection("leaderboard").add({
        name: currentUser.displayName || "Anonymous",
        uid: currentUser.uid,
        character: charName,
        score: score,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      showNotification("High score saved to Firestore! 🏆");
      loadLeaderboardUI();
    } catch (e) {
      console.error("Firestore Score Submission Error:", e);
      showNotification("Could not save score online. Check security rules.", true);
    }
  }
}

// ==========================================================================
// LEADERBOARD LOAD LOGIC
// ==========================================================================
function loadLeaderboardUI() {
  const container = document.getElementById("leaderboard-rows-container");
  if (!container) return;

  if (isDemoMode) {
    renderLeaderboardRows(getLocalLeaderboard());
  } else {
    if (!db) return;
    db.collection("leaderboard")
      .orderBy("score", "desc")
      .limit(10)
      .onSnapshot(snapshot => {
        const scores = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          scores.push({
            name: data.name,
            character: data.character,
            score: data.score,
            timestamp: data.timestamp ? (data.timestamp.seconds * 1000) : Date.now(),
            uid: data.uid
          });
        });
        renderLeaderboardRows(scores);
      }, err => {
        console.error("Firestore leaderboard read error:", err);
        container.innerHTML = `<div class="leaderboard-empty">Could not load online ranking. Rules or config issue.</div>`;
      });
  }
}

function renderLeaderboardRows(scores) {
  const container = document.getElementById("leaderboard-rows-container");
  if (!container) return;

  container.innerHTML = "";

  if (scores.length === 0) {
    container.innerHTML = `<div class="leaderboard-empty"><i class="fa-solid fa-trophy"></i> No rankings recorded yet. Enter combat to set the first score!</div>`;
    return;
  }

  scores.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "leaderboard-row";
    
    // Highlight logged in user
    if (currentUser && currentUser.uid === item.uid) {
      row.classList.add("highlighted");
    }

    const dateText = new Date(item.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" });

    row.innerHTML = `
      <span class="rank-col">#${index + 1}</span>
      <span class="name-col">${escapeHtml(item.name)}</span>
      <span class="char-col">${item.character}</span>
      <span class="score-col">${item.score.toLocaleString()}</span>
      <span class="date-col">${dateText}</span>
    `;
    container.appendChild(row);
  });
}

// Local Storage high score arrays fallback (Demo Mode)
function getLocalLeaderboard() {
  const saved = localStorage.getItem("dxz_leaderboard");
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  // Default mock leaderboard scores for beautiful presentation
  const mockScores = [
    { name: "BSG Creator (Test)", character: "BSG", score: 4850, timestamp: Date.now() - 86400000 * 2, uid: "mock-1" },
    { name: "West Emperor (AI Bot)", character: "Hell", score: 3900, timestamp: Date.now() - 86400000 * 5, uid: "mock-2" },
    { name: "Faction Recruit 07", character: "Curse God Zalta", score: 2850, timestamp: Date.now() - 86400000 * 1, uid: "mock-3" }
  ];
  saveLocalLeaderboard(mockScores);
  return mockScores;
}
function saveLocalLeaderboard(arr) {
  localStorage.setItem("dxz_leaderboard", JSON.stringify(arr));
}

// ==========================================================================
// UTILITY HELPERS
// ==========================================================================
function updateMeterBars() {
  // Player
  const pHPFill = document.getElementById("player-hp-bar");
  const pHPText = document.getElementById("player-hp-text");
  const pEnergyFill = document.getElementById("player-energy-bar");
  const pEnergyText = document.getElementById("player-energy-text");

  const playerHPPercent = Math.round((playerHP / playerMaxHP) * 100);
  if (pHPFill) pHPFill.style.width = playerHPPercent + "%";
  if (pHPText) pHPText.textContent = `${playerHP}/${playerMaxHP}`;

  if (pEnergyFill) pEnergyFill.style.width = playerEnergy + "%";
  if (pEnergyText) pEnergyText.textContent = `${playerEnergy}%`;

  // Opponent
  const oHPFill = document.getElementById("opponent-hp-bar");
  const oHPText = document.getElementById("opponent-hp-text");
  const oEnergyFill = document.getElementById("opponent-energy-bar");
  const oEnergyText = document.getElementById("opponent-energy-text");

  const oppHPPercent = Math.round((opponentHP / opponentMaxHP) * 100);
  if (oHPFill) oHPFill.style.width = oppHPPercent + "%";
  if (oHPText) oHPText.textContent = `${opponentHP}/${opponentMaxHP}`;

  if (oEnergyFill) oEnergyFill.style.width = opponentEnergy + "%";
  if (oEnergyText) oEnergyText.textContent = `${opponentEnergy}%`;
}

function disableAllActionButtons() {
  document.getElementById("btn-attack-1").disabled = true;
  document.getElementById("btn-attack-2").disabled = true;
  document.getElementById("btn-attack-3").disabled = true;
  document.getElementById("btn-attack-1").classList.remove("active-choice");
  document.getElementById("btn-attack-2").classList.remove("active-choice");
  document.getElementById("btn-attack-3").classList.remove("active-choice");
}

function triggerScreenFlash() {
  const overlay = document.getElementById("timing-gauge");
  if (!overlay) return;
  overlay.style.boxShadow = "0 0 35px var(--color-blue-neon), 0 0 50px #FFF";
  setTimeout(() => {
    overlay.style.boxShadow = "";
  }, 300);
}

function appendChatLog(characterKey, text) {
  const char = CHARACTERS[characterKey];
  const name = char ? char.name : "Fighter";
  const cat = characterKey === activeFighter ? "player" : "opponent";

  const message = `[${name}]: <span class="msg-dialogue">"${text}"</span>`;
  appendChatMsg(cat, message);
}

function appendChatMsg(typeClass, content) {
  const container = document.getElementById("chat-messages");
  if (!container) return;

  const msg = document.createElement("div");
  msg.className = `chat-msg ${typeClass}`;
  msg.innerHTML = content;

  container.appendChild(msg);

  // Auto scroll
  container.scrollTop = container.scrollHeight;
}

function escapeHtml(str) {
  if (!str) return "";
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
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
