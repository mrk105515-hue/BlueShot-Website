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
let playerUnlockedCount = 1;
let opponentUnlockedCount = 1;

// Combat passive trackers
let playerBurnNext = false;
let opponentBurnNext = false;
let playerStunned = false;
let opponentStunned = false;

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
let activeAttackIndex = null; // 0, 1, 2, 3, or 4
let attackCooldowns = [0, 0, 0, 0, 0]; // Turn cooldown trackers for player attacks

// Synth Audio Engine
let audioCtx = null;

// Character Master Database
const CHARACTERS = {
  bsg: {
    name: "BSG",
    title: "Flame Devil V3.0",
    avatar: "BF",
    hp: 150,
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
      { name: "Dragon Aura", dmg: 18, speed: 3.0, cd: 2, desc: "An aura burst with medium damage. 2 turns cooldown. [Locked]" },
      { name: "Phoenix Rise", dmg: 25, speed: 4.0, cd: 3, desc: "A blazing phoenix dash. 3 turns cooldown. [Locked]" },
      { name: "Celestial Release", dmg: 35, speed: 5.0, cd: 4, energyReq: 50, desc: "Release 1% power. Devastating damage. Requires 50% Energy. [Locked]" },
      { name: "Hellfire Cataclysm", dmg: 50, speed: 6.2, cd: 5, energyReq: 100, desc: "Summon the final cataclysm. Catastrophic damage. Requires 100% Energy. [Locked]" }
    ]
  },
  hell: {
    name: "Hell",
    title: "West Emperor",
    avatar: "HE",
    hp: 180,
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
      { name: "Fate Cut", dmg: 15, speed: 2.2, cd: 0, desc: "Quick blade strike with low damage, easy speed, no cooldown." },
      { name: "Timeline Edit", dmg: 25, speed: 3.2, cd: 2, desc: "Alter probability for medium damage. 2 turns cooldown. [Locked]" },
      { name: "Chronos Brake", dmg: 35, speed: 4.2, cd: 3, desc: "A time-slowing slice. 3 turns cooldown. [Locked]" },
      { name: "Absolute Erase", dmg: 48, speed: 5.2, cd: 4, energyReq: 50, desc: "Erase the opponent from history. Requires 50% Energy. [Locked]" },
      { name: "Reality Tear", dmg: 68, speed: 6.5, cd: 5, energyReq: 100, desc: "Shatter reality itself for massive damage. Requires 100% Energy. [Locked]" }
    ]
  },
  jiggo: {
    name: "Emperor Jiggo",
    title: "Legendary Mentor",
    avatar: "JD",
    hp: 180,
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
      { name: "Portal Strike", dmg: 9, speed: 1.8, cd: 0, desc: "Ambush from portal. Slow slider speed, no cooldown." },
      { name: "Void Swap", dmg: 16, speed: 2.8, cd: 2, desc: "Swapping positions to confuse defenses. 2 turns cooldown. [Locked]" },
      { name: "Rift Collapse", dmg: 23, speed: 3.8, cd: 3, desc: "A local spatial collapse. 3 turns cooldown. [Locked]" },
      { name: "Eastern Dimension", dmg: 32, speed: 4.8, cd: 4, energyReq: 50, desc: "Summon the dimensional void. Requires 50% Energy. [Locked]" },
      { name: "Cosmic Black Hole", dmg: 46, speed: 5.8, cd: 5, energyReq: 100, desc: "Create a miniature black hole. Requires 100% Energy. [Locked]" }
    ]
  },
  zalta: {
    name: "Curse God Zalta",
    title: "Dark Bull Beast",
    avatar: "CZ",
    hp: 160,
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
      { name: "Bull Stomp", dmg: 10, speed: 2.5, cd: 0, desc: "Heavy stomp. Average speed, no cooldown." },
      { name: "Rampage Stride", dmg: 18, speed: 3.5, cd: 2, desc: "A brutal charge. 2 turns cooldown. [Locked]" },
      { name: "Iron Horn Charge", dmg: 24, speed: 4.5, cd: 3, desc: "A heavy frontal ram. 3 turns cooldown. [Locked]" },
      { name: "Curse God Awaken", dmg: 35, speed: 5.5, cd: 4, energyReq: 50, desc: "Unleash curse bull energy. Requires 50% Energy. [Locked]" },
      { name: "Earth Shatter Apocalypse", dmg: 48, speed: 6.8, cd: 5, energyReq: 100, desc: "A tectonic apocalyptic slam. Requires 100% Energy. [Locked]" }
    ]
  },
  suma: {
    name: "Suma",
    title: "Emerald Shadow",
    avatar: "ES",
    hp: 140,
    attack: 22,
    speed: 1.1,
    redago: false,
    dialogues: {
      intro: "The shadows will consume you. Face the Emerald Blade.",
      strike: "Emerald Cut! Did you see that?",
      special: "Shadow Step! Try to hit me now.",
      ultimate: "Emerald Tempest! Slice through everything!",
      damaged: "You found a gap in my guard...",
      victory: "The shadow remains supreme."
    },
    moves: [
      { name: "Emerald Cut", dmg: 10, speed: 2.1, cd: 0, desc: "Quick jade blade slash. Easy speed, no cooldown." },
      { name: "Shadow Step", dmg: 18, speed: 3.1, cd: 2, desc: "A fast shadow step strike. 2 turns cooldown. [Locked]" },
      { name: "Jade Pierce", dmg: 24, speed: 4.1, cd: 3, desc: "A piercing jade stab. 3 turns cooldown. [Locked]" },
      { name: "Emerald Tempest", dmg: 34, speed: 5.1, cd: 4, energyReq: 50, desc: "Release a storm of jade blades. Requires 50% Energy. [Locked]" },
      { name: "Grand Shadow Dance", dmg: 47, speed: 6.3, cd: 5, energyReq: 100, desc: "The ultimate shadow assassin dance. Requires 100% Energy. [Locked]" }
    ]
  },
  berry: {
    name: "Berry",
    title: "Golden Giant",
    avatar: "GG",
    hp: 150,
    attack: 24,
    speed: 0.9,
    redago: true,
    dialogues: {
      intro: "I am the Golden Giant. None can withstand my weight.",
      strike: "Heavy Press! Crush!",
      special: "Giga Smash! Feel the impact!",
      ultimate: "Golden Shockwave! Tectonic destruction!",
      damaged: "Huh, quite a heavy blow...",
      victory: "You were crushed beneath my feet."
    },
    moves: [
      { name: "Heavy Press", dmg: 11, speed: 2.4, cd: 0, desc: "A slow heavy body slam. No cooldown." },
      { name: "Giga Smash", dmg: 19, speed: 3.4, cd: 2, desc: "A crushing hammer fist. 2 turns cooldown. [Locked]" },
      { name: "Iron Impact", dmg: 25, speed: 4.4, cd: 3, desc: "An iron defense-breaking punch. 3 turns cooldown. [Locked]" },
      { name: "Golden Shockwave", dmg: 36, speed: 5.4, cd: 4, energyReq: 50, desc: "Release a massive shockwave. Requires 50% Energy. [Locked]" },
      { name: "Meteorite Crater", dmg: 50, speed: 6.6, cd: 5, energyReq: 100, desc: "Slam the ground to create a meteorite crater. Requires 100% Energy. [Locked]" }
    ]
  },
  scinto: {
    name: "Black Dagger",
    title: "Lightning Blade",
    avatar: "BD",
    hp: 170,
    attack: 21,
    speed: 1.3,
    redago: false,
    dialogues: {
      intro: "I strike like lightning. Blink and you'll miss the truth.",
      strike: "Volt Cutter! Speed of light!",
      special: "Thunder Dash! A simple illusion, just like my identity.",
      ultimate: "Ragnarok Bolt! The Black Dagger sends his regards!",
      damaged: "A direct hit... but my shadow clones took the brunt of it.",
      victory: "The lightning fades... and the Black Dagger remains victorious."
    },
    moves: [
      { name: "Volt Cutter", dmg: 9, speed: 1.7, cd: 0, desc: "An electrified sword slice. Very slow timing pointer. No cooldown." },
      { name: "Thunder Dash", dmg: 17, speed: 2.7, cd: 2, desc: "Dash at thunderous speed. 2 turns cooldown. [Locked]" },
      { name: "Plasma Spark", dmg: 23, speed: 3.7, cd: 3, desc: "Shock the enemy with high voltage. 3 turns cooldown. [Locked]" },
      { name: "Lightning Discharge", dmg: 33, speed: 4.7, cd: 4, energyReq: 50, desc: "Unleash a wide lightning discharge. Requires 50% Energy. [Locked]" },
      { name: "Ragnarok Bolt", dmg: 45, speed: 5.9, cd: 5, energyReq: 100, desc: "Call down the final Ragnarok bolt. Requires 100% Energy. [Locked]" }
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
  document.getElementById("move4-name").textContent = char.moves[3].name;
  document.getElementById("move4-desc").textContent = char.moves[3].desc;
  document.getElementById("move5-name").textContent = char.moves[4].name;
  document.getElementById("move5-desc").textContent = char.moves[4].desc;
}

// ==========================================================================
// COMBAT DECK CONTROLS
// ==========================================================================
function setupCombatControls() {
  const attack1 = document.getElementById("btn-attack-1");
  const attack2 = document.getElementById("btn-attack-2");
  const attack3 = document.getElementById("btn-attack-3");
  const attack4 = document.getElementById("btn-attack-4");
  const attack5 = document.getElementById("btn-attack-5");
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
  if (attack4) {
    attack4.addEventListener("click", () => triggerAttack(3));
  }
  if (attack5) {
    attack5.addEventListener("click", () => triggerAttack(4));
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
    } else if (e.key === "4") {
      triggerAttack(3);
    } else if (e.key === "5") {
      triggerAttack(4);
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
  
  playerBurnNext = false;
  opponentBurnNext = false;
  playerStunned = false;
  opponentStunned = false;

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
          energy: 0,
          unlockedCount: 1
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
          energy: 0,
          unlockedCount: 1
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
    showNotification("Matchmaking failed: " + (err.message || err) + ". Switching to offline AI Practice Mode.", true);
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
      
      // Sync unlocked count from Firestore
      let prevOppUnlocked = opponentUnlockedCount;
      playerUnlockedCount = playerStat.unlockedCount || 1;
      opponentUnlockedCount = oppStat.unlockedCount || 1;
      
      const pChar = CHARACTERS[activeFighter];
      const oChar = CHARACTERS[currentOpponent];
      if (opponentUnlockedCount > prevOppUnlocked && oChar) {
        appendChatMsg("system", `🔓 OPPONENT PERFECT STRIKE! Enemy unlocked a new power move: **${oChar.moves[opponentUnlockedCount - 1].name}**!`, "system");
      }
      
      document.getElementById("player-fighter-name").textContent = playerStat.name + " (" + pChar.name + ")";
      document.getElementById("player-fighter-title").textContent = pChar.title;
      document.getElementById("player-fighter-title").className = pChar.redago ? "faction-badge redago-theme" : "faction-badge";
      
      const pAvatar = document.getElementById("player-avatar");
      pAvatar.textContent = "";
      const pImg = activeFighter === "scinto" ? "blackdagger" : activeFighter;
      pAvatar.style.backgroundImage = `url(assets/char-${pImg}.png)`;
      pAvatar.style.backgroundSize = "cover";
      pAvatar.style.backgroundPosition = "center top";
      pAvatar.style.backgroundRepeat = "no-repeat";
      pAvatar.style.border = pChar.redago ? "2px solid var(--color-redago)" : "2px solid var(--color-blue-neon)";
      
      document.getElementById("opponent-fighter-name").textContent = oppStat.name + " (" + oChar.name + ")";
      document.getElementById("opponent-fighter-title").textContent = oChar.title;
      document.getElementById("opponent-fighter-title").className = oChar.redago ? "faction-badge redago-theme" : "faction-badge";
      
      const oAvatar = document.getElementById("opponent-avatar");
      oAvatar.textContent = "";
      const oImg = currentOpponent === "scinto" ? "blackdagger" : currentOpponent;
      oAvatar.style.backgroundImage = `url(assets/char-${oImg}.png)`;
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
  if (lastAction.evaded) {
    soundType = "miss";
  } else if (multiplier === 2.5) {
    soundType = "critical";
    triggerScreenFlash();
  } else if (multiplier > 0) {
    soundType = "hit";
  }
  
  playSound(soundType);
  
  if (lastAction.evaded) {
    appendChatLog(currentOpponent, dialogue);
    appendChatMsg("system", `🛡️ **Hell's Timeline Edit** active! Attack was completely evaded!`, "system");
  } else if (multiplier === 0) {
    appendChatLog(currentOpponent, `*misses attack* "Missed! How did that happen?!"`);
    appendChatMsg("system", `* Opponent's <strong>${moveName}</strong> missed completely.`, "system");
  } else {
    appendChatLog(currentOpponent, dialogue);
    
    triggerDamageEffect("combat-player-card", moveName, finalDmg, multiplier === 2.5);
    
    let criticalFlag = multiplier === 2.5 ? " critical" : "";
    appendChatMsg("action" + criticalFlag, `💥 ${o.name} lands ${moveName} (${rankText}) dealing <strong>${finalDmg} damage</strong>!`);
    
    // Print other passives in local logs
    if (lastAction.beastRageApplied) {
      appendChatMsg("system", `💢 **Zalta's Beast Rage** active! Deals +30% extra damage!`, "system");
    }
    if (lastAction.blazingFuryApplied) {
      appendChatMsg("system", `🔥 **BSG's Blazing Fury** burns the enemy for +15% extra damage!`, "system");
    }
    if (lastAction.blazingFuryPrimed) {
      appendChatMsg("system", `🔥 BSG's Blazing Fury primed! Next attack will burn!`, "system");
    }
    if (lastAction.tacticalGuardApplied) {
      appendChatMsg("system", `🛡️ **Suma's Tactical Guard** reduces incoming damage by 20%!`, "system");
    }
    if (lastAction.lifestealHeal > 0) {
      appendChatMsg("system", `🌀 **Jiggo's Void Absorption** active! Heals Jiggo for **+${lastAction.lifestealHeal} HP**!`, "system");
    }
    if (lastAction.stunTriggered) {
      appendChatMsg("system", `💫 **${p.name} is STUNNED**! Opponent retains the turn!`, "system");
    }

    if (playerHP > 0) {
      setTimeout(() => {
        appendChatLog(activeFighter, p.dialogues.damaged);
      }, 700);
    }
  }
}

function startOfflineMatch() {
  console.log("Starting Local offline practice match...");
  
  // Clear matchmaking timer in case it was running
  clearMatchmakingTimer();
  
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
  attackCooldowns = [0, 0, 0, 0, 0];
  playerUnlockedCount = 1;
  opponentUnlockedCount = 1;
  playerBurnNext = false;
  opponentBurnNext = false;
  playerStunned = false;
  opponentStunned = false;

  document.getElementById("player-fighter-name").textContent = player.name + " (AI Practice)";
  document.getElementById("player-fighter-title").textContent = player.title;
  document.getElementById("player-fighter-title").className = player.redago ? "faction-badge redago-theme" : "faction-badge";
  
  const pAvatar = document.getElementById("player-avatar");
  pAvatar.textContent = "";
  const pImg = activeFighter === "scinto" ? "blackdagger" : activeFighter;
  pAvatar.style.backgroundImage = `url(assets/char-${pImg}.png)`;
  pAvatar.style.backgroundSize = "cover";
  pAvatar.style.backgroundPosition = "center top";
  pAvatar.style.backgroundRepeat = "no-repeat";
  pAvatar.style.border = player.redago ? "2px solid var(--color-redago)" : "2px solid var(--color-blue-neon)";

  updateMeterBars();

  updateActionButtonDeck();

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
  const oImg = currentOpponent === "scinto" ? "blackdagger" : currentOpponent;
  oAvatar.style.backgroundImage = `url(assets/char-${oImg}.png)`;
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
  if (!p) return;
  
  const buttons = [
    document.getElementById("btn-attack-1"),
    document.getElementById("btn-attack-2"),
    document.getElementById("btn-attack-3"),
    document.getElementById("btn-attack-4"),
    document.getElementById("btn-attack-5")
  ];

  const cooldownsText = [
    document.getElementById("cooldown-1"),
    document.getElementById("cooldown-2"),
    document.getElementById("cooldown-3"),
    document.getElementById("cooldown-4"),
    document.getElementById("cooldown-5")
  ];

  for (let i = 1; i <= 5; i++) {
    const btn = document.getElementById(`btn-attack-${i}`);
    if (btn) btn.classList.remove("active-choice");
  }

  for (let i = 0; i < 5; i++) {
    const btn = buttons[i];
    const cool = cooldownsText[i];
    if (!btn || !cool) continue;

    const move = p.moves[i];
    const label = document.getElementById(`btn-attack${i + 1}-label`);
    
    // Lock check
    if (i >= playerUnlockedCount) {
      if (label) label.textContent = `🔒 ${move.name}`;
      btn.classList.add("locked");
      btn.disabled = true;
      cool.textContent = "LOCKED";
      continue;
    } else {
      if (label) label.textContent = move.name;
      btn.classList.remove("locked");
    }

    // Cooldown check
    if (attackCooldowns[i] > 0) {
      btn.disabled = true;
      cool.textContent = `${attackCooldowns[i]} TURNS`;
      continue;
    }

    // Energy requirement check
    if (move.energyReq && playerEnergy < move.energyReq) {
      btn.disabled = true;
      cool.textContent = `${playerEnergy}/${move.energyReq}% ULT`;
      continue;
    }

    // Ready!
    btn.disabled = false;
    cool.textContent = "READY";
  }
}

function triggerAttack(index) {
  // If pointer is already moving, click executes the timing capture strike
  if (isPointerMoving) {
    executeTimingCapture();
    return;
  }

  // Verify move availability
  const p = CHARACTERS[activeFighter];
  const move = p.moves[index];

  if (index >= playerUnlockedCount) {
    showNotification("This move is locked! Land PERFECT hits to unlock it.", true);
    return;
  }
  if (attackCooldowns[index] > 0) return;
  if (move.energyReq && playerEnergy < move.energyReq) return;

  playSound("click");

  // Set active choice
  activeAttackIndex = index;
  
  for (let i = 1; i <= 5; i++) {
    const btn = document.getElementById(`btn-attack-${i}`);
    if (btn) btn.classList.remove("active-choice");
  }
  
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
  
  // Desperation Speed Scaling: As target HP drops, timing gauge speed increases by up to 50%
  let targetHpRatio = opponentHP / opponentMaxHP;
  let speedScale = 1.5 - 0.5 * targetHpRatio; // 1.0 at full HP, 1.5 at low HP
  gaugeSpeed = (attackInfo.speed) * (1 / char.speed) * speedScale;
  if (activeFighter === "scinto") {
    gaugeSpeed *= 0.85;
  }

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
  for (let i = 1; i <= 5; i++) {
    const btn = document.getElementById(`btn-attack-${i}`);
    if (btn) btn.classList.remove("striking-active");
    
    const cool = document.getElementById(`cooldown-${i}`);
    if (cool) cool.style.color = "";
  }

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

  // Desperation Defensive Scaling: As target HP drops, they take less damage (up to 60% mitigation)
  let targetHpRatio = opponentHP / opponentMaxHP;
  let defenseScale = 0.4 + 0.6 * targetHpRatio; // ranges from 1.0 down to 0.4
  let finalDmg = Math.round(move.dmg * multiplier * defenseScale);

  // --- PASSIVES CALCULATIONS (Attacker) ---
  
  // Zalta's Beast Rage: Deal +30% damage when HP < 50%
  let beastRageApplied = false;
  if (activeFighter === "zalta" && multiplier > 0 && finalDmg > 0) {
    if (playerHP < playerMaxHP * 0.5) {
      finalDmg = Math.round(finalDmg * 1.30);
      beastRageApplied = true;
    }
  }

  // BSG's Blazing Fury: Deal +15% extra burn damage on next strike after PERFECT
  let blazingFuryApplied = false;
  if (activeFighter === "bsg" && multiplier > 0 && finalDmg > 0) {
    if (playerBurnNext) {
      finalDmg = Math.round(finalDmg * 1.15);
      playerBurnNext = false;
      blazingFuryApplied = true;
    }
    if (multiplier === 2.5) {
      playerBurnNext = true;
    }
  }

  // --- PASSIVES CALCULATIONS (Defender) ---
  
  // Hell's Timeline Edit (Dodge): 12% chance to evade completely
  let evaded = false;
  if (currentOpponent === "hell" && multiplier > 0 && finalDmg > 0) {
    if (Math.random() < 0.12) {
      finalDmg = 0;
      evaded = true;
    }
  }

  // Suma's Tactical Guard: Reduce incoming damage by 20%
  let tacticalGuardApplied = false;
  if (currentOpponent === "suma" && multiplier > 0 && finalDmg > 0) {
    finalDmg = Math.round(finalDmg * 0.80);
    tacticalGuardApplied = true;
  }

  // --- POST-DAMAGE PASSIVES ---
  
  // Jiggo's Void Absorption (Lifesteal): Heal Jiggo for 20% of damage dealt
  let lifestealHeal = 0;
  if (activeFighter === "jiggo" && multiplier > 0 && finalDmg > 0) {
    lifestealHeal = Math.round(finalDmg * 0.20);
    playerHP = Math.min(playerHP + lifestealHeal, playerMaxHP);
  }

  // Berry's Heavy Impact (Stun): GREAT or PERFECT has a 20% chance to stun
  let stunTriggered = false;
  if (activeFighter === "berry" && (multiplier === 1.5 || multiplier === 2.5) && finalDmg > 0) {
    if (Math.random() < 0.20) {
      stunTriggered = true;
      opponentStunned = true;
    }
  }

  // Apply cooldown if move has one
  if (move.cd > 0) {
    attackCooldowns[activeAttackIndex] = move.cd + 1; // +1 to account for current turn
  }

  // Resolve Energy charges
  if (activeAttackIndex === 4) {
    playerEnergy = 0; // Ultimate 2 consumes 100%
  } else if (activeAttackIndex === 3) {
    playerEnergy = Math.max(playerEnergy - 50, 0); // Ultimate 1 consumes 50%
  } else {
    let energyGain = multiplier === 2.5 ? 30 : multiplier > 0 ? 15 : 0;
    playerEnergy = Math.min(playerEnergy + energyGain, 100);
  }

  // Handle Perfect Hit move unlock
  if (multiplier === 2.5 && playerUnlockedCount < 5) {
    playerUnlockedCount++;
    appendChatMsg("system", `🔓 PERFECT STRIKE! Unlocked a new power move: **${p.moves[playerUnlockedCount - 1].name}**!`, "system");
  }

  opponentHP = Math.max(opponentHP - finalDmg, 0);

  // Multiplayer sync block
  if (!isDemoMode && activeMatchRef) {
    try {
      const matchUpdate = {};
      const hostOrOpp = playerRole; // "host" or "opponent"
      const targetRole = playerRole === "host" ? "opponent" : "host";
      
      matchUpdate[`${hostOrOpp}.hp`] = playerHP; // playerHP includes lifesteal
      matchUpdate[`${hostOrOpp}.energy`] = playerEnergy;
      matchUpdate[`${hostOrOpp}.unlockedCount`] = playerUnlockedCount;
      matchUpdate[`${targetRole}.hp`] = opponentHP;
      
      // If opponent is stunned, player keeps their turn!
      matchUpdate.currentTurn = stunTriggered ? hostOrOpp : targetRole;
      
      if (opponentHP <= 0) {
        matchUpdate.status = "finished";
        matchUpdate.winnerUid = currentUser.uid;
      }
      
      matchUpdate.lastAction = {
        by: hostOrOpp,
        moveName: move.name,
        damage: finalDmg,
        multiplier: evaded ? 0 : multiplier,
        resultText: evaded ? "EVADED" : rankText,
        dialogueText: evaded ? o.dialogues.special : (multiplier === 2.5 ? p.dialogues.ultimate : (activeAttackIndex === 1 ? p.dialogues.special : p.dialogues.strike)),
        timestamp: Date.now(),
        evaded: evaded,
        beastRageApplied: beastRageApplied,
        blazingFuryApplied: blazingFuryApplied,
        blazingFuryPrimed: (multiplier === 2.5 && activeFighter === "bsg"),
        tacticalGuardApplied: tacticalGuardApplied,
        lifestealHeal: lifestealHeal,
        stunTriggered: stunTriggered
      };
      
      matchUpdate.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
      
      await activeMatchRef.update(matchUpdate);
      
      // Log local action directly for smooth performance
      if (evaded) {
        appendChatLog(currentOpponent, o.dialogues.special);
        appendChatMsg("system", `🛡️ **Hell's Timeline Edit** active! Attack was completely evaded!`, "system");
      } else if (multiplier === 0) {
        appendChatLog(activeFighter, `*misses attack* "Darn, my timing was off!"`);
        appendChatMsg("system", `* Player's <strong>${move.name}</strong> missed completely.`, "system");
      } else {
        appendChatLog(activeFighter, matchUpdate.lastAction.dialogueText);
        
        triggerDamageEffect("combat-opponent-card", move.name, finalDmg, multiplier === 2.5);
        
        let criticalFlag = multiplier === 2.5 ? " critical" : "";
        appendChatMsg("action" + criticalFlag, `⚔️ ${p.name} lands ${move.name} (${rankText}) dealing <strong>${finalDmg} damage</strong>!`);
        
        // Print other passives in local logs
        if (beastRageApplied) {
          appendChatMsg("system", `💢 **Zalta's Beast Rage** active! Deals +30% extra damage!`, "system");
        }
        if (blazingFuryApplied) {
          appendChatMsg("system", `🔥 **BSG's Blazing Fury** burns the enemy for +15% extra damage!`, "system");
        }
        if (multiplier === 2.5 && activeFighter === "bsg") {
          appendChatMsg("system", `🔥 BSG's Blazing Fury primed! Next attack will burn!`, "system");
        }
        if (tacticalGuardApplied) {
          appendChatMsg("system", `🛡️ **Suma's Tactical Guard** reduces incoming damage by 20%!`, "system");
        }
        if (lifestealHeal > 0) {
          appendChatMsg("system", `🌀 **Jiggo's Void Absorption** active! Heals Jiggo for **+${lifestealHeal} HP**!`, "system");
        }
        if (stunTriggered) {
          appendChatMsg("system", `💫 **${o.name} is STUNNED**! Berry retains the turn!`, "system");
        }
      }
      
      updateMeterBars();
    } catch (err) {
      console.error("Firestore multiplayer attack sync failed:", err);
      showNotification("Communication with server lost. Match failed.", true);
      endCombat(false);
    }
  } else {
    // Local AI Practice Mode logic (original local offline loop)
    if (evaded) {
      appendChatLog(currentOpponent, o.dialogues.special);
      appendChatMsg("system", `🛡️ **Hell's Timeline Edit** active! Attack was completely evaded!`, "system");
    } else if (multiplier === 0) {
      appendChatLog(activeFighter, `*misses attack* "Darn, my timing was off!"`);
      appendChatMsg("system", `* Player's <strong>${move.name}</strong> missed completely.`, "system");
    } else {
      let dialogue = p.dialogues.strike;
      if (multiplier === 2.5) dialogue = p.dialogues.ultimate;
      else if (activeAttackIndex === 1) dialogue = p.dialogues.special;

      appendChatLog(activeFighter, dialogue);
      
      triggerDamageEffect("combat-opponent-card", move.name, finalDmg, multiplier === 2.5);

      let criticalFlag = multiplier === 2.5 ? " critical" : "";
      appendChatMsg("action" + criticalFlag, `⚔️ ${p.name} lands ${move.name} (${rankText}) dealing <strong>${finalDmg} damage</strong>!`);
      
      if (beastRageApplied) {
        appendChatMsg("system", `💢 **Zalta's Beast Rage** active! Deals +30% extra damage!`, "system");
      }
      if (blazingFuryApplied) {
        appendChatMsg("system", `🔥 **BSG's Blazing Fury** burns the enemy for +15% extra damage!`, "system");
      }
      if (multiplier === 2.5 && activeFighter === "bsg") {
        appendChatMsg("system", `🔥 BSG's Blazing Fury primed! Next attack will burn!`, "system");
      }
      if (tacticalGuardApplied) {
        appendChatMsg("system", `🛡️ **Suma's Tactical Guard** reduces incoming damage by 20%!`, "system");
      }
      if (lifestealHeal > 0) {
        appendChatMsg("system", `🌀 **Jiggo's Void Absorption** active! Heals Jiggo for **+${lifestealHeal} HP**!`, "system");
      }
      if (stunTriggered) {
        appendChatMsg("system", `💫 **${o.name} is STUNNED**! Berry gets an extra turn!`, "system");
      }

      if (opponentHP > 0 && !stunTriggered) {
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

    if (stunTriggered) {
      opponentStunned = false; // reset for player's extra turn
      setTimeout(startPlayerTurn, 2200);
    } else {
      setTimeout(startOpponentTurn, 2200);
    }
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

  // Decide move index: choose highest unlocked move that meets energy requirements
  let moveIdx = 0;
  if (opponentUnlockedCount >= 5 && opponentEnergy >= 100) {
    moveIdx = 4;
  } else if (opponentUnlockedCount >= 4 && opponentEnergy >= 50) {
    moveIdx = 3;
  } else if (opponentUnlockedCount >= 3 && Math.random() < 0.4) {
    moveIdx = 2;
  } else if (opponentUnlockedCount >= 2 && Math.random() < 0.5) {
    moveIdx = 1;
  } else {
    moveIdx = 0;
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

    // Resolve Energy changes for AI
    if (moveIdx === 4) {
      opponentEnergy = 0;
    } else if (moveIdx === 3) {
      opponentEnergy = Math.max(opponentEnergy - 50, 0);
    } else {
      let energyGain = multiplier === 2.5 ? 30 : multiplier > 0 ? 15 : 0;
      opponentEnergy = Math.min(opponentEnergy + energyGain, 100);
    }

    // Handle AI Perfect hit unlocking next move
    if (multiplier === 2.5 && opponentUnlockedCount < 5) {
      opponentUnlockedCount++;
      appendChatMsg("system", `🔓 OPPONENT PERFECT STRIKE! Enemy unlocked a new power move: **${o.moves[opponentUnlockedCount - 1].name}**!`, "system");
    }

    // Desperation Defensive Scaling: As player HP drops, damage taken is reduced (up to 60% mitigation)
    let playerHpRatio = playerHP / playerMaxHP;
    let defenseScale = 0.4 + 0.6 * playerHpRatio;
    let finalDmg = Math.round(move.dmg * multiplier * defenseScale);

    // --- PASSIVES CALCULATIONS (Attacker AI) ---
    
    // Zalta's Beast Rage: Deal +30% damage when HP < 50%
    let beastRageApplied = false;
    if (currentOpponent === "zalta" && multiplier > 0 && finalDmg > 0) {
      if (opponentHP < opponentMaxHP * 0.5) {
        finalDmg = Math.round(finalDmg * 1.30);
        beastRageApplied = true;
      }
    }

    // BSG's Blazing Fury: Deal +15% extra burn damage on next strike after PERFECT
    let blazingFuryApplied = false;
    if (currentOpponent === "bsg" && multiplier > 0 && finalDmg > 0) {
      if (opponentBurnNext) {
        finalDmg = Math.round(finalDmg * 1.15);
        opponentBurnNext = false;
        blazingFuryApplied = true;
      }
      if (multiplier === 2.5) {
        opponentBurnNext = true;
      }
    }

    // --- PASSIVES CALCULATIONS (Defender Player) ---
    
    // Hell's Timeline Edit (Dodge): 12% chance to evade completely
    let evaded = false;
    if (activeFighter === "hell" && multiplier > 0 && finalDmg > 0) {
      if (Math.random() < 0.12) {
        finalDmg = 0;
        evaded = true;
      }
    }

    // Suma's Tactical Guard: Reduce incoming damage by 20%
    let tacticalGuardApplied = false;
    if (activeFighter === "suma" && multiplier > 0 && finalDmg > 0) {
      finalDmg = Math.round(finalDmg * 0.80);
      tacticalGuardApplied = true;
    }

    // --- POST-DAMAGE PASSIVES ---
    
    // Jiggo's Void Absorption (Lifesteal): Heal Jiggo for 20% of damage dealt
    let lifestealHeal = 0;
    if (currentOpponent === "jiggo" && multiplier > 0 && finalDmg > 0) {
      lifestealHeal = Math.round(finalDmg * 0.20);
      opponentHP = Math.min(opponentHP + lifestealHeal, opponentMaxHP);
    }

    // Berry's Heavy Impact (Stun): GREAT or PERFECT has a 20% chance to stun
    let stunTriggered = false;
    if (currentOpponent === "berry" && (multiplier === 1.5 || multiplier === 2.5) && finalDmg > 0) {
      if (Math.random() < 0.20) {
        stunTriggered = true;
        playerStunned = true;
      }
    }

    if (evaded) {
      appendChatLog(activeFighter, p.dialogues.special);
      appendChatMsg("system", `🛡️ **Hell's Timeline Edit** active! Attack was completely evaded!`, "system");
    } else if (multiplier === 0) {
      appendChatLog(currentOpponent, `*misses attack* "Missed! How did that happen?!"`);
      appendChatMsg("system", `* Opponent's <strong>${move.name}</strong> missed completely.`, "system");
    } else {
      let dialogue = o.dialogues.strike;
      if (multiplier === 2.5) dialogue = o.dialogues.ultimate;
      else if (moveIdx === 1) dialogue = o.dialogues.special;

      playerHP = Math.max(playerHP - finalDmg, 0);

      appendChatLog(currentOpponent, dialogue);

      triggerDamageEffect("combat-player-card", move.name, finalDmg, multiplier === 2.5);

      let criticalFlag = multiplier === 2.5 ? " critical" : "";
      appendChatMsg("action" + criticalFlag, `💥 ${o.name} lands ${move.name} (${rankText}) dealing <strong>${finalDmg} damage</strong>!`);

      if (beastRageApplied) {
        appendChatMsg("system", `💢 **Zalta's Beast Rage** active! Deals +30% extra damage!`, "system");
      }
      if (blazingFuryApplied) {
        appendChatMsg("system", `🔥 **BSG's Blazing Fury** burns the enemy for +15% extra damage!`, "system");
      }
      if (multiplier === 2.5 && currentOpponent === "bsg") {
        appendChatMsg("system", `🔥 BSG's Blazing Fury primed! Next attack will burn!`, "system");
      }
      if (tacticalGuardApplied) {
        appendChatMsg("system", `🛡️ **Suma's Tactical Guard** reduces incoming damage by 20%!`, "system");
      }
      if (lifestealHeal > 0) {
        appendChatMsg("system", `🌀 **Jiggo's Void Absorption** active! Heals Jiggo for **+${lifestealHeal} HP**!`, "system");
      }
      if (stunTriggered) {
        appendChatMsg("system", `💫 **${p.name} is STUNNED**! Berry gets an extra turn!`, "system");
      }

      if (playerHP > 0 && !stunTriggered) {
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

    // Go back to Player turn or repeat AI turn if stunned
    if (stunTriggered) {
      playerStunned = false; // Reset
      setTimeout(startOpponentTurn, 2200);
    } else {
      setTimeout(startPlayerTurn, 2200);
    }
  });
}

function animateAIGaugeSlide(multiplier, callback) {
  isPointerMoving = true;
  gaugePosition = 0;
  gaugeDirection = 1;
  
  // Desperation Speed Scaling: As target HP drops, AI gauge speed increases by up to 50%
  let targetHpRatio = playerHP / playerMaxHP;
  let speedScale = 1.5 - 0.5 * targetHpRatio; // 1.0 at full HP, 1.5 at low HP
  gaugeSpeed = 4.0 * speedScale;
  if (currentOpponent === "scinto") {
    gaugeSpeed *= 0.85;
  }

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
      timestamp: Date.now(),
      uid: currentUser.uid || "local-user"
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
    const rawScores = getLocalLeaderboard();
    // Deduplicate: Keep only the highest score for each unique player (uid or name)
    const uniqueScores = [];
    const seen = new Set();
    for (const item of rawScores) {
      const key = item.uid || item.name;
      if (key && !seen.has(key)) {
        seen.add(key);
        uniqueScores.push(item);
      }
      if (uniqueScores.length >= 10) break;
    }
    renderLeaderboardRows(uniqueScores);
  } else {
    if (!db) return;
    db.collection("leaderboard")
      .orderBy("score", "desc")
      .limit(100)
      .onSnapshot(snapshot => {
        const rawScores = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          rawScores.push({
            name: data.name,
            character: data.character,
            score: Number(data.score) || 0,
            timestamp: data.timestamp ? (data.timestamp.seconds * 1000) : Date.now(),
            uid: data.uid
          });
        });

        // Sort descending explicitly in Javascript to ensure correct numeric sorting
        // even if Firestore returns legacy mixed-type string values at the top of the sort.
        rawScores.sort((a, b) => b.score - a.score);

        // Deduplicate: Keep only the highest score for each unique player (uid or name)
        const uniqueScores = [];
        const seen = new Set();
        for (const item of rawScores) {
          const key = item.uid || item.name;
          if (key && !seen.has(key)) {
            seen.add(key);
            uniqueScores.push(item);
          }
          if (uniqueScores.length >= 10) break;
        }

        renderLeaderboardRows(uniqueScores);
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
  const p = CHARACTERS[activeFighter];
  for (let i = 1; i <= 5; i++) {
    const btn = document.getElementById(`btn-attack-${i}`);
    if (btn) {
      btn.disabled = true;
      btn.classList.remove("active-choice");
    }
    // Update labels to keep locks visually in sync
    const label = document.getElementById(`btn-attack${i}-label`);
    if (label && p) {
      const move = p.moves[i - 1];
      if (i <= playerUnlockedCount) {
        label.textContent = move.name;
        if (btn) btn.classList.remove("locked");
      } else {
        label.textContent = `🔒 ${move.name}`;
        if (btn) btn.classList.add("locked");
      }
    }
  }
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

function getEffectType(moveName) {
  if (!moveName) return "slash";
  const name = moveName.toLowerCase();
  if (name.includes("flame") || name.includes("burn") || name.includes("fire") || name.includes("heat") || name.includes("ash")) return "fire";
  if (name.includes("dragon") || name.includes("aura") || name.includes("celestial") || name.includes("timeline") || name.includes("swap") || name.includes("void")) return "energy";
  if (name.includes("portal") || name.includes("dimension") || name.includes("erase") || name.includes("curse")) return "dark";
  if (name.includes("stomp") || name.includes("earth") || name.includes("rampage") || name.includes("stride") || name.includes("heavy") || name.includes("meteorite") || name.includes("crater")) return "heavy";
  if (name.includes("emerald") || name.includes("shadow") || name.includes("jade")) return "emerald";
  if (name.includes("lightning") || name.includes("volt") || name.includes("thunder") || name.includes("plasma") || name.includes("bolt") || name.includes("spark")) return "lightning";
  return "slash";
}

function triggerDamageEffect(targetCardId, moveName, damageAmount = 0, isCritical = false) {
  const card = document.getElementById(targetCardId);
  if (!card) return;

  const effectType = getEffectType(moveName);
  
  // Remove existing overlays first to prevent overlaps
  const oldOverlays = card.querySelectorAll(".damage-effect-overlay");
  oldOverlays.forEach(el => el.remove());

  // Create overlay element
  const overlay = document.createElement("div");
  overlay.className = `damage-effect-overlay effect-${effectType}`;
  
  // Add sub-elements for particle effects
  let particlesHtml = "";
  if (effectType === "fire") {
    particlesHtml = `
      <div class="flame-particle p1"></div>
      <div class="flame-particle p2"></div>
      <div class="flame-particle p3"></div>
      <div class="fire-slash"></div>
    `;
  } else if (effectType === "energy") {
    particlesHtml = `
      <div class="energy-blast"></div>
      <div class="energy-spark s1"></div>
      <div class="energy-spark s2"></div>
      <div class="energy-spark s3"></div>
    `;
  } else if (effectType === "dark") {
    particlesHtml = `
      <div class="dark-portal"></div>
      <div class="dark-smoke sm1"></div>
      <div class="dark-smoke sm2"></div>
    `;
  } else if (effectType === "heavy") {
    particlesHtml = `
      <div class="heavy-ring"></div>
      <div class="heavy-crater"></div>
      <div class="gold-dust gd1"></div>
      <div class="gold-dust gd2"></div>
    `;
  } else if (effectType === "emerald") {
    particlesHtml = `
      <div class="emerald-cut c1"></div>
      <div class="emerald-cut c2"></div>
      <div class="emerald-sparkle es1"></div>
      <div class="emerald-sparkle es2"></div>
    `;
  } else if (effectType === "lightning") {
    particlesHtml = `
      <div class="lightning-strike l1"></div>
      <div class="lightning-strike l2"></div>
      <div class="electric-discharge"></div>
    `;
  } else { // default: slash
    particlesHtml = `
      <div class="slash-line s1"></div>
      <div class="slash-line s2"></div>
    `;
  }

  // Damage number indicator HTML
  const criticalClass = isCritical ? " critical" : "";
  const damageHtml = `
    <div class="damage-number dmg-${effectType}${criticalClass}">
      <span>-${damageAmount}</span>
    </div>
  `;

  overlay.innerHTML = particlesHtml + damageHtml;
  
  // Append to card
  card.appendChild(overlay);
  
  // Add screen shake class
  card.classList.add("damaged");
  
  // Remove after animation finishes
  setTimeout(() => {
    overlay.remove();
    card.classList.remove("damaged");
  }, 600);
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
