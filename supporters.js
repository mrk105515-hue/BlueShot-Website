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
      classNumber: 1,
      classLabel: "Supporter Class 1",
      price: 5,
      minGlory: 5,
      gameCashPrice: 10000,
      image: "assets/rank-elite.png",
      color: "#ff4d2d",
      rgb: "255, 77, 45",
      title: "Supporter Class 1",
      tagline: "The steadfast foundation of the resistance.",
      perks: [
        "Get your Name Featured in Supporter Credits",
        "Elite Supporter Badge",
        "Supporter Updates & Polls"
      ]
    },
    warlord: {
      id: "warlord",
      name: "WARLORD",
      classNumber: 2,
      classLabel: "Supporter Class 2",
      price: 10,
      minGlory: 10,
      image: "assets/rank-warlord.png",
      color: "#00a8ff",
      rgb: "0, 168, 255",
      title: "Supporter Class 2",
      tagline: "Leading the frontlines into cosmic battle.",
      perks: [
        "Ask a Quiz Question (Featured in Community Quiz)",
        "All Elite Perks",
        "Warlord Badge & Highlight"
      ]
    },
    apex: {
      id: "apex",
      name: "APEX",
      classNumber: 3,
      classLabel: "Supporter Class 3",
      price: 40,
      minGlory: 40,
      image: "assets/rank-apex.png",
      color: "#ffaa00",
      rgb: "255, 170, 0",
      title: "Supporter Class 3",
      popular: true,
      tagline: "Unrivaled warriors reaching the peak of cosmic power.",
      perks: [
        "Add a Special Story Part (Idea, Theory or Concept)",
        "All Warlord Perks",
        "Apex Badge & Higher Priority"
      ]
    },
    emperor: {
      id: "emperor",
      name: "EMPEROR",
      classNumber: 4,
      classLabel: "Supporter Class 4",
      price: 100,
      minGlory: 100,
      image: "assets/rank-emperor.png",
      color: "#b026ff",
      rgb: "176, 38, 255",
      title: "Supporter Class 4",
      supreme: true,
      tagline: "Supreme rulers who shape the destiny of DXZ.",
      perks: [
        "Get a Special Character Appearance (Cameo / Custom Role)",
        "All Apex Perks",
        "Entrance in the Hall of Fame"
      ]
    }
  };

    // ==========================================================================
  // REALISTIC INDIAN GAMING COMMUNITY POOL & VECTOR PRESET EMBLEMS
  // ==========================================================================
  const INDIAN_GAMING_USERNAMES = [
    "Aman_Sniper", "Rahul007", "AdityaRawat", "AryanX21", "Kunal_OP", "RohanMehta",
    "Dev_Rajput", "Sahil_Gamer", "AmanVerma_FPS", "Rohit_Sharma_YT", "Shreyas_Pro",
    "Tanmay_07", "Harsh_Bhardwaj", "Varun_Sniper", "Yash_Pandey", "NitinGamer_IN",
    "Akash_Choudhary", "Rishabh_OP", "Siddharth_V", "ShubhamG", "Ayush_B",
    "Mohit_Rawat", "Pranav_Sharma", "Gaurav_Singh", "Ankit_Raj", "Abhishek_01",
    "Parth_Gamer", "Shivam_Pro", "Vivek_Kumar", "Kartik_Sharma", "Tarun_V",
    "Chetan_OP", "Mayank_Joshi", "Deepak_Chauhan", "Suraj_FPS", "Vikram_Rathore",
    "Alok_Gamer", "Sumit_Yadav", "Manish_007", "Neel_Patel", "Karan_Malhotra",
    "Piyush_Babu", "Rakesh_Thakur", "Prateek_B", "Hemant_Rawat", "Chirag_OP",
    "Anmol_Singh", "Naveen_Kumar", "Rajesh_YT", "Saurabh_Gamer", "Ashish_Sniper",
    "Tushar_Verma", "Dhruv_Rathi_Fan", "Lokesh_09", "Harshit_V", "Pankaj_R",
    "Dinesh_Gaming", "Bhavesh_Patil", "Arun_Nair", "Mukesh_Bhai", "Sanjay_OP",
    "Girish_FPS", "Anand_Rajput", "Manoj_Sniper", "Suresh_007", "Pawan_Kumar",
    "Umesh_Gamer", "Kamal_Singh", "Ravi_Kishan_OP", "Ajay_Dev_21", "Nikhil_Bhardwaj",
    "Gautam_Chopra", "Bhuvan_YT", "Akshat_Gamer", "Rajat_Dalal_OP", "Samir_Khan",
    "Faizan_FPS", "Arman_Malik", "Kabir_Singh_99", "Raghav_Joshi", "Madhav_V",
    "Lakshya_Sharma", "Sanket_Patil", "Omkar_Gamer", "Pratham_07", "Tejas_Rathore",
    "Atharva_K", "Hardik_Gamer", "Rudra_OP", "Reyansh_Verma", "Shaurya_Singh",
    "Aarav_Sniper", "Vivaan_01", "Advait_Raj", "Kabir_Pro", "Ishaan_Mehta",
    "Anirudh_Gamer", "Keshav_Chauhan", "Madhavan_FPS", "Subhash_Bhai", "Dhanush_OP",
    "Balaji_Gamer", "Raghu_Rawat", "Venkatesh_07", "Jayant_Verma", "Inderjeet_Singh",
    "Kuldeep_Yadav", "Joginder_OP", "Sunny_Deol_Fan", "Montu_Gamer", "Sonu_Bhardwaj",
    "Chhotu_Sniper", "Monu_Rawat", "Golu_Gamer", "Bunty_OP", "Pappu_Can_Play"
  ];

  const FACTIONS = [
    "Delhi Dragons", "Mumbai Strikers", "Bengaluru Titans", "Punjab Kings eSports",
    "Hydra Squad", "Team Velocity", "Phoenix eSports", "GodLike Clan",
    "Revenant Clan", "BlueShot Community", "Deccan Warriors", "Kolkata Knights"
  ];

  // Vector Preset Symbols for Simulated Community Profiles
  function createPresetSymbolUri(symbolId, paletteId) {
    const palettes = [
      { start: '#7928ca', end: '#ff0080' },
      { start: '#0070f3', end: '#00dfd8' },
      { start: '#f59e0b', end: '#d97706' },
      { start: '#ef4444', end: '#b91c1c' },
      { start: '#10b981', end: '#059669' },
      { start: '#8b5cf6', end: '#6d28d9' },
      { start: '#ec4899', end: '#be185d' },
      { start: '#06b6d4', end: '#0284c7' },
      { start: '#f97316', end: '#ea580c' },
      { start: '#6366f1', end: '#4338ca' },
      { start: '#14b8a6', end: '#0f766e' },
      { start: '#e11d48', end: '#9f1239' }
    ];

    const p = palettes[(paletteId || 0) % palettes.length];

    const symbols = [
      // 0: Shield
      '<path d="M50 16 L78 28 C78 56 50 78 50 84 C50 78 22 56 22 28 Z" fill="none" stroke="#ffffff" stroke-width="5" stroke-linejoin="round"/><path d="M50 32 L66 40 C66 56 50 68 50 72 C50 68 34 56 34 40 Z" fill="#ffffff" opacity="0.85"/>',
      // 1: Crossed Swords
      '<path d="M25 25 L75 75 M33 22 L78 67 M22 33 L67 78 M75 25 L25 75 M67 22 L22 67 M78 33 L33 78" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/><circle cx="50" cy="50" r="5" fill="#ffffff"/>',
      // 2: Crosshair / Target
      '<circle cx="50" cy="50" r="28" fill="none" stroke="#ffffff" stroke-width="4.5"/><circle cx="50" cy="50" r="14" fill="none" stroke="#ffffff" stroke-width="3.5"/><line x1="50" y1="12" x2="50" y2="28" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/><line x1="50" y1="72" x2="50" y2="88" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/><line x1="12" y1="50" x2="28" y2="50" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/><line x1="72" y1="50" x2="88" y2="50" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/><circle cx="50" cy="50" r="3.5" fill="#ffffff"/>',
      // 3: Lightning Bolt
      '<path d="M56 14 L26 50 L48 50 L44 86 L74 46 L52 46 Z" fill="#ffffff" stroke="#ffffff" stroke-width="3" stroke-linejoin="round"/>',
      // 4: Crown
      '<path d="M22 68 L22 36 L36 50 L50 24 L64 50 L78 36 L78 68 Z" fill="#ffffff" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round"/><circle cx="50" cy="22" r="3.5" fill="#ffffff"/><circle cx="22" cy="34" r="3" fill="#ffffff"/><circle cx="78" cy="34" r="3" fill="#ffffff"/><rect x="22" y="72" width="56" height="6" rx="3" fill="#ffffff"/>',
      // 5: Flame
      '<path d="M50 15 C50 15 65 35 65 52 C65 68 55 82 50 85 C45 82 35 68 35 52 C35 38 42 28 50 15 Z" fill="#ffffff"/><path d="M50 40 C50 40 58 52 58 62 C58 70 54 76 50 78 C46 76 42 70 42 62 C42 54 46 48 50 40 Z" fill="' + p.end + '"/>',
      // 6: Gaming Skull
      '<path d="M30 45 C30 28 70 28 70 45 C70 56 65 62 60 65 L60 75 L40 75 L40 65 C35 62 30 56 30 45 Z" fill="#ffffff"/><circle cx="42" cy="48" r="5" fill="' + p.start + '"/><circle cx="58" cy="48" r="5" fill="' + p.start + '"/><path d="M48 58 L52 58 L50 63 Z" fill="' + p.start + '"/><line x1="45" y1="70" x2="45" y2="75" stroke="' + p.start + '" stroke-width="2"/><line x1="50" y1="70" x2="50" y2="75" stroke="' + p.start + '" stroke-width="2"/><line x1="55" y1="70" x2="55" y2="75" stroke="' + p.start + '" stroke-width="2"/>',
      // 7: Trident
      '<path d="M50 15 L50 85 M50 15 L44 26 M50 15 L56 26 M32 30 C32 50 50 54 50 54 C50 54 68 50 68 30 M32 30 L27 38 M68 30 L73 38" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><line x1="42" y1="80" x2="58" y2="80" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/>',
      // 8: Tactical Star
      '<path d="M50 15 L58 38 L82 38 L62 52 L70 75 L50 60 L30 75 L38 52 L18 38 L42 38 Z" fill="#ffffff" stroke="#ffffff" stroke-width="3" stroke-linejoin="round"/>',
      // 9: Shuriken
      '<path d="M50 15 L57 43 L85 50 L57 57 L50 85 L43 57 L15 50 L43 43 Z" fill="#ffffff" stroke="#ffffff" stroke-width="2.5" stroke-linejoin="round"/><circle cx="50" cy="50" r="7" fill="' + p.start + '"/>',
      // 10: Falcon Wings
      '<path d="M50 26 C60 38 78 40 84 58 C74 58 64 50 50 60 C36 50 26 58 16 58 C22 40 40 38 50 26 Z" fill="#ffffff"/><path d="M50 58 L46 76 L50 82 L54 76 Z" fill="#ffffff"/>',
      // 11: Helm / Spartan
      '<path d="M50 18 C30 18 26 36 26 54 C26 72 36 78 36 78 L42 66 L58 66 L64 78 C64 78 74 72 74 54 C74 36 70 18 50 18 Z" fill="#ffffff"/><line x1="50" y1="28" x2="50" y2="60" stroke="' + p.start + '" stroke-width="4.5"/><line x1="36" y1="46" x2="64" y2="46" stroke="' + p.start + '" stroke-width="4.5"/>',
      // 12: Alpha Wolf
      '<path d="M28 28 L40 44 L32 62 L42 66 L50 82 L58 66 L68 62 L60 44 L72 28 L58 36 L50 22 L42 36 Z" fill="#ffffff" stroke="#ffffff" stroke-width="2.5" stroke-linejoin="round"/><circle cx="43" cy="50" r="3" fill="' + p.start + '"/><circle cx="57" cy="50" r="3" fill="' + p.start + '"/>',
      // 13: Dragon Crest
      '<path d="M35 25 C45 18 65 20 68 35 C70 48 55 52 62 65 C68 76 58 84 46 80 C36 76 38 64 48 62 C58 60 52 46 44 45 C38 44 32 35 35 25 Z" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/><circle cx="58" cy="32" r="3.5" fill="#ffffff"/>',
      // 14: Compass Rose
      '<polygon points="50,15 54,46 85,50 54,54 50,85 46,54 15,50 46,46" fill="#ffffff"/><polygon points="50,15 50,50 15,50" fill="rgba(255,255,255,0.7)"/><polygon points="50,85 50,50 85,50" fill="rgba(255,255,255,0.7)"/><circle cx="50" cy="50" r="4" fill="' + p.end + '"/>',
      // 15: Assassin Blade
      '<path d="M50 14 C50 14 62 38 58 60 C55 76 44 86 44 86 C44 86 42 74 45 62 C48 48 44 32 50 14 Z" fill="#ffffff"/><line x1="32" y1="65" x2="68" y2="65" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>'
    ];

    const s = symbols[(symbolId || 0) % symbols.length];
    const gradId = 'bgGrad_' + (symbolId || 0) + '_' + (paletteId || 0);
    const svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><defs><linearGradient id='" + gradId + "' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='" + p.start + "'/><stop offset='100%' stop-color='" + p.end + "'/></linearGradient></defs><rect width='100' height='100' rx='50' fill='url(#" + gradId + ")'/><g>" + s + "</g></svg>";

    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  // Default Vector Initials Avatar for Real Users without custom upload
  function createDefaultUserAvatar(name) {
    const cleanName = (name || "Player").trim();
    const parts = cleanName.split(/\s+/);
    const initials = (parts[0] ? parts[0][0] : "P") + (parts[1] ? parts[1][0] : "");
    let hash = 0;
    for (let i = 0; i < cleanName.length; i++) {
      hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue1 = Math.abs(hash) % 360;
    const hue2 = (hue1 + 45) % 360;
    const svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><defs><linearGradient id='usrGrad' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='hsl(" + hue1 + ", 75%, 45%)'/><stop offset='100%' stop-color='hsl(" + hue2 + ", 85%, 35%)'/></linearGradient></defs><rect width='100' height='100' rx='50' fill='url(#usrGrad)'/><text x='50' y='61' font-family='sans-serif' font-size='36' font-weight='800' fill='#ffffff' text-anchor='middle'>" + initials.toUpperCase() + "</text></svg>";
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  // Build the master pool of 115 simulated Indian gamer profiles (5-1100 Glory)
  function buildSimulatedCommunityPool() {
    const pool = [];
    
    // 12 Emperor profiles: 1080 down to 115 (minGlory: 100)
    const emperorScores = [1095, 1080, 960, 850, 740, 620, 530, 440, 360, 280, 210, 160];
    for (let i = 0; i < 12; i++) {
      const idx = i;
      pool.push({
        id: "sim_in_" + (idx + 1),
        name: INDIAN_GAMING_USERNAMES[idx],
        rank: "emperor",
        glory: emperorScores[i],
        baseGlory: emperorScores[i],
        minRankGlory: 100,
        maxRankGlory: 1100,
        symbolId: idx % 16,
        paletteId: (idx * 7) % 12,
        symbolUri: createPresetSymbolUri(idx % 16, (idx * 7) % 12),
        verified: false,
        isSimulated: true,
        faction: "",
        message: "Pushing rank with the boys! 🔥"
      });
    }

    // 28 Apex profiles: 98 down to 42 (minGlory: 40)
    const apexStep = (98 - 42) / 27;
    for (let i = 0; i < 28; i++) {
      const idx = 12 + i;
      const score = Math.round(98 - (i * apexStep));
      pool.push({
        id: "sim_in_" + (idx + 1),
        name: INDIAN_GAMING_USERNAMES[idx],
        rank: "apex",
        glory: score,
        baseGlory: score,
        minRankGlory: 40,
        maxRankGlory: 99,
        symbolId: idx % 16,
        paletteId: (idx * 7) % 12,
        symbolUri: createPresetSymbolUri(idx % 16, (idx * 7) % 12),
        verified: false,
        isSimulated: true,
        faction: "",
        message: "Grinding for Emperor tier next."
      });
    }

    // 45 Warlord profiles: 39 down to 10 (minGlory: 10)
    const warlordStep = (39 - 10) / 44;
    for (let i = 0; i < 45; i++) {
      const idx = 12 + 28 + i;
      const score = Math.round(39 - (i * warlordStep));
      pool.push({
        id: "sim_in_" + (idx + 1),
        name: INDIAN_GAMING_USERNAMES[idx],
        rank: "warlord",
        glory: score,
        baseGlory: score,
        minRankGlory: 10,
        maxRankGlory: 39,
        symbolId: idx % 16,
        paletteId: (idx * 7) % 12,
        symbolUri: createPresetSymbolUri(idx % 16, (idx * 7) % 12),
        verified: false,
        isSimulated: true,
        faction: "",
        message: "Supporting BlueShot since day one."
      });
    }

    // 30 Elite profiles: 9 down to 5 (minGlory: 5)
    for (let i = 0; i < 30; i++) {
      const idx = 12 + 28 + 45 + i;
      const score = 9 - (i % 5);
      pool.push({
        id: "sim_in_" + (idx + 1),
        name: INDIAN_GAMING_USERNAMES[idx],
        rank: "elite",
        glory: score,
        baseGlory: score,
        minRankGlory: 5,
        maxRankGlory: 9,
        symbolId: idx % 16,
        paletteId: (idx * 7) % 12,
        symbolUri: createPresetSymbolUri(idx % 16, (idx * 7) % 12),
        verified: false,
        isSimulated: true,
        faction: "",
        message: "Hyped for the lore mystery chapters!"
      });
    }

    return pool;
  }

  const SIMULATED_COMMUNITY_POOL = buildSimulatedCommunityPool();
  const STORAGE_KEY_COMMUNITY = "dxz_simulated_community_v4";
  const ROTATION_CYCLE_MS = 2.5 * 24 * 60 * 60 * 1000; // 2.5 days rotation
  const MICRO_ADJUST_INTERVAL_MS = 3 * 60 * 1000; // 3 minutes adjustment interval

  // Get active rotated slice with periodic micro-adjustments stored in localStorage
  function getActiveSimulatedProfiles() {
    const currentCycle = Math.floor(Date.now() / ROTATION_CYCLE_MS);
    let state = null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_COMMUNITY);
      if (stored) state = JSON.parse(stored);
    } catch (e) {
      state = null;
    }

    // Check if current cycle is valid
    if (state && state.cycle === currentCycle && Array.isArray(state.profiles) && state.profiles.length > 0) {
      // Check if micro-adjustments are due (> 3 minutes)
      const now = Date.now();
      if (now - (state.lastMicroAdjust || 0) >= MICRO_ADJUST_INTERVAL_MS) {
        // Micro-adjust 4-6 random profiles by +/- 1 to 3 points within rank bounds
        const countToAdjust = 4 + Math.floor(Math.random() * 3);
        for (let k = 0; k < countToAdjust; k++) {
          const randIdx = Math.floor(Math.random() * state.profiles.length);
          const p = state.profiles[randIdx];
          const delta = (Math.random() < 0.55 ? 1 : -1) * (1 + Math.floor(Math.random() * 3));
          p.glory = Math.max(p.minRankGlory, Math.min(p.maxRankGlory, p.glory + delta));
        }
        state.lastMicroAdjust = now;
        try {
          localStorage.setItem(STORAGE_KEY_COMMUNITY, JSON.stringify(state));
        } catch (e) {}
      }
      return state.profiles;
    }

    // Generate fresh rotated slice for this 2.5-day cycle
    const emperors = SIMULATED_COMMUNITY_POOL.filter(p => p.rank === "emperor");
    const apexes = SIMULATED_COMMUNITY_POOL.filter(p => p.rank === "apex");
    const warlords = SIMULATED_COMMUNITY_POOL.filter(p => p.rank === "warlord");
    const elites = SIMULATED_COMMUNITY_POOL.filter(p => p.rank === "elite");

    const activeList = [];
    // 5 emperors, 12 apex, 18 warlord, 10 elite (total 45)
    for (let i = 0; i < 5; i++) {
      activeList.push({ ...emperors[(i + currentCycle * 3) % emperors.length] });
    }
    for (let i = 0; i < 12; i++) {
      activeList.push({ ...apexes[(i + currentCycle * 5) % apexes.length] });
    }
    for (let i = 0; i < 18; i++) {
      activeList.push({ ...warlords[(i + currentCycle * 7) % warlords.length] });
    }
    for (let i = 0; i < 10; i++) {
      activeList.push({ ...elites[(i + currentCycle * 11) % elites.length] });
    }

    const newState = {
      cycle: currentCycle,
      lastMicroAdjust: Date.now(),
      profiles: activeList
    };

    try {
      localStorage.setItem(STORAGE_KEY_COMMUNITY, JSON.stringify(newState));
    } catch (e) {}

    return activeList;
  }

  // Real Supporters Seed (Empty by default - real patrons loaded from Firestore / local storage)
  const DEFAULT_SUPPORTERS = [];

  // Merge Real Supporters with Simulated Profiles:
  // 1. Prioritizes real supporters by Lifetime Glory.
  // 2. Evicts any simulated profile within +/- 35 points of a real supporter.
  // 3. Gradually reduces simulated profiles as real supporters grow (target 40 total).
  function getMergedSupporters(realSupporters) {
    const safeReal = Array.isArray(realSupporters) ? realSupporters : [];
    const activeSim = getActiveSimulatedProfiles();

    // Proximity eviction: if real supporter is within +/- 35 glory points of a simulated entry, evict it
    const filteredSim = activeSim.filter(sim => {
      return !safeReal.some(real => Math.abs((real.glory || 0) - sim.glory) <= 35);
    });

    // Gradually reduce simulated entries (at 40 real supporters, 0 simulated entries appear)
    const maxSim = Math.max(0, 40 - safeReal.length);
    const finalSim = filteredSim.slice(0, maxSim);

    const merged = [...safeReal, ...finalSim];
    merged.sort((a, b) => (b.glory || 0) - (a.glory || 0));
    return merged;
  }

  let supportersData = getMergedSupporters([]);
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
    loadLocalSupporters();
    initSupporterModal();
    window.loadSupportersFromDatabase();

    // Live background micro-adjustment sync every 3 minutes
    setInterval(() => {
      if (typeof window.loadSupportersFromDatabase === "function") {
        window.loadSupportersFromDatabase();
      }
    }, 3 * 60 * 1000);
  });

  // ==========================================================================
  // AUTHENTICATION MANAGEMENT
  // ==========================================================================
  function initAuthListener() {
    const checkDemoFallback = () => {
      const demoUser = localStorage.getItem("dxz_demo_user");
      if (demoUser) {
        try { return JSON.parse(demoUser); } catch (e) {}
      }
      return null;
    };

    if (typeof firebase !== "undefined" && firebase.auth) {
      firebase.auth().onAuthStateChanged((user) => {
        const effectiveUser = user || checkDemoFallback();
        currentUser = effectiveUser;
        updateAuthUI(effectiveUser);
        
        // Auto-fill inputs if supporter modal is open
        if (effectiveUser) {
          const nameInput = document.getElementById("supporter-name-input");
          const emailInput = document.getElementById("supporter-email-input");
          if (nameInput && !nameInput.value) {
            nameInput.value = effectiveUser.displayName || (effectiveUser.email ? effectiveUser.email.split("@")[0] : "");
          }
          if (emailInput && !emailInput.value) {
            emailInput.value = effectiveUser.email || "";
          }
        }
      });
    } else {
      currentUser = checkDemoFallback();
      updateAuthUI(currentUser);
    }
  }

  function updateAuthUI(user) {
    const authBar = document.getElementById("supporter-auth-bar");
    if (!authBar) return;

    const isMaster = user && user.email && user.email.toLowerCase() === "blueshotconnectx@gmail.com";
    if (isMaster) {
      sessionStorage.setItem("dxz_admin_authenticated", "true");
      sessionStorage.setItem("dxz_admin_user", JSON.stringify({
        email: "blueshotconnectx@gmail.com",
        name: user.displayName || "Owner",
        isMaster: true
      }));

      // Add Admin link to main navigation bar
      const navLinks = document.getElementById("nav-links");
      if (navLinks && !document.getElementById("nav-admin-link")) {
        const li = document.createElement("li");
        li.id = "nav-admin-link";
        li.className = "nav-link";
        li.innerHTML = '<a href="admin.html" style="color: #c742ff; font-weight: 800;"><i class="fa-solid fa-crown" style="color: #ffd700; margin-right: 4px;"></i>Admin</a>';
        navLinks.appendChild(li);
      }
    } else {
      const adminNav = document.getElementById("nav-admin-link");
      if (adminNav) adminNav.remove();
    }

    if (user) {
      const displayName = user.displayName || (user.email ? user.email.split("@")[0] : "Supporter");
      authBar.innerHTML = `
        <div class="auth-bar-logged-in">
          <div class="auth-user-chip">
            <span class="auth-status-dot online"></span>
            <div class="auth-user-meta">
              <span class="auth-greeting">Signed In As</span>
              <strong class="auth-username">${escapeHtml(displayName)}</strong>
              ${isMaster ? '<span style="font-size: 0.65rem; font-weight: 900; background: #ffd700; color: #000; padding: 0.12rem 0.5rem; border-radius: 999px; margin-left: 0.4rem; letter-spacing: 0.05em;">MASTER ADMIN</span>' : ''}
              <span class="auth-email">(${escapeHtml(user.email || "")})</span>
            </div>
          </div>
          <div class="auth-actions">
            ${isMaster ? `
              <a href="admin.html" class="btn btn-sm" style="background: linear-gradient(135deg, #c742ff, #7928ca); color: #fff; font-weight: 800; border-radius: 999px; padding: 0.38rem 0.95rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.45rem; box-shadow: 0 0 16px rgba(199,66,255,0.4);">
                <i class="fa-solid fa-crown" style="color: #ffd700;"></i> Open Admin Panel
              </a>
            ` : `
              <span class="auth-verified-badge"><i class="fa-solid fa-circle-check"></i> Eligible to Claim Ranks</span>
            `}
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

  // Claim click handler: opens the Buy & Glory modal directly
  window.handleClaimClick = function(rankId) {
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

  
  function getSupporterAvatar(supporter) {
    if (!supporter) return createDefaultUserAvatar("Player");
    // Real supporters: use uploaded avatar, Neeraj canonical avatar, or default vector initials
    if (supporter.isReal) {
      if (supporter.avatar) return supporter.avatar;
      const name = (supporter.name || "").toLowerCase();
      
      return createDefaultUserAvatar(supporter.name);
    }
    // Simulated community profile: use vector preset symbol
    if (supporter.symbolUri) return supporter.symbolUri;
    if (typeof supporter.symbolId === "number") {
      return createPresetSymbolUri(supporter.symbolId, supporter.paletteId || 0);
    }
    return createPresetSymbolUri(0, 0);
  }


  // ==========================================================================
  // ESPORTS-STYLE GLORY LEADERBOARD RENDERING (PODIUM + FILTER TABS + TABLE)
  // ==========================================================================
  function renderMergedRankBoards() {
    const container = document.getElementById("merged-rank-boards");
    if (!container) return;

    // Filter supporters by active tab
    const filteredSupporters = (activeFilter === "all")
      ? [...supportersData]
      : supportersData.filter(s => (s.rank || "").toLowerCase() === activeFilter);

    // Sort descending by glory
    filteredSupporters.sort((a, b) => (b.glory || 0) - (a.glory || 0));

    // Top 3 supporters for the podium
    const top3 = (activeFilter === "all" ? supportersData : filteredSupporters).slice(0, 3);
    const top1 = top3[0] || null;
    const top2 = top3[1] || null;
    const top3rd = top3[2] || null;

    // Build Podium HTML - Connected Architectural Platforms with Background Artwork
    let podiumHtml = "";
    if (top1) {
      const rank1 = SUPPORTER_RANKS[top1.rank] || SUPPORTER_RANKS.emperor;
      const rank2 = top2 ? (SUPPORTER_RANKS[top2.rank] || SUPPORTER_RANKS.apex) : null;
      const rank3 = top3rd ? (SUPPORTER_RANKS[top3rd.rank] || SUPPORTER_RANKS.warlord) : null;

      podiumHtml = `
        <div class="podium-stage-container">
          <!-- Ambient Lighting (Purple center, Red left, Orange right) -->
          <div class="podium-ambient-center" aria-hidden="true"></div>
          <div class="char-ambient-left" aria-hidden="true"></div>
          <div class="char-ambient-right" aria-hidden="true"></div>

          <!-- Left Character: Hell with Cup, BESIDE the ladders -->
          <div class="side-character-left" aria-hidden="true"></div>

          <!-- Connected Architectural Stage (3 Ladders in Center) -->
          <div class="podium-stage">
            <div class="podium-pillars-row">

              <!-- 2ND PLACE (LEFT PILLAR - SILVER / BLUE) -->
              ${top2 ? `
              <div class="architectural-pillar pillar-rank-2">
                <div class="podium-wreath-badge silver-wreath">
                    <div class="wreath-num-wrap">
                      <svg class="wreath-branch left" width="14" height="22" viewBox="0 0 16 26" fill="#e2e8f0">
                        <path d="M14 24 C 6 20 2 12 4 2 C 5 7 9 12 14 14 C 11 11 12 6 15 4 C 13 8 13 13 14 18 Z" opacity="0.95"/>
                        <circle cx="4" cy="5" r="1.6"/><circle cx="2" cy="11" r="1.6"/><circle cx="4" cy="17" r="1.6"/><circle cx="8" cy="22" r="1.6"/>
                      </svg>
                      <span class="wreath-digit silver-text">2</span>
                      <svg class="wreath-branch right" width="14" height="22" viewBox="0 0 16 26" fill="#e2e8f0" style="transform: scaleX(-1);">
                        <path d="M14 24 C 6 20 2 12 4 2 C 5 7 9 12 14 14 C 11 11 12 6 15 4 C 13 8 13 13 14 18 Z" opacity="0.95"/>
                        <circle cx="4" cy="5" r="1.6"/><circle cx="2" cy="11" r="1.6"/><circle cx="4" cy="17" r="1.6"/><circle cx="8" cy="22" r="1.6"/>
                      </svg>
                    </div>
                  </div>
                <div class="pillar-avatar-box silver-ring">
                  <img src="${getSupporterAvatar(top2)}" alt="${escapeHtml(top2.name)}" class="pillar-avatar-img">
                  <span class="pillar-crest-tag" title="${rank2.name}">
                    <img src="${rank2.image}" alt="${rank2.name}">
                  </span>
                </div>
                <div class="pillar-platform-block">
                  <div class="platform-content">
                    <div class="pillar-username-row">
                      <span class="pillar-username">${escapeHtml(top2.name)}</span>
                      ${top2.isSimulated ? '<span class="podium-sample-pill" title="Community Sample Profile">Community</span>' : ''}
                    </div>
                    <div class="pillar-rank-pill ${rank2.id}-pill">
                      <span>${rank2.name}</span>
                    </div>
                    <div class="pillar-glory-pill silver">
                      <span class="glory-bolt">⚡</span>
                      <span>${(top2.glory || 0).toLocaleString('en-IN')}</span>
                      <span class="glory-lbl">GLORY</span>
                    </div>
                  </div>
                  <span class="platform-rank-num">2</span>
                </div>
              </div>
              ` : '<div class="architectural-pillar pillar-empty"></div>'}

              <!-- 1ST PLACE (CENTER PILLAR - TALLEST, GOLD) -->
              <div class="architectural-pillar pillar-rank-1">
                <div class="podium-wreath-badge gold-wreath">
                    <svg class="podium-crown-mini" width="24" height="18" viewBox="0 0 24 20" fill="#ffd700">
                      <path d="M2 17L4 5L8.5 10L12 3L15.5 10L20 5L22 17H2Z"/>
                    </svg>
                    <div class="wreath-num-wrap">
                      <svg class="wreath-branch left" width="16" height="24" viewBox="0 0 16 26" fill="#ffd700">
                        <path d="M14 24 C 6 20 2 12 4 2 C 5 7 9 12 14 14 C 11 11 12 6 15 4 C 13 8 13 13 14 18 Z" opacity="0.95"/>
                        <circle cx="4" cy="5" r="1.6"/><circle cx="2" cy="11" r="1.6"/><circle cx="4" cy="17" r="1.6"/><circle cx="8" cy="22" r="1.6"/>
                      </svg>
                      <span class="wreath-digit gold-text">1</span>
                      <svg class="wreath-branch right" width="16" height="24" viewBox="0 0 16 26" fill="#ffd700" style="transform: scaleX(-1);">
                        <path d="M14 24 C 6 20 2 12 4 2 C 5 7 9 12 14 14 C 11 11 12 6 15 4 C 13 8 13 13 14 18 Z" opacity="0.95"/>
                        <circle cx="4" cy="5" r="1.6"/><circle cx="2" cy="11" r="1.6"/><circle cx="4" cy="17" r="1.6"/><circle cx="8" cy="22" r="1.6"/>
                      </svg>
                    </div>
                  </div>
                <div class="pillar-avatar-box gold-ring">
                  <img src="${getSupporterAvatar(top1)}" alt="${escapeHtml(top1.name)}" class="pillar-avatar-img">
                  <span class="pillar-crest-tag" title="${rank1.name}">
                    <img src="${rank1.image}" alt="${rank1.name}">
                  </span>
                </div>
                <div class="pillar-platform-block">
                  <div class="platform-content">
                    <div class="pillar-username-row">
                      <span class="pillar-username">${escapeHtml(top1.name)}</span>
                      ${top1.isSimulated ? '<span class="podium-sample-pill" title="Community Sample Profile">Community</span>' : ''}
                      ${top1.verified ? `
                        <svg class="verified-badge" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      ` : ''}
                    </div>
                    <div class="pillar-rank-pill ${rank1.id}-pill">
                      <span>${rank1.name}</span>
                    </div>
                    <div class="pillar-glory-pill gold">
                      <span class="glory-bolt">⚡</span>
                      <span>${(top1.glory || 0).toLocaleString('en-IN')}</span>
                      <span class="glory-lbl">GLORY</span>
                    </div>
                  </div>
                  <span class="platform-rank-num">1</span>
                  <div class="pillar-base-emblem gold-emblem" aria-hidden="true">
                    <svg width="34" height="28" viewBox="0 0 34 28" fill="none">
                      <path d="M17 1 L21 9 L30 10 L23 17 L25 26 L17 21 L9 26 L11 17 L4 10 L13 9 Z" fill="#ffd700" stroke="#f59e0b" stroke-width="1.2"/>
                      <circle cx="17" cy="15" r="3.2" fill="#fff" opacity="0.9"/>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- 3RD PLACE (RIGHT PILLAR - BRONZE) -->
              ${top3rd ? `
              <div class="architectural-pillar pillar-rank-3">
                <div class="podium-wreath-badge bronze-wreath">
                    <div class="wreath-num-wrap">
                      <svg class="wreath-branch left" width="14" height="22" viewBox="0 0 16 26" fill="#f59e0b">
                        <path d="M14 24 C 6 20 2 12 4 2 C 5 7 9 12 14 14 C 11 11 12 6 15 4 C 13 8 13 13 14 18 Z" opacity="0.95"/>
                        <circle cx="4" cy="5" r="1.6"/><circle cx="2" cy="11" r="1.6"/><circle cx="4" cy="17" r="1.6"/><circle cx="8" cy="22" r="1.6"/>
                      </svg>
                      <span class="wreath-digit bronze-text">3</span>
                      <svg class="wreath-branch right" width="14" height="22" viewBox="0 0 16 26" fill="#f59e0b" style="transform: scaleX(-1);">
                        <path d="M14 24 C 6 20 2 12 4 2 C 5 7 9 12 14 14 C 11 11 12 6 15 4 C 13 8 13 13 14 18 Z" opacity="0.95"/>
                        <circle cx="4" cy="5" r="1.6"/><circle cx="2" cy="11" r="1.6"/><circle cx="4" cy="17" r="1.6"/><circle cx="8" cy="22" r="1.6"/>
                      </svg>
                    </div>
                  </div>
                <div class="pillar-avatar-box bronze-ring">
                  <img src="${getSupporterAvatar(top3rd)}" alt="${escapeHtml(top3rd.name)}" class="pillar-avatar-img">
                  <span class="pillar-crest-tag" title="${rank3.name}">
                    <img src="${rank3.image}" alt="${rank3.name}">
                  </span>
                </div>
                <div class="pillar-platform-block">
                  <div class="platform-content">
                    <div class="pillar-username-row">
                      <span class="pillar-username">${escapeHtml(top3rd.name)}</span>
                      ${top3rd.isSimulated ? '<span class="podium-sample-pill" title="Community Sample Profile">Community</span>' : ''}
                    </div>
                    <div class="pillar-rank-pill ${rank3.id}-pill">
                      <span>${rank3.name}</span>
                    </div>
                    <div class="pillar-glory-pill bronze">
                      <span class="glory-bolt">⚡</span>
                      <span>${(top3rd.glory || 0).toLocaleString('en-IN')}</span>
                      <span class="glory-lbl">GLORY</span>
                    </div>
                  </div>
                  <span class="platform-rank-num">3</span>
                </div>
              </div>
              ` : '<div class="architectural-pillar pillar-empty"></div>'}

            </div>
            <!-- Shared base slab connecting the 3 pillars -->
            <div class="podium-shared-base"></div>
          </div>

          <!-- Right Character: Zygo with Cigar/Lighter, BESIDE the ladders -->
          <div class="side-character-right" aria-hidden="true"></div>
        </div>
      `;
    }

    // Filter Tabs HTML
    const filterTabsHtml = `
      <div class="glory-filter-bar">
        <button type="button" class="glory-filter-tab ${activeFilter === 'all' ? 'active' : ''}" onclick="filterSupporters('all', this)">
          <svg width="15" height="13" viewBox="0 0 24 20" fill="currentColor">
            <path d="M2 17L4 5L8.5 10L12 3L15.5 10L20 5L22 17H2Z"/>
          </svg>
          <span>All Supporters</span>
        </button>
        <button type="button" class="glory-filter-tab ${activeFilter === 'elite' ? 'active' : ''}" onclick="filterSupporters('elite', this)">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#ff7b25"><path d="M12 2L2 9l10 13 10-13-10-7z"/></svg>
          <span>Elite</span>
        </button>
        <button type="button" class="glory-filter-tab ${activeFilter === 'warlord' ? 'active' : ''}" onclick="filterSupporters('warlord', this)">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#38bdf8"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <span>Warlord</span>
        </button>
        <button type="button" class="glory-filter-tab ${activeFilter === 'apex' ? 'active' : ''}" onclick="filterSupporters('apex', this)">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#ffd700"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          <span>Apex</span>
        </button>
        <button type="button" class="glory-filter-tab ${activeFilter === 'emperor' ? 'active' : ''}" onclick="filterSupporters('emperor', this)">
          <svg width="13" height="13" viewBox="0 0 24 20" fill="#e879f9"><path d="M2 17L4 5L8.5 10L12 3L15.5 10L20 5L22 17H2Z"/></svg>
          <span>Emperor</span>
        </button>
      </div>
    `;

    // Ranking Table Rows HTML
    let rowsHtml = "";
    if (filteredSupporters.length > 0) {
      rowsHtml = filteredSupporters.map((supporter, idx) => {
        const pos = idx + 1;
        const rank = SUPPORTER_RANKS[supporter.rank] || SUPPORTER_RANKS.elite;
        const formattedGlory = (supporter.glory || 0).toLocaleString('en-IN');
        const isTop1 = pos === 1;
        const isTop2 = pos === 2;
        const isTop3 = pos === 3;
        const topRowClass = isTop1 ? "row-top-1" : isTop2 ? "row-top-2" : isTop3 ? "row-top-3" : "";

        let posBadge = `<span class="pos-num-text">${pos}</span>`;
        if (isTop1) {
          posBadge = `<div class="pos-medal-wrap medal-gold">
            <svg class="pos-wreath-svg left" width="13" height="20" viewBox="0 0 16 26" fill="currentColor">
              <path d="M14 24 C 6 20 2 12 4 2 C 5 7 9 12 14 14 C 11 11 12 6 15 4 C 13 8 13 13 14 18 Z" opacity="0.9"/>
              <circle cx="4" cy="5" r="1.8"/>
              <circle cx="2" cy="11" r="1.8"/>
              <circle cx="4" cy="17" r="1.8"/>
              <circle cx="8" cy="22" r="1.8"/>
            </svg>
            <span class="pos-num-val">1</span>
            <svg class="pos-wreath-svg right" width="13" height="20" viewBox="0 0 16 26" fill="currentColor" style="transform: scaleX(-1);">
              <path d="M14 24 C 6 20 2 12 4 2 C 5 7 9 12 14 14 C 11 11 12 6 15 4 C 13 8 13 13 14 18 Z" opacity="0.9"/>
              <circle cx="4" cy="5" r="1.8"/>
              <circle cx="2" cy="11" r="1.8"/>
              <circle cx="4" cy="17" r="1.8"/>
              <circle cx="8" cy="22" r="1.8"/>
            </svg>
          </div>`;
        } else if (isTop2) {
          posBadge = `<div class="pos-medal-wrap medal-silver">
            <svg class="pos-wreath-svg left" width="13" height="20" viewBox="0 0 16 26" fill="currentColor">
              <path d="M14 24 C 6 20 2 12 4 2 C 5 7 9 12 14 14 C 11 11 12 6 15 4 C 13 8 13 13 14 18 Z" opacity="0.9"/>
              <circle cx="4" cy="5" r="1.8"/>
              <circle cx="2" cy="11" r="1.8"/>
              <circle cx="4" cy="17" r="1.8"/>
              <circle cx="8" cy="22" r="1.8"/>
            </svg>
            <span class="pos-num-val">2</span>
            <svg class="pos-wreath-svg right" width="13" height="20" viewBox="0 0 16 26" fill="currentColor" style="transform: scaleX(-1);">
              <path d="M14 24 C 6 20 2 12 4 2 C 5 7 9 12 14 14 C 11 11 12 6 15 4 C 13 8 13 13 14 18 Z" opacity="0.9"/>
              <circle cx="4" cy="5" r="1.8"/>
              <circle cx="2" cy="11" r="1.8"/>
              <circle cx="4" cy="17" r="1.8"/>
              <circle cx="8" cy="22" r="1.8"/>
            </svg>
          </div>`;
        } else if (isTop3) {
          posBadge = `<div class="pos-medal-wrap medal-bronze">
            <svg class="pos-wreath-svg left" width="13" height="20" viewBox="0 0 16 26" fill="currentColor">
              <path d="M14 24 C 6 20 2 12 4 2 C 5 7 9 12 14 14 C 11 11 12 6 15 4 C 13 8 13 13 14 18 Z" opacity="0.9"/>
              <circle cx="4" cy="5" r="1.8"/>
              <circle cx="2" cy="11" r="1.8"/>
              <circle cx="4" cy="17" r="1.8"/>
              <circle cx="8" cy="22" r="1.8"/>
            </svg>
            <span class="pos-num-val">3</span>
            <svg class="pos-wreath-svg right" width="13" height="20" viewBox="0 0 16 26" fill="currentColor" style="transform: scaleX(-1);">
              <path d="M14 24 C 6 20 2 12 4 2 C 5 7 9 12 14 14 C 11 11 12 6 15 4 C 13 8 13 13 14 18 Z" opacity="0.9"/>
              <circle cx="4" cy="5" r="1.8"/>
              <circle cx="2" cy="11" r="1.8"/>
              <circle cx="4" cy="17" r="1.8"/>
              <circle cx="8" cy="22" r="1.8"/>
            </svg>
          </div>`;
        }

        return `
          <div class="glory-table-row ${topRowClass}">
            <div class="row-cell cell-pos">
              ${posBadge}
            </div>
            <div class="row-cell cell-supporter">
              <div class="table-avatar-wrap">
                <img src="${getSupporterAvatar(supporter)}" alt="${escapeHtml(supporter.name)}" class="table-avatar-img">
              </div>
              <div class="table-supporter-meta">
                <div class="table-name-line">
                  <span class="table-supporter-name">${escapeHtml(supporter.name)}</span>
                  ${supporter.isSimulated ? '<span class="community-sample-pill" title="Sample Community Profile">Community</span>' : ''}
                  ${supporter.verified ? `
                    <svg class="verified-ico-mini" width="13" height="13" viewBox="0 0 24 24" fill="#a855f7">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  ` : ''}
                </div>
                ${(!supporter.isSimulated && supporter.faction) ? `<span class="table-faction-lbl">${escapeHtml(supporter.faction)}</span>` : ''}
              </div>
            </div>
            <div class="row-cell cell-rank">
              <span class="table-rank-pill ${rank.id}-pill">
                <img src="${rank.image}" alt="${rank.name}" class="table-pill-crest">
                <span>${rank.name}</span>
              </span>
            </div>
            <div class="row-cell cell-glory">
              <span class="table-glory-bolt">⚡</span>
              <span class="table-glory-value">${formattedGlory}</span>
              <span class="table-glory-sub">GLORY</span>
            </div>
          </div>
        `;
      }).join('');
    } else {
      rowsHtml = `
        <div class="glory-table-empty">
          <i class="fa-solid fa-trophy" style="font-size: 2rem; color: rgba(255, 255, 255, 0.2); margin-bottom: 0.5rem;"></i>
          <p>No supporters found in this tier yet.</p>
        </div>
      `;
    }

    const tableHtml = `
      <div class="glory-table-wrap">
        <div class="glory-table-head">
          <div class="head-cell cell-pos">#</div>
          <div class="head-cell cell-supporter">Supporter</div>
          <div class="head-cell cell-rank">Rank</div>
          <div class="head-cell cell-glory">Total Glory</div>
        </div>
        <div class="glory-table-body">
          ${rowsHtml}
        </div>
      </div>
      
    `;

    container.innerHTML = `
      <div class="glory-leaderboard-inner">
        ${podiumHtml}
        ${filterTabsHtml}
        ${tableHtml}
      </div>
    `;
  }


  // ==========================================================================
  // FETCH & SYNC SUPPORTERS (FIRESTORE + SEED FALLBACK)
  // ==========================================================================
  window.loadSupportersFromDatabase = function() {
    if (typeof firebase !== "undefined" && firebase.firestore) {
      const db = firebase.firestore();
      db.collection("supporters")
        .orderBy("glory", "desc")
        .limit(1000)
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

          // Real supporters from database + default real seeds
          const realList = [...list];
          DEFAULT_SUPPORTERS.forEach(seed => {
            if (!realList.find(item => item.id === seed.id || item.name.toLowerCase() === seed.name.toLowerCase())) {
              realList.push({ ...seed, isReal: true });
            }
          });

          // Merge with simulated community profiles via priority & proximity replacement
          supportersData = getMergedSupporters(realList);
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
    let realList = [];
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          realList = parsed.map(p => ({ ...p, isReal: true }));
        }
      } catch (e) {
        realList = [];
      }
    }
    DEFAULT_SUPPORTERS.forEach(seed => {
      if (!realList.find(item => item.id === seed.id || item.name.toLowerCase() === seed.name.toLowerCase())) {
        realList.push({ ...seed, isReal: true });
      }
    });
    supportersData = getMergedSupporters(realList);
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
    activeFilter = rankKey || "all";
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

    const msgInput = document.getElementById("supporter-message-input");
    const wordCountEl = document.getElementById("supporter-msg-word-count");
    if (msgInput) {
      const updateWordCount = () => {
        const text = msgInput.value.trim();
        const words = text ? text.split(/\s+/).filter(Boolean) : [];
        if (words.length > 300) {
          const trimmed = words.slice(0, 300).join(" ");
          msgInput.value = trimmed;
          if (wordCountEl) {
            wordCountEl.textContent = "300 / 300 words (Max reached)";
            wordCountEl.style.color = "#ff4444";
          }
        } else {
          if (wordCountEl) {
            wordCountEl.textContent = `${words.length} / 300 words`;
            wordCountEl.style.color = words.length >= 280 ? "#ffaa00" : "var(--text-muted)";
          }
        }
      };
      msgInput.addEventListener("input", updateWordCount);
      msgInput.addEventListener("keyup", updateWordCount);
      msgInput.addEventListener("change", updateWordCount);
      msgInput.addEventListener("paste", () => setTimeout(updateWordCount, 50));
    }
  }

  window.openSupporterModal = function(rankId) {
    currentSelectedRank = rankId || "elite";
    const rank = SUPPORTER_RANKS[currentSelectedRank] || SUPPORTER_RANKS.elite;
    const modal = document.getElementById("supporter-modal");
    if (!modal) return;

    // Set modal details
    const crestEl = document.getElementById("modal-crest-img");
    if (crestEl) crestEl.src = rank.image;
    const nameEl = document.getElementById("modal-rank-name");
    if (nameEl) {
      nameEl.textContent = rank.name;
      nameEl.style.color = rank.color;
    }
    const titleEl = document.getElementById("modal-rank-title");
    if (titleEl) titleEl.textContent = rank.title;
    const priceEl = document.getElementById("modal-base-price");
    if (priceEl) priceEl.textContent = `Base Plan: ₹${rank.price}`;

    // Account status inside modal if present
    const accountText = document.getElementById("modal-account-text");
    const authLink = document.getElementById("modal-auth-toggle-link");
    if (currentUser) {
      if (accountText) accountText.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#00ff88;"></i> Linked as <strong>${escapeHtml(currentUser.displayName || currentUser.email)}</strong>`;
      if (authLink) authLink.style.display = "none";
    } else {
      if (accountText) accountText.innerHTML = `<i class="fa-solid fa-user-lock"></i> Guest claim (optional account link)`;
      if (authLink) {
        authLink.style.display = "inline-block";
        authLink.textContent = "Sign In";
      }
    }

    // Pre-fill user profile fields
    const nameInput = document.getElementById("supporter-name-input");
    const emailInput = document.getElementById("supporter-email-input");
    if (currentUser) {
      if (nameInput && !nameInput.value) nameInput.value = currentUser.displayName || (currentUser.email ? currentUser.email.split("@")[0] : "");
      if (emailInput && !emailInput.value) emailInput.value = currentUser.email || "";
    }

    const amountInput = document.getElementById("supporter-amount-input");
    if (amountInput) {
      amountInput.min = rank.price;
      amountInput.value = rank.price;
    }

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

  // Keyboard Escape Handler
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeSupporterModal();
      closeAuthModal();
    }
  });

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
    const rank = SUPPORTER_RANKS[currentSelectedRank] || SUPPORTER_RANKS.elite;
    const name = document.getElementById("supporter-name-input").value.trim();
    const email = document.getElementById("supporter-email-input").value.trim();
    const faction = document.getElementById("supporter-faction-input").value.trim() || "Independent Faction";
    const message = document.getElementById("supporter-message-input").value.trim();
    const msgWords = message ? message.split(/\s+/).filter(Boolean) : [];
    if (msgWords.length > 300) {
      alert(`Your message exceeds the 300-word limit (${msgWords.length}/300 words). Please shorten your message.`);
      return;
    }
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
          userId: currentUser ? currentUser.uid : ("usr_" + Date.now().toString(36)),
          userEmail: currentUser ? currentUser.email : email,
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
    if (currentSelectedRank !== "elite") return;

    const name = document.getElementById("supporter-name-input").value.trim();
    const email = document.getElementById("supporter-email-input").value.trim() || (currentUser ? currentUser.email : "supporter@blueshot.online");
    const faction = document.getElementById("supporter-faction-input").value.trim() || "Detective NJ Squad";
    const message = document.getElementById("supporter-message-input").value.trim() || "Redeemed with $10,000 Detective NJ bounty cash!";
    const loreMsgWords = message ? message.split(/\s+/).filter(Boolean) : [];
    if (loreMsgWords.length > 300) {
      alert(`Your message exceeds the 300-word limit (${loreMsgWords.length}/300 words). Please shorten your message.`);
      return;
    }

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
      userId: currentUser ? currentUser.uid : ("usr_" + Date.now().toString(36)),
      userEmail: currentUser ? currentUser.email : email,
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
