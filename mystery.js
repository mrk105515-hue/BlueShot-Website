/**
 * Danger X Zone (DXZ) - Detective NJ Mystery Lore Game Engine
 * Canonical dataset derived strictly from the official 12-page DXZ Lore Document.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'dxz_detective_nj_game_state_v1';

  // 18 Canonical Case Files with explicit Clue Links pointing to character & lore pages
  const MYSTERIES_DATA = [
    {
      id: 1,
      title: "Who Started the Flama Nation Attack?",
      bounty: 100,
      scene: "Detective NJ was drinking tea at his cyber cafe table when breaking news flashed across the monitors: Flama Nation got a massive surprise assault. Over 10,000 assassins, the Curse God, Bjerk, and giant monster Dahaka were deployed in a coordinated blitz.",
      clueLink: "universe-lore.html#hell-zygo",
      clueLinkText: "👉 Read the World Order & Flama Conflict Page",
      clueDetails: "According to imperial intelligence files on the World Order and Flama Nation conflict, Hell engineered this war and formed an alliance with Devil Priest Kraven to execute his long-awaited vengeance against Zygo.",
      question: "Who was the ultimate mastermind behind planning the Flama Nation attack?",
      options: [
        { label: "A", text: "Hell's Master Plan" },
        { label: "B", text: "Zygo's Plan" },
        { label: "C", text: "A Mysterious Lone Bandit" }
      ],
      correctAnswer: "A",
      explanation: "Hell spent years constructing a grand plan to destroy Zygo by orchestrating the complete devastation of Flama Nation and awakening the Curse God with Kraven."
    },
    {
      id: 2,
      title: "Why is Hell Doing Such Destruction?",
      bounty: 150,
      scene: "Professor NJ sits at his cafe table deeply pondering the files: 'Why did Hell turn from Rezok's loyal family member into the bringer of apocalyptic war? What drove him to this madness?'",
      clueLink: "universe-lore.html#hell-zygo",
      clueLinkText: "👉 Read Zygo and Hell History",
      clueDetails: "Hell and Zygo were once like brothers. But their bond shattered when Zygo unexpectedly killed Hell's beloved fiancée, Tressa Forst, and killed Koyo's father.",
      question: "What drove Emperor Hell to seek the total destruction of Zygo's realm?",
      options: [
        { label: "A", text: "Zygo killed Hell's fiancée, Tressa Forst" },
        { label: "B", text: "Hell is naturally psycho" },
        { label: "C", text: "Because Earth King Eric ordered it" }
      ],
      correctAnswer: "A",
      explanation: "Hell lived happily with his fiancée Tressa Forst until Zygo Degan inexplicably murdered her, turning the unstoppable brothers into bitter mortal enemies."
    },
    {
      id: 3,
      title: "The Tragedy of Five-Year-Old BSG",
      bounty: 250,
      scene: "Detective NJ examines a confidential dossier from BSG's early childhood. A 5-year-old boy was found trembling, running through a village where a kind woman named Masa gave him food and sang lullabies.",
      clueLink: "char-bsg.html",
      clueLinkText: "👉 Read BSG's Childhood Story",
      clueDetails: "When mysterious villains burned the village, they held an axe to 5-year-old BSG's shaking hands and forced him to make an unthinkable choice to save the others.",
      question: "What horrific act were mysterious villains forcing 5-year-old BSG to commit with an axe?",
      options: [
        { label: "A", text: "Chop down the sacred village tree" },
        { label: "B", text: "Decapitate his caretaker, Masa" },
        { label: "C", text: "Break the golden prison gates" }
      ],
      correctAnswer: "B",
      explanation: "The villains forced 5-year-old BSG to cut off Masa's head with an axe under the false promise of sparing the village, only to slaughter everyone afterward."
    },
    {
      id: 4,
      title: "Why Did BSG Rob Villagers for 18 Years?",
      bounty: 350,
      scene: "Police records across 10 destroyed villages indicate that for 18 years, BSG lived a harsh, isolated life wearing a mask and actively robbing villagers.",
      clueLink: "char-bsg.html",
      clueLinkText: "👉 Read BSG's 18-Year Mask Dossier",
      clueDetails: "Every time BSG loved someone (Masa, Oro, and 30 others), the evil forces hunting him killed them. BSG wore a mask and robbed villagers so everyone would despise him and keep their distance.",
      question: "Why did BSG intentionally wear a mask and rob villagers for 18 years?",
      options: [
        { label: "A", text: "To hoard gold for a private army" },
        { label: "B", text: "So people would hate him and stay away, keeping them safe from the devils hunting his blood" },
        { label: "C", text: "He was under Black Dagger's mind control" }
      ],
      correctAnswer: "B",
      explanation: "BSG hardened his heart and made villagers hate him so no one would befriend him, preventing the evil demons hunting his bloodline from killing more innocent people."
    },
    {
      id: 5,
      title: "The Lineage of the Redago Force",
      bounty: 500,
      scene: "Detective NJ runs genetic spectral analysis on BSG's boundless crimson aura. The power output defies all known scales in the imperial database.",
      clueLink: "char-bsg.html",
      clueLinkText: "👉 Read BSG's Bloodline Dossier",
      clueDetails: "BSG is not an orphan of unknown origin. He is the biological son of the Century Legend who ruled an era, inheriting limitless energy from his direct bloodline.",
      question: "Who is BSG's biological father from whom he inherited limitless Redago?",
      options: [
        { label: "A", text: "Century Legend Rezok" },
        { label: "B", text: "Emperor Hell" },
        { label: "C", text: "Devil King Cobra" }
      ],
      correctAnswer: "A",
      explanation: "BSG is the biological son of Century Legend Rezok and his wife Oma, carrying an inexhaustible, limitless reservoir of Redago in his veins."
    },
    {
      id: 6,
      title: "The 150-Year Impostor",
      bounty: 500,
      scene: "A seemingly innocent, weak human doctor named Scinto has been traveling with BSG as a mentor since Episode 1. But classified medical records tell a horrifying truth.",
      clueLink: "char-blackdagger.html",
      clueLinkText: "👉 Read Black Dagger Scinto's Dossier",
      clueDetails: "Scinto is actually Black Dagger, an evil mastermind who has lived for over 150 years. He pretends to be a frail physician to observe BSG and steal his limitless Redago.",
      question: "What is Black Dagger Scinto's true age and secret motive regarding BSG?",
      options: [
        { label: "A", text: "He is 30 years old seeking to cure diseases" },
        { label: "B", text: "He is over 150 years old seeking to steal BSG's limitless Redago" },
        { label: "C", text: "He is BSG's long-lost uncle" }
      ],
      correctAnswer: "B",
      explanation: "Black Dagger Scinto has lived for over 150 years. He feigns weakness as a humble doctor to stay close to BSG until he can extract and steal BSG's limitless Redago."
    },
    {
      id: 7,
      title: "Birth of the Living Weapon",
      bounty: 600,
      scene: "Forty years ago, Scinto studied Century Legend Rezok from the shadows and realized no weapon could defeat him except another Rezok.",
      clueLink: "char-blackdagger.html",
      clueLinkText: "👉 Read The Creation of Hell Dossier",
      clueDetails: "Scinto stole Rezok's blood and struck an unholy pact with Devil King Cobra from another dimension to create a living weapon.",
      question: "How was Emperor Hell engineered 40 years ago by Black Dagger Scinto?",
      options: [
        { label: "A", text: "Rezok's blood combined with a deal with Devil King Cobra" },
        { label: "B", text: "Forged in a volcanic forge in Flama Nation" },
        { label: "C", text: "Created from ancient Herobrine magic alone" }
      ],
      correctAnswer: "A",
      explanation: "Scinto obtained Rezok's blood and made a dangerous deal with Devil King Cobra (a multidimensional entity), resulting in the birth of Hell."
    },
    {
      id: 8,
      title: "The Abandoned Child & The Cruel Irony",
      bounty: 400,
      scene: "For 14 years, Scinto raised young Hell to awaken his monstrous power to slay Rezok. When Hell failed to become a monster, Scinto threw him onto the streets.",
      clueLink: "char-hell.html",
      clueLinkText: "👉 Read Hell's Adoption Dossier",
      clueDetails: "The homeless 14-year-old boy created specifically to assassinate Rezok crossed paths with Rezok himself on the street.",
      question: "What happened when homeless 14-year-old Hell met Century Legend Rezok?",
      options: [
        { label: "A", text: "Rezok executed him on the spot" },
        { label: "B", text: "Rezok adopted him as a son and student into his family" },
        { label: "C", text: "Hell attacked and wounded Rezok" }
      ],
      correctAnswer: "B",
      explanation: "Instead of becoming Rezok's killer, homeless Hell was taken in by Rezok, became his loyal student, and was adopted into the Rezok family alongside BSG and Toko."
    },
    {
      id: 9,
      title: "The Rezok Family Hierarchy",
      bounty: 550,
      scene: "Detective NJ uncovers the ancient family tree of Rezok's household where love and loyalty counted more than blood ties.",
      clueLink: "universe-lore.html#rezok-family",
      clueLinkText: "👉 Read Rezok's Family Tree",
      clueDetails: "Rezok and his wife Oma raised three children: biological son BSG, adopted daughter Toko, and adopted son Hell.",
      question: "Who are the three children raised in Century Legend Rezok's family?",
      options: [
        { label: "A", text: "BSG (Biological), Toko (Adopted), Hell (Adopted)" },
        { label: "B", text: "Kan, Berry, Suma" },
        { label: "C", text: "Zalta, Scinto, Kraven" }
      ],
      correctAnswer: "A",
      explanation: "Rezok's children were BSG (biological son), Toko (adopted daughter), and Hell (adopted son)."
    },
    {
      id: 10,
      title: "Rezok's Left-Hand Succession",
      bounty: 600,
      scene: "Twenty-five years ago, Rezok's former Left-Hand Man Zabong was slain. The Inner Circle required a new champion.",
      clueLink: "universe-lore.html#rezok-family",
      clueLinkText: "👉 Read Rezok's Inner Circle Dossier",
      clueDetails: "After Zabong's death, an elite fighter from the family rose to take his place as Rezok's official Left-Hand Man.",
      question: "Who succeeded Zabong as Rezok's official Left-Hand Man?",
      options: [
        { label: "A", text: "Hell" },
        { label: "B", text: "Ziggo Degan" },
        { label: "C", text: "Bordo" }
      ],
      correctAnswer: "A",
      explanation: "Following Zabong's demise, Hell proved his elite combat supremacy and became Rezok's new Left-Hand Man."
    },
    {
      id: 11,
      title: "The 5-Billion Cash Heist of Flama",
      bounty: 650,
      scene: "Flama Nation treasury reports confirm that Hell contracted the warlord Bezrk to steal an astronomical sum of 5 Billion in cash.",
      clueLink: "universe-lore.html#hell-zygo",
      clueLinkText: "👉 Read Flama War & Heist File",
      clueDetails: "While the public thought Hell was after wealth, intelligence reveals the 5-billion heist was merely a tactical distraction.",
      question: "What was Hell's true, overarching objective behind the 5-billion heist in Flama Nation?",
      options: [
        { label: "A", text: "To buy an island in the North" },
        { label: "B", text: "The complete devastation and destruction of Flama Nation" },
        { label: "C", text: "To bribe Earth King Eric" }
      ],
      correctAnswer: "B",
      explanation: "The 5-billion cash heist with Bezrk was merely a minor diversion; Hell's true goal was the complete devastation of Flama Nation."
    },
    {
      id: 12,
      title: "The 7,999-Year Awakening in Episode 24",
      bounty: 750,
      scene: "In Episode 24, a catastrophic cosmic seal was ruptured. An apocalyptic entity trapped in Hell for 7,999 years was released through an ancient bloodline.",
      clueLink: "universe-lore.html#curse-god",
      clueLinkText: "👉 Read Curse God Ritual Dossier",
      clueDetails: "Devil Priest Kraven conducted the forbidden ritual by exploiting Zalta's ancient Herobrine Clan bloodline to unseal the Curse God.",
      question: "Who awakened the 7,999-year Curse God through Zalta in Episode 24?",
      options: [
        { label: "A", text: "Devil Priest Kraven" },
        { label: "B", text: "Doctor Scinto" },
        { label: "C", text: "Ziggo Degan" }
      ],
      correctAnswer: "A",
      explanation: "Devil Priest Kraven used Zalta's Herobrine bloodline to awaken the Curse God, who had been trapped in Hell for nearly 7,999 years."
    },
    {
      id: 13,
      title: "Kan's Spatial Arsenal",
      bounty: 450,
      scene: "Detective NJ inspects the tactical gear of Kan, the one-eyed warrior who never smiles. Kan carries no swords or guns.",
      clueLink: "char-kan.html",
      clueLinkText: "👉 Read Kan's Weapons Dossier",
      clueDetails: "Kan fights strictly with two types of specialized pens: Blue Pens for spatial shifting and Red Pens for heavy thermal blasts.",
      question: "What are the exact functions of Kan's Blue Pens and Red Pens?",
      options: [
        { label: "A", text: "Blue = Teleportation, Red = Explosives" },
        { label: "B", text: "Blue = Ice, Red = Fire" },
        { label: "C", text: "Blue = Writing, Red = Poison" }
      ],
      correctAnswer: "A",
      explanation: "Kan only ever uses two types of pens: Blue Pens for instant spatial teleportation and Red Pens for massive explosives."
    },
    {
      id: 14,
      title: "Suma's Tectonic Secret",
      bounty: 500,
      scene: "Seismic monitors show that Suma can trigger massive earthquakes and underground explosions without using explosives or heavy machinery.",
      clueLink: "char-suma.html",
      clueLinkText: "👉 Read Suma's Ability Dossier",
      clueDetails: "Suma uses her brilliant brain to calculate subterranean stress lines and utilizes her signature 'Weak Point' ability directly on the earth.",
      question: "How does Suma trigger tectonic earthquakes and underground explosions?",
      options: [
        { label: "A", text: "By planting Redago nuclear cores" },
        { label: "B", text: "By using her 'Weak Point' ability to touch subterranean tectonic stress points" },
        { label: "C", text: "By summoning the earth elemental beast" }
      ],
      correctAnswer: "B",
      explanation: "Suma calculates and physically touches weak points beneath the earth's surface to shift tectonic plates and trigger massive underground explosions."
    },
    {
      id: 15,
      title: "The Gambler's Life-and-Death Crisis",
      bounty: 550,
      scene: "Medical monitors at the vanguard camp reveal that Berry, the wielder of the Ogre blade, is suffering through an extreme life-and-death crisis.",
      clueLink: "char-berry.html",
      clueLinkText: "👉 Read Berry's Dossier",
      clueDetails: "Berry is an insanely fearless gambler who loves risk. He threw himself into a duel against the newly awakened Curse God purely for fun.",
      question: "Why is Berry currently in a critical life-and-death crisis?",
      options: [
        { label: "A", text: "He poisoned himself by accident" },
        { label: "B", text: "He fought the Curse God just for fun despite knowing he could die" },
        { label: "C", text: "He was betrayed by Kan" }
      ],
      correctAnswer: "B",
      explanation: "Berry's reckless love for gambling led him to fight the Curse God for fun, leaving him gravely wounded in a life-and-death struggle."
    },
    {
      id: 16,
      title: "Eysa's Ancient Mantra",
      bounty: 600,
      scene: "Eysa, Kraven's sister and one of the last two survivors of the Devil Priest Clan, holds the ultimate trump card to save the world from the Curse God.",
      clueLink: "char-eysa.html",
      clueLinkText: "👉 Read Eysa's Sacred Mantra Dossier",
      clueDetails: "In addition to possessing people's minds with her spoken words for a few seconds, Eysa holds a sacred incantation.",
      question: "What is Eysa's ultimate sacred power regarding the Curse God?",
      options: [
        { label: "A", text: "She can completely absorb and consume the Curse God" },
        { label: "B", text: "She holds a powerful sacred mantra capable of sealing the Curse God" },
        { label: "C", text: "She can transform the Curse God into human form" }
      ],
      correctAnswer: "B",
      explanation: "Eysa holds the ancestral mantra of the Devil Priest Clan, which is the only force capable of binding and sealing the Curse God."
    },
    {
      id: 17,
      title: "The Three Shades of Discord",
      bounty: 650,
      scene: "Kan's old mercenary allies, the Three Shades, have arrived to reinforce BSG's squad against Hell's armies. Detective NJ inspects their roster.",
      clueLink: "universe-lore.html#three-shades",
      clueLinkText: "👉 Read The Three Shades Dossier",
      clueDetails: "The Three Shades consist of Shane (The Gunman), Gain (Monster Strength), and Fin (the multi-talented fighter who plays guitar).",
      question: "What unique skillset does Fin of the Three Shades possess?",
      options: [
        { label: "A", text: "A multi-talented fighter and guitarist who can kill with almost anything" },
        { label: "B", text: "He is a submarine engineer" },
        { label: "C", text: "He only uses poison blowdarts" }
      ],
      correctAnswer: "A",
      explanation: "Fin is a multi-talented combatant who plays guitar, fights with countless versatile skills, and can kill an enemy with almost anything."
    },
    {
      id: 18,
      title: "The Supreme Sovereign of Earth",
      bounty: 1000,
      scene: "Detective NJ reviews the complete planetary governance archive of Danger X Zone. Four regional emperors rule the cardinal directions.",
      clueLink: "universe-lore.html#world-order",
      clueLinkText: "👉 Read The World Order Page",
      clueDetails: "While Ziggo Degan rules the East, Ice King rules the North, Marcle rules the South, and Hell rules the West, one supreme central judge stands above all four.",
      question: "Who is the supreme Earth King who stands above all four regional emperors in the World Order?",
      options: [
        { label: "A", text: "Eric (Earth King)" },
        { label: "B", text: "Bordo" },
        { label: "C", text: "Sage Monk" }
      ],
      correctAnswer: "A",
      explanation: "Eric is the supreme Earth King, acting as the ultimate central judge and sovereign positioned above all four regional emperors."
    }
  ];

  // Application State
  let gameState = {
    solvedCount: 0,
    walletBalance: 0,
    currentMysteryIndex: 0,
    solvedMysteries: []
  };

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        gameState = Object.assign(gameState, parsed);
      }
    } catch (e) {
      console.warn('Could not load game state from localStorage:', e);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    } catch (e) {
      console.warn('Could not save game state to localStorage:', e);
    }
  }

  function renderHUD() {
    const solvedCountEl = document.getElementById('hud-solved-count');
    const walletBalanceEl = document.getElementById('hud-wallet-balance');
    const progressBarEl = document.getElementById('hud-progress-fill');
    const progressTextEl = document.getElementById('hud-progress-text');

    const total = MYSTERIES_DATA.length;
    const solved = gameState.solvedMysteries.length;
    const percent = Math.round((solved / total) * 100);

    if (solvedCountEl) solvedCountEl.textContent = `${solved} / ${total}`;
    if (walletBalanceEl) walletBalanceEl.textContent = `$${gameState.walletBalance.toLocaleString()}`;
    if (progressBarEl) progressBarEl.style.width = `${percent}%`;
    if (progressTextEl) progressTextEl.textContent = `${percent}% Solved`;
  }

  function renderMystery(index) {
    const mystery = MYSTERIES_DATA[index];
    if (!mystery) return;

    gameState.currentMysteryIndex = index;
    const isSolved = gameState.solvedMysteries.includes(mystery.id);

    const titleEl = document.getElementById('active-mystery-title');
    const numEl = document.getElementById('active-mystery-number');
    const rewardEl = document.getElementById('active-mystery-reward');
    const sceneEl = document.getElementById('active-mystery-scene');
    const questionEl = document.getElementById('active-mystery-question');
    const optionsContainer = document.getElementById('active-mystery-options');
    const clueBtn = document.getElementById('clue-modal-trigger');
    const feedbackEl = document.getElementById('active-mystery-feedback');
    const clueLinkDirect = document.getElementById('active-mystery-clue-link');

    if (numEl) numEl.textContent = `Mystery #${mystery.id}`;
    if (titleEl) titleEl.textContent = mystery.title;
    if (rewardEl) rewardEl.textContent = `+$${mystery.bounty}`;
    if (sceneEl) sceneEl.textContent = mystery.scene;
    if (questionEl) questionEl.textContent = mystery.question;

    // Render prominent clue reference link directly in the card
    if (clueLinkDirect) {
      clueLinkDirect.innerHTML = `<a href="${mystery.clueLink}" target="_blank" class="clue-deep-link-btn" title="Open canonical lore dossier"><i class="fa-solid fa-book-open"></i> ${mystery.clueLinkText} <i class="fa-solid fa-arrow-up-right-from-square"></i></a>`;
    }

    if (feedbackEl) {
      feedbackEl.className = 'mystery-feedback';
      if (isSolved) {
        feedbackEl.classList.add('success', 'show');
        feedbackEl.innerHTML = `<i class="fa-solid fa-circle-check"></i> <strong>Case Solved!</strong> ${mystery.explanation}`;
      } else {
        feedbackEl.innerHTML = '';
        feedbackEl.classList.remove('show');
      }
    }

    if (optionsContainer) {
      optionsContainer.innerHTML = '';
      mystery.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        if (isSolved && opt.label === mystery.correctAnswer) {
          btn.classList.add('correct');
        }
        btn.innerHTML = `<span class="choice-tag">${opt.label}</span> <span class="choice-text">${opt.text}</span>`;
        btn.addEventListener('click', () => handleOptionClick(mystery, opt.label, btn));
        optionsContainer.appendChild(btn);
      });
    }

    // Update modal clue content
    const modalTitle = document.getElementById('clue-modal-title');
    const modalBody = document.getElementById('clue-modal-body');
    const modalLink = document.getElementById('clue-modal-link-wrap');

    if (modalTitle) modalTitle.textContent = `Clue Dossier: Case #${mystery.id}`;
    if (modalBody) modalBody.textContent = mystery.clueDetails;
    if (modalLink) {
      modalLink.innerHTML = `<a href="${mystery.clueLink}" target="_blank" class="btn btn-primary" style="margin-top: 1rem; display: inline-flex; align-items: center; gap: 0.5rem;"><i class="fa-solid fa-book-open"></i> ${mystery.clueLinkText} <i class="fa-solid fa-arrow-up-right-from-square"></i></a>`;
    }

    renderArchives();
  }

  function handleOptionClick(mystery, chosenLabel, buttonElement) {
    const feedbackEl = document.getElementById('active-mystery-feedback');
    const isAlreadySolved = gameState.solvedMysteries.includes(mystery.id);

    if (chosenLabel === mystery.correctAnswer) {
      buttonElement.classList.add('correct');
      if (!isAlreadySolved) {
        gameState.solvedMysteries.push(mystery.id);
        gameState.walletBalance += mystery.bounty;
        saveState();
        renderHUD();
      }

      if (feedbackEl) {
        feedbackEl.className = 'mystery-feedback success show';
        feedbackEl.innerHTML = `<i class="fa-solid fa-circle-check"></i> <strong>Correct Deduction! +$${mystery.bounty}</strong><p style="margin: 0.4rem 0 0 0; font-size: 0.95rem;">${mystery.explanation}</p>`;
      }

      // Auto advance after 2 seconds if next mystery exists
      if (gameState.currentMysteryIndex < MYSTERIES_DATA.length - 1) {
        setTimeout(() => {
          renderMystery(gameState.currentMysteryIndex + 1);
        }, 1800);
      }
    } else {
      buttonElement.classList.add('wrong');
      if (feedbackEl) {
        feedbackEl.className = 'mystery-feedback error show';
        feedbackEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <strong>Incorrect Deduction.</strong> Inspect the clue link above to find the answer!`;
      }
      setTimeout(() => {
        buttonElement.classList.remove('wrong');
      }, 1200);
    }
  }

  function renderArchives() {
    const grid = document.getElementById('case-archive-grid');
    if (!grid) return;

    grid.innerHTML = '';
    MYSTERIES_DATA.forEach((m, idx) => {
      const isSolved = gameState.solvedMysteries.includes(m.id);
      const isUnlocked = idx === 0 || gameState.solvedMysteries.includes(MYSTERIES_DATA[idx - 1].id) || isSolved;
      const isActive = idx === gameState.currentMysteryIndex;

      const card = document.createElement('div');
      card.className = `case-archive-card ${isActive ? 'active' : ''} ${!isUnlocked ? 'locked' : ''} ${isSolved ? 'solved' : ''}`;
      card.innerHTML = `
        <div class="archive-card-status">
          <span>CASE #${m.id}</span>
          <span style="color: ${isSolved ? '#2ecc71' : isUnlocked ? '#00e5ff' : '#64748B'};">${isSolved ? 'SOLVED (+$' + m.bounty + ')' : isUnlocked ? 'UNLOCKED' : 'LOCKED'}</span>
        </div>
        <div class="archive-card-title">${m.title}</div>
      `;

      if (isUnlocked) {
        card.addEventListener('click', () => renderMystery(idx));
      }
      grid.appendChild(card);
    });
  }

  function initModals() {
    const clueBtn = document.getElementById('clue-modal-trigger');
    const modal = document.getElementById('clue-modal');
    const closeBtn = document.getElementById('clue-modal-close');
    const backdrop = document.getElementById('clue-modal-backdrop');

    if (clueBtn && modal) {
      clueBtn.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    }

    const closeModal = () => {
      if (modal) modal.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    const resetBtn = document.getElementById('reset-progress-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset your Detective NJ bounty cash and solved mysteries?')) {
          localStorage.removeItem(STORAGE_KEY);
          gameState = {
            solvedCount: 0,
            walletBalance: 0,
            currentMysteryIndex: 0,
            solvedMysteries: []
          };
          renderHUD();
          renderMystery(0);
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadState();
    renderHUD();

    // Default to first unsolved mystery or mystery 0
    let startIdx = 0;
    for (let i = 0; i < MYSTERIES_DATA.length; i++) {
      if (!gameState.solvedMysteries.includes(MYSTERIES_DATA[i].id)) {
        startIdx = i;
        break;
      }
    }

    renderMystery(startIdx);
    initModals();
  });

})();
