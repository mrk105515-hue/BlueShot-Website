// ==========================================================================
// DXZ DETECTIVE NJ MYSTERY LORE GAME ENGINE (mystery.js)
// ==========================================================================

const DXZ_MYSTERIES = [
  {
    id: 1,
    caseNumber: "CASE #01",
    location: "CRIME SCENE: FLAMA NATION",
    title: "Who Started the Flama Nation Attack?",
    reward: 100,
    speaker: "Detective NJ",
    dialogue: "I was drinking tea at the cyber cafe when emergency sirens started blaring: Flama Nation suffered a catastrophic surprise attack! Reports state 10,000 shadow assassins, the Curse God, Bezrk, and giant monster Dahaka were involved. Who orchestrated this?",
    clueTitle: "Intelligence Dossier: Flama Nation War",
    clueText: "Archival records reveal that the mastermind orchestrated a multi-front invasion with 10,000 syndicate assassins and struck a 5 billion cash deal with Bezrk to destabilize the nation.",
    clueLinkText: "Inspect World Order Lore",
    clueLinkUrl: "universe-lore.html",
    question: "Who was responsible for orchestrating the Flama Nation attack plan?",
    options: [
      { text: "Hell's Plan", isCorrect: false },
      { text: "Zygo's Plan", isCorrect: true },
      { text: "A Mysterious Man", isCorrect: false }
    ],
    truth: "Correct! It was Zygo's overarching strategy that triggered the cascading events leading to the Flama Nation confrontation."
  },
  {
    id: 2,
    caseNumber: "CASE #02",
    location: "CASE ARCHIVE: THE BROKEN DUO",
    title: "Why Is Hell Doing Such Destruction?",
    reward: 100,
    speaker: "Detective NJ",
    dialogue: "Sitting across from me, you must wonder: Hell and Zygo were once like brothers—an unstoppable duo greater than the Century Legend himself. Why did they become bitter mortal enemies?",
    clueTitle: "Historical Records: Zygo & Hell's Past",
    clueText: "Zygo Degan and Hell lived peacefully for years. But without explanation, Zygo killed Hell's beloved fiancée, Tressa Forst, and even executed the father of his own wife, Koyo. Those unexplained actions turned Hell into a vengeful conqueror.",
    clueLinkText: "View Emperor Hell's Dossier",
    clueLinkUrl: "char-hell.html",
    question: "What tragic event shattered the brotherhood between Hell and Zygo?",
    options: [
      { text: "Zygo killed Hell's fiancée Tressa Forst & Koyo's father", isCorrect: true },
      { text: "Hell went psycho for no reason", isCorrect: false },
      { text: "A dispute over stolen gold", isCorrect: false }
    ],
    truth: "Exactly! Zygo's shocking execution of Tressa Forst and Koyo's father shattered their bond and sparked a multi-decade vendetta."
  },
  {
    id: 3,
    caseNumber: "CASE #03",
    location: "CLASSIFIED: 18 YEARS AGO",
    title: "The 5-Year-Old Boy & The Midnight Fire",
    reward: 150,
    speaker: "Detective NJ",
    dialogue: "I've pulled a sealed file from 18 years ago. A 5-year-old boy named BSG was running terrified through a village. A kind woman named Masa gave him medicine, food, and sang him a lullaby. But at midnight, the nightmare began...",
    clueTitle: "Tragic Memories: Village Massacre",
    clueText: "Mysterious men set the entire village on fire. They brought out Masa and placed an axe in young BSG's trembling hands, forcing him into an impossible choice: execute Masa or watch everyone die. Masa smiled and told him to do it, breaking his heart forever.",
    clueLinkText: "View BSG's Dossier",
    clueLinkUrl: "char-bsg.html",
    question: "What cruel dilemma did the mysterious villains force upon young BSG?",
    options: [
      { text: "Forced him to execute his caretaker Masa with an axe", isCorrect: true },
      { text: "Surrender his legendary armor", isCorrect: false },
      { text: "Abandon the village and run away", isCorrect: false }
    ],
    truth: "Heartbreaking truth. Young BSG was forced into executing Masa, leaving him deeply traumatized as the villains slaughtered the villagers anyway."
  },
  {
    id: 4,
    caseNumber: "CASE #04",
    location: "BLOODLINE ARCHIVES",
    title: "The Son of the Century Legend",
    reward: 150,
    speaker: "Detective NJ",
    dialogue: "Why did evil forces relentlessly hunt young BSG across 10 destroyed villages, executing 30+ of his loved ones like Oro and Masa? What was hidden inside that child?",
    clueTitle: "Bloodline File: Rezok & Redago",
    clueText: "BSG is the biological son of Century Legend Rezok! He carries the limitless, dormant celestial force of Redago in his DNA. When Rezok and BSG's mother were killed in war, dark forces hunted the boy to control his celestial power.",
    clueLinkText: "Read Universe Lore",
    clueLinkUrl: "universe-lore.html",
    question: "Who is BSG's biological father and what dormant power does he carry?",
    options: [
      { text: "Century Legend Rezok & Limitless Redago force", isCorrect: true },
      { text: "Emperor Hell & Cursed Flame", isCorrect: false },
      { text: "Doctor Black Dagger & Lightning Arts", isCorrect: false }
    ],
    truth: "Correct! BSG is the true biological son of Rezok and the sole carrier of the primordial Redago celestial force."
  },
  {
    id: 5,
    caseNumber: "CASE #05",
    location: "PSYCHOLOGICAL INVESTIGATION",
    title: "The 18-Year Mask of Hatred",
    reward: 200,
    speaker: "Detective NJ",
    dialogue: "For 18 years, BSG lived a hardened life. He started robbing villagers and forcing people to despise him. Why would a traumatized boy intentionally make everyone hate him?",
    clueTitle: "Psychological Profile: BSG's Burden",
    clueText: "BSG believed he was a cursed boy—every time he cared for people, dark devils arrived and slaughtered them. To protect innocent people from becoming targets, he intentionally made them hate him so no one would ever grow close.",
    clueLinkText: "View BSG Profile",
    clueLinkUrl: "char-bsg.html",
    question: "Why did BSG intentionally force villagers to hate him?",
    options: [
      { text: "To prevent people from getting close and dying", isCorrect: true },
      { text: "To amass stolen fortune", isCorrect: false },
      { text: "Because he enjoyed being a thief", isCorrect: false }
    ],
    truth: "A tragic protective mechanism! BSG bore the burden of hatred so no innocent person would die because of him."
  },
  {
    id: 6,
    caseNumber: "CASE #06",
    location: "SYNDICATE DOSSIER",
    title: "The 150-Year-Old Scientist",
    reward: 200,
    speaker: "Detective NJ",
    dialogue: "In Episode 1, BSG met an innocent-looking scientist named Doctor Black Dagger in the forest. He seemed like a weak human mentor... but my investigation reveals a terrifying secret!",
    clueTitle: "Syndicate File: Black Dagger Scinto",
    clueText: "Doctor Black Dagger (Scinto) is an ancient mastermind over 150 years old. He pretended to be an innocent scientist to secretly observe and eventually steal BSG's limitless Redago power!",
    clueLinkText: "View Black Dagger Dossier",
    clueLinkUrl: "char-blackdagger.html",
    question: "What was Doctor Black Dagger (Scinto's) secret identity and true goal?",
    options: [
      { text: "A 150-year-old mastermind seeking to steal Redago from BSG", isCorrect: true },
      { text: "A regular herbal doctor", isCorrect: false },
      { text: "An imperial envoy from the South", isCorrect: false }
    ],
    truth: "Spot on! Scinto is the 150-year-old mastermind behind the DXZ Syndicate who has been manipulating events from the shadows."
  },
  {
    id: 7,
    caseNumber: "CASE #07",
    location: "FORBIDDEN LAB: 40 YEARS AGO",
    title: "The Genesis of Hell",
    reward: 250,
    speaker: "Detective NJ",
    dialogue: "Forty years ago, Black Dagger searched desperately for a way to defeat Rezok. He concluded: 'The only man capable of defeating Rezok is Rezok himself.' How did he create the ultimate weapon?",
    clueTitle: "Forbidden Genetic Experiment",
    clueText: "Black Dagger obtained Rezok's blood and struck a dark pact with Devil King Cobra from another dimension. Through experimental surrogate mothers, a child destined to surpass Rezok was born: Hell!",
    clueLinkText: "View Hell's Origin",
    clueLinkUrl: "char-hell.html",
    question: "How was Hell created by Black Dagger 40 years ago?",
    options: [
      { text: "Combining Rezok's blood with Devil King Cobra's pact", isCorrect: true },
      { text: "Found inside an ancient comet", isCorrect: false },
      { text: "Trained in a secret monastery", isCorrect: false }
    ],
    truth: "Astounding deduction! Hell was artificially created using Rezok's blood and Devil King Cobra's dimensional pact."
  },
  {
    id: 8,
    caseNumber: "CASE #08",
    location: "FATE'S CRUELEST JOKE",
    title: "The Weapon Turned Student",
    reward: 250,
    speaker: "Detective NJ",
    dialogue: "For 14 years, Black Dagger tried to awaken Hell's monster power, but Hell showed no cruelty. Black Dagger abandoned him on the streets as a homeless child. What happened next?",
    clueTitle: "The Cruel Joke of Destiny",
    clueText: "Alone and broken, homeless Hell met Rezok. Instead of killing him, Rezok took Hell in, made him his student, and welcomed him as an adopted son into his inner family!",
    clueLinkText: "Read Season Guide",
    clueLinkUrl: "season-guide.html",
    question: "What happened when the abandoned weapon Hell met Rezok?",
    options: [
      { text: "He became Rezok's student and adopted son", isCorrect: true },
      { text: "Hell instantly assassinated Rezok", isCorrect: false },
      { text: "Rezok locked Hell in prison", isCorrect: false }
    ],
    truth: "Indeed! Fate turned the weapon meant to kill Rezok into Rezok's most loyal student and adopted son."
  },
  {
    id: 9,
    caseNumber: "CASE #09",
    location: "INNER CIRCLE FAMILY TREE",
    title: "Rezok's Inner Family Circle",
    reward: 300,
    speaker: "Detective NJ",
    dialogue: "In Rezok's household, love and loyalty mattered far more than blood. Who were the three children raised under Rezok and his wife Oma?",
    clueTitle: "Rezok Family Hierarchy",
    clueText: "Rezok and Oma raised three children: biological son BSG, adopted daughter Toko, and adopted son Hell. Hell and Toko grew up together and fell deeply in love.",
    clueLinkText: "View Character Codex",
    clueLinkUrl: "characters.html",
    question: "Who were the three children raised in Rezok's household?",
    options: [
      { text: "BSG (Biological), Toko (Adopted), and Hell (Adopted)", isCorrect: true },
      { text: "Berry, Suma, and Zalta", isCorrect: false },
      { text: "Kan, Scinto, and Eysa", isCorrect: false }
    ],
    truth: "Precisely! BSG, Toko, and Hell grew up as siblings in Rezok's legendary family."
  },
  {
    id: 10,
    caseNumber: "CASE #10",
    location: "THE HEROBRINE CLAN",
    title: "The Truth of Zalta's Bloodline",
    reward: 300,
    speaker: "Detective NJ",
    dialogue: "Zalta saw his father Zabong's corpse 25 years ago and swore vengeance against Rezok. But after meeting BSG in Westo City, everything changed. What did Zalta discover?",
    clueTitle: "Zalta's Revelation",
    clueText: "Zalta discovered that his father Zabong was killed because of corrupt deeds, and Emperor Hell had been manipulating him with lies for 25 years. Realizing the truth, Zalta joined BSG!",
    clueLinkText: "View Curse God Zalta Dossier",
    clueLinkUrl: "char-zalta.html",
    question: "What truth caused Zalta to ally with BSG?",
    options: [
      { text: "He discovered Emperor Hell had lied to and manipulated him for 25 years", isCorrect: true },
      { text: "He was paid 10 million in gold", isCorrect: false },
      { text: "He lost a duel and was forced into slavery", isCorrect: false }
    ],
    truth: "Correct! Zalta learned Hell used him as a pawn, leading him to fight alongside BSG."
  },
  {
    id: 11,
    caseNumber: "CASE #11",
    location: "EPISODE 24 INCIDENT",
    title: "The Awakening of the Curse God",
    reward: 350,
    speaker: "Detective NJ",
    dialogue: "Episode 24 marks a terrifying turning point in DXZ history: an ancient entity trapped in Hell for 7,999 years was unleashed through Zalta's bloodline. Who performed this ritual?",
    clueTitle: "The Devil Priest Ritual",
    clueText: "Zalta belongs to the ancient Herobrine bloodline. Only a Devil Priest could awaken the Curse God trapped for 7,999 years. In Episode 24, Devil Priest Kraven completed the ritual!",
    clueLinkText: "Read Season 3 Breakdown",
    clueLinkUrl: "season-guide.html",
    question: "Who awakened the Curse God through Zalta in Episode 24?",
    options: [
      { text: "Devil Priest Kraven", isCorrect: true },
      { text: "Emperor Jiggo Degan", isCorrect: false },
      { text: "Doctor Black Dagger", isCorrect: false }
    ],
    truth: "Correct! Kraven the Devil Priest broke the 7,999-year seal to awaken the Curse God."
  },
  {
    id: 12,
    caseNumber: "CASE #12",
    location: "SPECIAL WEAPONS DIVISION",
    title: "The Assassin Who Never Smiles",
    reward: 350,
    speaker: "Detective NJ",
    dialogue: "Kan is an assassin who lost one eye long ago and never smiles. His weapons look like ordinary writing pens, but they are deadly instruments. What do they do?",
    clueTitle: "Kan's Combat Arsenal",
    clueText: "Kan uses only two types of pens in battle: Blue Pens allow instant spatial teleportation, while Red Pens detonate high-yield explosive blasts.",
    clueLinkText: "View Kan's Dossier",
    clueLinkUrl: "char-kan.html",
    question: "What are the exact functions of Kan's Blue and Red pens?",
    options: [
      { text: "Blue Pens = Teleportation, Red Pens = Explosives", isCorrect: true },
      { text: "Blue Pens = Forcefields, Red Pens = Poison", isCorrect: false },
      { text: "Blue Pens = Mind Control, Red Pens = Lasers", isCorrect: false }
    ],
    truth: "Spot on! Blue pens for teleportation and Red pens for explosives—Kan's signature tactical style."
  },
  {
    id: 13,
    caseNumber: "CASE #13",
    location: "TACTICAL INTELLIGENCE",
    title: "Suma's Tectonic Weak Point",
    reward: 400,
    speaker: "Detective NJ",
    dialogue: "Suma is an unpredictable leader whose greatest weapon is her brain. But in physical combat, she possesses a terrifying ground-shaking ability. What is it called?",
    clueTitle: "Suma's Unique Ability",
    clueText: "Suma's unique power is called 'Weak Point'. By touching stress fracture points beneath the ground, she can shake tectonic plates, create earthquakes, and trigger subterranean explosions.",
    clueLinkText: "View Suma's Dossier",
    clueLinkUrl: "char-suma.html",
    question: "What is Suma's signature ground-shattering ability?",
    options: [
      { text: "Weak Point (earthquakes and underground explosions)", isCorrect: true },
      { text: "Meteor Strike", isCorrect: false },
      { text: "Sonic Wave", isCorrect: false }
    ],
    truth: "Excellent deduction! Suma uses 'Weak Point' to manipulate tectonic plates with surgical precision."
  },
  {
    id: 14,
    caseNumber: "CASE #14",
    location: "THE GAMBLER'S CRISIS",
    title: "The Gambler with the World's Strongest Blade",
    reward: 400,
    speaker: "Detective NJ",
    dialogue: "Berry Cade has extreme speed, loves to gamble, and fought the Curse God just for fun. What is the name of the world's most powerful sword in his hands?",
    clueTitle: "Legendary Weapon: Ogre",
    clueText: "Berry Cade wields the world's most powerful heavy sword: 'Ogre'. Following his reckless duel against the Curse God, Berry is currently fighting for his life in a critical crisis.",
    clueLinkText: "View Berry Cade's Dossier",
    clueLinkUrl: "char-berry.html",
    question: "What is the name of Berry Cade's world-cleaving greatsword?",
    options: [
      { text: "Ogre", isCorrect: true },
      { text: "Dragon Slayer", isCorrect: false },
      { text: "Fate Eraser", isCorrect: false }
    ],
    truth: "Correct! The legendary greatsword 'Ogre' is Berry Cade's iconic weapon."
  },
  {
    id: 15,
    caseNumber: "CASE #15",
    location: "DEVIL PRIEST CLAN",
    title: "The Sister of the Devil Priest",
    reward: 450,
    speaker: "Detective NJ",
    dialogue: "Eysa recently joined the alliance. She has never known true happiness and carries a terrifying past as one of the last two survivors of her clan. What is her secret power?",
    clueTitle: "Eysa's Mystical Authority",
    clueText: "Eysa is Kraven's sister. Her unique ability allows her to possess people's minds for a few seconds with her voice, and her sacred mantra can even seal the Curse God!",
    clueLinkText: "View Eysa's Dossier",
    clueLinkUrl: "char-eysa.html",
    question: "What is Eysa's relationship to Kraven and what can her mantra do?",
    options: [
      { text: "Kraven's sister; possesses minds and can seal the Curse God", isCorrect: true },
      { text: "Hell's general; commands the dragon army", isCorrect: false },
      { text: "Suma's student; heals wounds", isCorrect: false }
    ],
    truth: "Spot on! Eysa is Kraven's sister with the rare ability to command minds and seal the Curse God."
  },
  {
    id: 16,
    caseNumber: "CASE #16",
    location: "ALLIANCE VANGUARD",
    title: "The Enforcers Known as The Three Shades",
    reward: 450,
    speaker: "Detective NJ",
    dialogue: "Kan has brought old friends into the coalition: Shane, Gain, and Fin, known as The Three Shades. Which of them is a multi-talented fighter who plays guitar?",
    clueTitle: "The Three Shades Profile",
    clueText: "Shane is the Gunman, Gain has monster-like strength, and Fin is the multi-talented fighter with countless skills including guitar, capable of killing with almost anything.",
    clueLinkText: "Read Character Roster",
    clueLinkUrl: "characters.html",
    question: "Which member of The Three Shades is a guitarist and multi-talented combatant?",
    options: [
      { text: "Fin", isCorrect: true },
      { text: "Shane", isCorrect: false },
      { text: "Gain", isCorrect: false }
    ],
    truth: "Correct! Fin is the guitarist and multi-talented operative in The Three Shades."
  },
  {
    id: 17,
    caseNumber: "CASE #17",
    location: "PLANETARY GOVERNANCE",
    title: "The World Order of Five",
    reward: 500,
    speaker: "Detective NJ",
    dialogue: "Earth is governed by Four Sovereign Emperors: Zigo Degan (East), Ice King (North), Marcle (South), and Hell (West). But who rules above all four as the supreme Earth King?",
    clueTitle: "The Supreme Sovereign",
    clueText: "The World Order places four emperors across the quadrants, with Eric (The Earth King) sitting above them all as the supreme central authority.",
    clueLinkText: "View Universe Lore",
    clueLinkUrl: "universe-lore.html",
    question: "Who is the Earth King ruling above all Four Emperors?",
    options: [
      { text: "Eric (Earth King)", isCorrect: true },
      { text: "Century Legend Rezok", isCorrect: false },
      { text: "Doctor Black Dagger", isCorrect: false }
    ],
    truth: "Precisely! Eric is the supreme Earth King presiding above the four sovereign rulers."
  },
  {
    id: 18,
    caseNumber: "CASE #18",
    location: "THE STRATEGIST OF AN ERA",
    title: "The Grandpa Figure & Mastermind Strategist",
    reward: 500,
    speaker: "Detective NJ",
    dialogue: "Our final case closes on Rezok's Inner Circle. Alongside Rezok, Zabong, Zygo, Hell, and Koyo, who was the revered grandpa figure known as 'The Genius Strategist'?",
    clueTitle: "The Six Who Ruled An Era",
    clueText: "Bordo served as the chief strategist and grandpa figure of Rezok's family, orchestrating the legendary battle formations that secured their era.",
    clueLinkText: "Review Final Chronicles",
    clueLinkUrl: "characters.html",
    question: "Who was the Chief Strategist and grandpa figure of Rezok's inner circle?",
    options: [
      { text: "Bordo ('The Genius Strategist')", isCorrect: true },
      { text: "Scinto", isCorrect: false },
      { text: "Kraven", isCorrect: false }
    ],
    truth: "Master Detective! Bordo was the legendary Chief Strategist whose tactical genius guided the era."
  }
];

// ==========================================================================
// STATE ENGINE & PERSISTENCE
// ==========================================================================
const SAVE_KEY = "dxz_mystery_game_save_v1";

let gameState = {
  activeCaseIndex: 0,
  solvedCases: [],
  playerCash: 0
};

function loadGameState() {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      gameState = { ...gameState, ...parsed };
    }
  } catch (e) {
    console.warn("Could not load mystery save:", e);
  }
}

function saveGameState() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
  } catch (e) {
    console.warn("Could not save mystery state:", e);
  }
}

// ==========================================================================
// UI RENDERING ENGINE
// ==========================================================================
function initMysteryGame() {
  loadGameState();
  renderHUD();
  renderActiveMystery();
  renderCaseArchives();
  setupClueModal();
}

function renderHUD() {
  const cashEl = document.getElementById("player-cash-val");
  const solvedCountEl = document.getElementById("solved-count-val");
  const totalCountEl = document.getElementById("total-count-val");
  const progressFill = document.getElementById("hud-progress-fill");

  const total = DXZ_MYSTERIES.length;
  const solved = gameState.solvedCases.length;
  const percentage = Math.round((solved / total) * 100);

  if (cashEl) cashEl.textContent = `$${gameState.playerCash.toLocaleString()}`;
  if (solvedCountEl) solvedCountEl.textContent = solved;
  if (totalCountEl) totalCountEl.textContent = total;
  if (progressFill) progressFill.style.width = `${percentage}%`;
}

function renderActiveMystery() {
  const current = DXZ_MYSTERIES[gameState.activeCaseIndex];
  if (!current) return;

  const card = document.getElementById("active-mystery-card");
  if (!card) return;

  const isSolved = gameState.solvedCases.includes(current.id);

  card.innerHTML = `
    <div class="mystery-header-row">
      <span class="mystery-case-badge"><i class="fa-solid fa-folder-open"></i> ${current.caseNumber} &bull; ${current.location}</span>
      <span class="mystery-reward-badge"><i class="fa-solid fa-coins"></i> BOUNTY: +$${current.reward}</span>
    </div>

    <h2 class="mystery-title">${current.title}</h2>

    <!-- CAFE DIALOGUE BOX -->
    <div class="cafe-dialogue-box">
      <div class="cafe-icon"><i class="fa-solid fa-mug-hot"></i></div>
      <div>
        <span class="cafe-speaker">${current.speaker} (At the Cafe Table)</span>
        <p class="cafe-text">"${current.dialogue}"</p>
      </div>
    </div>

    <!-- CLUE INSPECTION TRIGGER -->
    <div class="clue-trigger-wrap">
      <button class="btn-clue" id="open-clue-btn" onclick="openClueModal()">
        <i class="fa-solid fa-magnifying-glass"></i> Inspect Detective Clues
      </button>
    </div>

    <!-- MULTIPLE CHOICE QUESTION -->
    <div class="mystery-question-box">
      <h3 class="mystery-question-title"><i class="fa-solid fa-circle-question" style="color: var(--color-blue-neon);"></i> ${current.question}</h3>
      <div class="mystery-options-grid">
        ${current.options.map((opt, idx) => {
          const letter = String.fromCharCode(65 + idx); // A, B, C
          return `
            <button class="mystery-option-btn" data-index="${idx}" onclick="handleOptionSelect(${idx})" ${isSolved ? 'disabled' : ''}>
              <span class="option-letter">${letter}</span>
              <span class="option-text">${opt.text}</span>
            </button>
          `;
        }).join('')}
      </div>
    </div>

    <!-- FEEDBACK & NEXT UNLOCK BANNER -->
    <div class="mystery-feedback-card ${isSolved ? 'success' : ''}" id="mystery-feedback">
      ${isSolved ? `
        <div class="feedback-header"><i class="fa-solid fa-circle-check"></i> MYSTERY SOLVED!</div>
        <p class="feedback-body">${current.truth}</p>
        ${gameState.activeCaseIndex < DXZ_MYSTERIES.length - 1 ? `
          <button class="btn-next-mystery" onclick="goToNextMystery()">
            Proceed to Next Mystery <i class="fa-solid fa-arrow-right"></i>
          </button>
        ` : `
          <div style="font-weight: 800; color: #ffb703; font-size: 1.1rem;"><i class="fa-solid fa-trophy"></i> CONGRATULATIONS! ALL 18 DXZ MYSTERIES SOLVED!</div>
        `}
      ` : ''}
    </div>
  `;
}

function handleOptionSelect(optionIndex) {
  const current = DXZ_MYSTERIES[gameState.activeCaseIndex];
  if (!current) return;

  const buttons = document.querySelectorAll(".mystery-option-btn");
  const selectedBtn = buttons[optionIndex];
  const feedbackCard = document.getElementById("mystery-feedback");

  const isCorrect = current.options[optionIndex].isCorrect;

  if (isCorrect) {
    // Mark Correct
    selectedBtn.classList.add("correct");
    buttons.forEach(b => b.disabled = true);

    // Update state if not already solved
    if (!gameState.solvedCases.includes(current.id)) {
      gameState.solvedCases.push(current.id);
      gameState.playerCash += current.reward;
      saveGameState();
      renderHUD();
      renderCaseArchives();
    }

    // Show Success UI
    feedbackCard.className = "mystery-feedback-card success";
    feedbackCard.innerHTML = `
      <div class="feedback-header"><i class="fa-solid fa-circle-check"></i> DEDUCTION VERIFIED! +$${current.reward}</div>
      <p class="feedback-body">${current.truth}</p>
      ${gameState.activeCaseIndex < DXZ_MYSTERIES.length - 1 ? `
        <button class="btn-next-mystery" onclick="goToNextMystery()">
          Proceed to Next Mystery <i class="fa-solid fa-arrow-right"></i>
        </button>
      ` : `
        <div style="font-weight: 800; color: #ffb703; font-size: 1.1rem;"><i class="fa-solid fa-trophy"></i> MASTER DETECTIVE! ALL 18 DXZ LORE MYSTERIES SOLVED!</div>
      `}
    `;

    // Trigger Notification
    if (typeof showNotification === "function") {
      showNotification(`Mystery Solved! Bounty: +$${current.reward}`);
    }
  } else {
    // Mark Wrong
    selectedBtn.classList.add("wrong");
    setTimeout(() => { selectedBtn.classList.remove("wrong"); }, 800);

    feedbackCard.className = "mystery-feedback-card error";
    feedbackCard.innerHTML = `
      <div class="feedback-header"><i class="fa-solid fa-circle-xmark"></i> INCORRECT DEDUCTION</div>
      <p class="feedback-body">Detective NJ suggests: "That lead doesn't match the evidence. Click 'Inspect Detective Clues' above to re-evaluate the archives, then try again!"</p>
    `;
  }
}

function goToNextMystery() {
  if (gameState.activeCaseIndex < DXZ_MYSTERIES.length - 1) {
    gameState.activeCaseIndex++;
    saveGameState();
    renderActiveMystery();
    renderCaseArchives();
    window.scrollTo({ top: document.getElementById("active-mystery-card").offsetTop - 120, behavior: "smooth" });
  }
}

function selectCase(caseIndex) {
  // Allow selecting any case up to the furthest unlocked
  const maxUnlocked = gameState.solvedCases.length;
  if (caseIndex <= maxUnlocked) {
    gameState.activeCaseIndex = caseIndex;
    renderActiveMystery();
    renderCaseArchives();
    window.scrollTo({ top: document.getElementById("active-mystery-card").offsetTop - 120, behavior: "smooth" });
  }
}

// ==========================================================================
// CASE ARCHIVES GRID
// ==========================================================================
function renderCaseArchives() {
  const container = document.getElementById("case-archive-grid");
  if (!container) return;

  const maxUnlocked = gameState.solvedCases.length;

  container.innerHTML = DXZ_MYSTERIES.map((m, idx) => {
    const isSolved = gameState.solvedCases.includes(m.id);
    const isCurrent = gameState.activeCaseIndex === idx;
    const isLocked = idx > maxUnlocked;

    return `
      <div class="case-archive-card ${isCurrent ? 'active' : ''} ${isLocked ? 'locked' : ''}" onclick="selectCase(${idx})">
        <div class="archive-card-status">
          <span style="color: var(--color-blue-neon);">${m.caseNumber}</span>
          <span>${isSolved ? '<i class="fa-solid fa-check" style="color: #2ecc71;"></i> SOLVED' : (isLocked ? '<i class="fa-solid fa-lock"></i> LOCKED' : '<i class="fa-solid fa-hourglass-start" style="color: #ffb703;"></i> ACTIVE')}</span>
        </div>
        <h4 class="archive-card-title">${m.title}</h4>
        <div style="font-size: 0.75rem; color: var(--text-muted);">Bounty: +$${m.reward}</div>
      </div>
    `;
  }).join('');
}

// ==========================================================================
// CLUES MODAL DRAWER
// ==========================================================================
function setupClueModal() {
  // Global modal handlers
}

function openClueModal() {
  const current = DXZ_MYSTERIES[gameState.activeCaseIndex];
  if (!current) return;

  const modal = document.getElementById("clue-modal");
  const modalTitle = document.getElementById("clue-modal-title-text");
  const modalBody = document.getElementById("clue-modal-body-content");

  if (!modal) return;

  modalTitle.textContent = current.clueTitle;
  modalBody.innerHTML = `
    <p style="margin-bottom: 1.25rem;">${current.clueText}</p>
    ${current.clueLinkUrl ? `
      <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: space-between;">
        <span style="font-size: 0.85rem; color: var(--text-muted);"><i class="fa-solid fa-book-bookmark"></i> External Dossier Archive</span>
        <a href="${current.clueLinkUrl}" target="_blank" style="color: var(--color-blue-neon); font-weight: 700; text-decoration: none; font-size: 0.9rem;">
          ${current.clueLinkText} <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </a>
      </div>
    ` : ''}
  `;

  modal.classList.add("active");
}

function closeClueModal() {
  const modal = document.getElementById("clue-modal");
  if (modal) modal.classList.remove("active");
}

// Initialize on Load
document.addEventListener("DOMContentLoaded", initMysteryGame);
