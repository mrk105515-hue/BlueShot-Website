/**
 * Danger X Zone (DXZ) - Detective NJ 100vh Zero-Scroll Character Game Engine
 * Strictly derived from the official 12-page DXZ PDF Document with only grammar corrections.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'dxz_detective_nj_game_state_v1';

  // Detective NJ Dynamic Emotes
  const EMOTES = {
    smirk: 'assets/detective-nj-smirk.png', // Ideal / Default Pose
    coffee: 'assets/detective-nj-coffee.png', // Relaxed coffee sipping
    thinking: 'assets/detective-nj-thinking.png', // Investigating & analyzing
    serious: 'assets/detective-nj-serious.png', // Shadowed eyes / dark interrogation & wrong answer
    shadow: 'assets/detective-nj-serious.png'
  };

  function preloadEmotes() {
    Object.values(EMOTES).forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }

  function setDetectiveEmote(emoteKey) {
    const figureEl = document.getElementById('detective-nj-figure');
    if (!figureEl) return;
    const targetSrc = EMOTES[emoteKey] || EMOTES.smirk;
    if (figureEl.getAttribute('src') === targetSrc) return;

    figureEl.classList.add('emote-swapping');
    setTimeout(() => {
      figureEl.src = targetSrc;
      figureEl.classList.remove('emote-swapping');
    }, 120);
  }

  // 18 Canonical Case Files strictly from the 12-page PDF
  const MYSTERIES_DATA = [
    {
      id: 1,
      title: "Who Started the Flama Nation Attack?",
      bounty: 100,
      defaultEmote: "coffee",
      scene: "Detective NJ was drinking tea at a cafe when he suddenly heard news that Flama Nation suffered a massive attack. 10,000 assassins, the Curse God, Bjerk, and giant monster Dahaka were involved.",
      clueLink: "universe-lore.html#curse-god",
      clueLinkText: "👉 Read the World Order & Flama Nation Page",
      clueDetails: "According to imperial intelligence, Hell targeted Flama Nation and started a war, forming an alliance with Devil Priest Kraven to execute his plan.",
      question: "Who was the ultimate mastermind behind planning the Flama Nation attack?",
      options: [
        { label: "A", text: "Hell's Plan" },
        { label: "B", text: "Zygo's Plan" },
        { label: "C", text: "A Mysterious Lone Bandit" }
      ],
      correctAnswer: "A",
      explanation: "Hell built a great plan, forming an alliance with Devil Priest Kraven to achieve the complete devastation of Flama Nation."
    },
    {
      id: 2,
      title: "Why is Hell Doing Such Destruction?",
      bounty: 150,
      defaultEmote: "thinking",
      scene: "Professor NJ sits at his cafe table thinking: 'Why did Hell turn from Rezok's loyal family member into the bringer of apocalyptic war? What drove him to this madness?'",
      clueLink: "universe-lore.html#hell-zygo",
      clueLinkText: "👉 Read Zygo and Hell History",
      clueDetails: "Hell and his fiancée, Tressa Forst, lived a happy life for many years until Zygo Degan unexpectedly killed Tressa Forst and the father of his own wife, Koyo.",
      question: "What drove Emperor Hell to seek the total destruction of Zygo's realm?",
      options: [
        { label: "A", text: "Zygo killed Hell's fiancée, Tressa Forst" },
        { label: "B", text: "Hell is naturally psycho" },
        { label: "C", text: "Because Earth King Eric ordered it" }
      ],
      correctAnswer: "A",
      explanation: "Hell lived happily with his fiancée Tressa Forst until Zygo Degan killed her, turning the unstoppable duo into mortal enemies."
    },
    {
      id: 3,
      title: "The Tragedy of 5-Year-Old BSG",
      bounty: 250,
      defaultEmote: "smirk",
      scene: "A 5-year-old boy was found scared and running through a village. A kind woman named Masa gave him medicine, food, and sang him a lullaby (Lori) until he fell asleep.",
      clueLink: "char-bsg.html",
      clueLinkText: "👉 Read BSG's Childhood Story",
      clueDetails: "When mysterious villains burned the village, they held an axe to 5-year-old BSG's hands and gave him a choice: kill Masa and they would leave.",
      question: "What horrific act was 5-year-old BSG forced to commit with an axe?",
      options: [
        { label: "A", text: "Chop down the sacred village tree" },
        { label: "B", text: "Cut off the head of his caretaker, Masa" },
        { label: "C", text: "Break the golden prison gates" }
      ],
      correctAnswer: "B",
      explanation: "Masa smiled and told BSG 'do it', and trembling in shock, BSG cut off Masa's head—only for the villains to slaughter all villagers anyway."
    },
    {
      id: 4,
      title: "Why Did BSG Rob Villagers for 18 Years?",
      bounty: 350,
      defaultEmote: "thinking",
      scene: "For 18 years, BSG lived a harsh life wearing a mask and actively robbing villagers wherever he went.",
      clueLink: "char-bsg.html",
      clueLinkText: "👉 Read BSG's 18-Year Mask Dossier",
      clueDetails: "Every time BSG loved someone (Masa, Oro, and 30 others), the evil forces hunting him killed them. 10 villages were destroyed.",
      question: "Why did BSG intentionally wear a mask and rob villagers for 18 years?",
      options: [
        { label: "A", text: "To hoard gold for a private army" },
        { label: "B", text: "So people would hate him and stay away, protecting them from the devils hunting his blood" },
        { label: "C", text: "He was under Black Dagger's mind control" }
      ],
      correctAnswer: "B",
      explanation: "BSG made people hate him so no one would befriend him, preventing the devils chasing his bloodline from killing more innocent people."
    },
    {
      id: 5,
      title: "The Lineage of the Redago Force",
      bounty: 500,
      defaultEmote: "smirk",
      scene: "The devils relentlessly chased BSG from village to village because of the boundless crimson energy in his veins.",
      clueLink: "char-bsg.html",
      clueLinkText: "👉 Read BSG's Bloodline Dossier",
      clueDetails: "BSG carries a limitless force of Redago from his bloodline as the biological son of the legendary leader.",
      question: "Who is BSG's biological father from whom he inherited limitless Redago?",
      options: [
        { label: "A", text: "Century Legend Rezok" },
        { label: "B", text: "Emperor Hell" },
        { label: "C", text: "Devil King Cobra" }
      ],
      correctAnswer: "A",
      explanation: "BSG is the biological son of Century Legend Rezok and his wife Oma, inheriting the limitless force of Redago."
    },
    {
      id: 6,
      title: "The 150-Year Impostor",
      bounty: 500,
      defaultEmote: "coffee",
      scene: "In Episode 1, BSG meets an innocent scientist and doctor named Black Dagger (Scinto), who becomes his mentor.",
      clueLink: "char-blackdagger.html",
      clueLinkText: "👉 Read Black Dagger Scinto's Dossier",
      clueDetails: "Scinto pretends to be a weak human doctor, but he has lived for over 150 years.",
      question: "What is Black Dagger Scinto's true secret motive regarding BSG?",
      options: [
        { label: "A", text: "To cure rare diseases across the Earth" },
        { label: "B", text: "To secretly observe and obtain the limitless power of Redago from BSG" },
        { label: "C", text: "To adopt BSG as his legal son" }
      ],
      correctAnswer: "B",
      explanation: "Black Dagger Scinto has lived for over 150 years; he teaches BSG while secretly planning to steal his limitless Redago."
    },
    {
      id: 7,
      title: "Birth of the Living Weapon",
      bounty: 600,
      defaultEmote: "thinking",
      scene: "Forty years ago, Scinto studied Century Legend Rezok and discovered: 'The only man capable of defeating Rezok... is Rezok himself.'",
      clueLink: "char-blackdagger.html",
      clueLinkText: "👉 Read The Creation of Hell Dossier",
      clueDetails: "Scinto obtained Rezok's blood and made a dangerous deal with Devil King Cobra, a powerful being from another dimension.",
      question: "How was Emperor Hell engineered 40 years ago by Black Dagger Scinto?",
      options: [
        { label: "A", text: "Rezok's blood combined with a deal with Devil King Cobra" },
        { label: "B", text: "Forged in an obsidian forge in Flama Nation" },
        { label: "C", text: "Created from ancient magic alone" }
      ],
      correctAnswer: "A",
      explanation: "Scinto took Rezok's blood and struck an unholy deal with multidimensional being Devil King Cobra to create Hell."
    },
    {
      id: 8,
      title: "The Abandoned Child & Rezok",
      bounty: 400,
      defaultEmote: "coffee",
      scene: "For 14 years, Scinto tried to turn Hell into a monster to slay Rezok. When Hell failed to become a monster, Scinto abandoned him.",
      clueLink: "char-hell.html",
      clueLinkText: "👉 Read Hell's Adoption Dossier",
      clueDetails: "The homeless 14-year-old child created to destroy Rezok crossed paths with Rezok on the street.",
      question: "What happened when homeless 14-year-old Hell met Century Legend Rezok?",
      options: [
        { label: "A", text: "Rezok executed him" },
        { label: "B", text: "Rezok made him his student and adopted him into his family" },
        { label: "C", text: "Hell attacked and wounded Rezok" }
      ],
      correctAnswer: "B",
      explanation: "Instead of becoming Rezok's enemy, homeless Hell was taken in by Rezok, becoming his student and part of his household."
    },
    {
      id: 9,
      title: "Rezok's Inner Circle",
      bounty: 450,
      defaultEmote: "coffee",
      scene: "In Rezok's household, love and friendship mattered more than blood relations.",
      clueLink: "universe-lore.html#rezok-family",
      clueLinkText: "👉 Read The Six Who Ruled An Era",
      clueDetails: "Rezok's inner circle was known as 'The Six Who Ruled An Era'.",
      question: "Who served as the Chief Strategist and Grandpa figure of Rezok's family?",
      options: [
        { label: "A", text: "Bordo 'The Genius Strategist'" },
        { label: "B", text: "Earth King Eric" },
        { label: "C", text: "Devil King Cobra" }
      ],
      correctAnswer: "A",
      explanation: "Bordo 'The Genius Strategist' served as the Grandpa figure and Chief Strategist of Rezok's family."
    },
    {
      id: 10,
      title: "Zalta's Heritage & Zabong's Death",
      bounty: 400,
      defaultEmote: "smirk",
      scene: "Zalta is the last survivor of the Herobrine Clan, wiped out by Sage Monk and Rezok. 25 years ago, Rezok also killed Zalta's father.",
      clueLink: "char-zalta.html",
      clueLinkText: "👉 Read Zalta's Dossier",
      clueDetails: "Zalta's father was Rezok's former Left-Hand Man, but Zalta never knew about his father's dirty deeds.",
      question: "Who was Zalta's biological father?",
      options: [
        { label: "A", text: "Zabong" },
        { label: "B", text: "Ziggo Degan" },
        { label: "C", text: "Bordo" }
      ],
      correctAnswer: "A",
      explanation: "Zalta is the son of Zabong. Seeing his father dead shattered his heart, leading him to be manipulated by Hell for 25 years."
    },
    {
      id: 11,
      title: "The Battle of Westo City",
      bounty: 350,
      defaultEmote: "thinking",
      scene: "Zalta became a criminal manipulated by Emperor Hell. Twenty-five years later, his fate took a dramatic turn.",
      clueLink: "char-zalta.html",
      clueLinkText: "👉 Read Westo City Battle",
      clueDetails: "Zalta attacked Westo City and clashed with BSG.",
      question: "What happened after BSG defeated Zalta in Westo City?",
      options: [
        { label: "A", text: "Zalta was imprisoned in the underworld forever" },
        { label: "B", text: "Zalta realized Hell manipulated him and joined BSG's team" },
        { label: "C", text: "Zalta retreated to Flama Nation" }
      ],
      correctAnswer: "B",
      explanation: "After meeting and being defeated by BSG, Zalta realized Hell had manipulated him and became BSG's teammate."
    },
    {
      id: 12,
      title: "The Awakening in Episode 24",
      bounty: 600,
      defaultEmote: "smirk",
      scene: "In Episode 24, Devil Priest Kraven carried out an apocalyptic ritual using an ancient bloodline.",
      clueLink: "universe-lore.html#curse-god",
      clueLinkText: "👉 Read Curse God Awakening",
      clueDetails: "Only a Devil Priest can awaken the Curse God through Zalta's Herobrine bloodline.",
      question: "How long had the Curse God been trapped in Hell before Kraven awakened it in Episode 24?",
      options: [
        { label: "A", text: "Nearly 7,999 Years" },
        { label: "B", text: "150 Years" },
        { label: "C", text: "40 Years" }
      ],
      correctAnswer: "A",
      explanation: "In Episode 24, Kraven used Zalta's Herobrine bloodline to awaken the Curse God, who was trapped for nearly 7,999 years."
    },
    {
      id: 13,
      title: "Kan's Iconic Arsenal",
      bounty: 300,
      defaultEmote: "coffee",
      scene: "Kan is a one-eyed warrior in BSG's vanguard who never smiles.",
      clueLink: "char-kan.html",
      clueLinkText: "👉 Read Kan's Weapon Dossier",
      clueDetails: "Kan uses only two types of pens in battle.",
      question: "What are the combat functions of Kan's Blue and Red Pens?",
      options: [
        { label: "A", text: "Blue Pens = Teleportation; Red Pens = Explosives" },
        { label: "B", text: "Blue Pens = Freezing; Red Pens = Fire aura" },
        { label: "C", text: "Blue Pens = Healing; Red Pens = Poison" }
      ],
      correctAnswer: "A",
      explanation: "Kan strictly uses Blue Pens for teleportation and Red Pens for creating massive explosions."
    },
    {
      id: 14,
      title: "Suma's Brain & Weak Point",
      bounty: 400,
      defaultEmote: "thinking",
      scene: "Suma is an unpredictable woman who does everything for a purpose, using her brain as her greatest weapon.",
      clueLink: "char-suma.html",
      clueLinkText: "👉 Read Suma's Ability Dossier",
      clueDetails: "Suma uses her unique 'Weak Point' ability on the ground itself.",
      question: "What happens when Suma activates Weak Point beneath the surface?",
      options: [
        { label: "A", text: "She freezes the groundwater instantly" },
        { label: "B", text: "She shakes tectonic plates, creates earthquakes, and triggers underground explosions" },
        { label: "C", text: "She summons ancient spirits from the earth" }
      ],
      correctAnswer: "B",
      explanation: "By touching weak points beneath the surface, Suma can shake tectonic plates, trigger earthquakes, and cause underground explosions."
    },
    {
      id: 15,
      title: "Berry's Gamble & The Ogre Sword",
      bounty: 450,
      defaultEmote: "smirk",
      scene: "Berry has no fear and loves to gamble. He fought the Curse God just for fun, even though he knew he could die.",
      clueLink: "char-berry.html",
      clueLinkText: "👉 Read Berry's Crisis Dossier",
      clueDetails: "Berry is now in a life-and-death crisis after fighting the Curse God with extreme speed and his legendary weapon.",
      question: "What is the name of the world's most powerful sword wielded by Berry?",
      options: [
        { label: "A", text: "Ogre" },
        { label: "B", text: "Flame Blade" },
        { label: "C", text: "Redago Fang" }
      ],
      correctAnswer: "A",
      explanation: "Berry wields Ogre, recognized as the world's most powerful sword."
    },
    {
      id: 16,
      title: "Eysa's Mantra & Mind Possession",
      bounty: 500,
      defaultEmote: "smirk",
      scene: "Eysa is the sister of Kraven and one of the last two survivors of the Devil Priest Clan.",
      clueLink: "char-eysa.html",
      clueLinkText: "👉 Read Eysa's Dossier",
      clueDetails: "Eysa possesses people's minds with her words and holds the key to the Curse God.",
      question: "What ultimate feat can Eysa accomplish using her powerful mantra?",
      options: [
        { label: "A", text: "Seal the 7,999-year Curse God" },
        { label: "B", text: "Destroy Flama Nation permanently" },
        { label: "C", text: "Resurrect Rezok" }
      ],
      correctAnswer: "A",
      explanation: "With her powerful mantra, Eysa has the capability to seal the Curse God."
    },
    {
      id: 17,
      title: "The Three Shades",
      bounty: 350,
      defaultEmote: "coffee",
      scene: "Kan's old mercenary friends have joined as allies of BSG's team to help stop Hell's war.",
      clueLink: "universe-lore.html#three-shades",
      clueLinkText: "👉 Read The Three Shades File",
      clueDetails: "The Three Shades consist of Shane, Gain, and Fin.",
      question: "Which member of the Three Shades is a fighting guitarist who can kill with almost anything?",
      options: [
        { label: "A", text: "Fin" },
        { label: "B", text: "Shane" },
        { label: "C", text: "Gain" }
      ],
      correctAnswer: "A",
      explanation: "Fin is a multi-talented fighting guitarist with countless skills who can kill with almost anything."
    },
    {
      id: 18,
      title: "The Supreme Ruler of Earth",
      bounty: 500,
      defaultEmote: "thinking",
      scene: "Earth is governed by Four Regional Emperors: Zigo Degan (East), Ice King (North), Marcle (South), and Hell (West).",
      clueLink: "universe-lore.html#world-order",
      clueLinkText: "👉 Read World Order Codex",
      clueDetails: "Above all four regional emperors stands One Central Judge.",
      question: "Who is the Supreme Central Judge positioned above all four regional emperors?",
      options: [
        { label: "A", text: "Eric (Earth King)" },
        { label: "B", text: "Century Legend Rezok" },
        { label: "C", text: "Devil Priest Kraven" }
      ],
      correctAnswer: "A",
      explanation: "Eric (Earth King) is the Supreme Central Judge positioned above all four regional emperors."
    }
  ];

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
        gameState = Object.assign(gameState, JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading game state', e);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    } catch (e) {
      console.error('Error saving game state', e);
    }
  }

  function renderHUD() {
    const solvedEl = document.getElementById('hud-solved-count');
    const progText = document.getElementById('hud-progress-text');
    const fillEl = document.getElementById('hud-progress-fill');
    const walletEl = document.getElementById('hud-wallet-balance');

    const total = MYSTERIES_DATA.length;
    const solved = gameState.solvedMysteries.length;
    const pct = Math.round((solved / total) * 100);

    if (solvedEl) solvedEl.textContent = solved + ' / ' + total;
    if (progText) progText.textContent = pct + '% Solved';
    if (fillEl) fillEl.style.width = pct + '%';
    if (walletEl) walletEl.textContent = '$' + gameState.walletBalance;
  }

  function renderMystery(index) {
    if (index < 0 || index >= MYSTERIES_DATA.length) return;
    gameState.currentMysteryIndex = index;

    const mystery = MYSTERIES_DATA[index];
    const isSolved = gameState.solvedMysteries.includes(mystery.id);

    // Update Detective NJ Emote
    if (isSolved) {
      setDetectiveEmote('smirk');
    } else {
      setDetectiveEmote(mystery.defaultEmote || 'smirk');
    }

    const numEl = document.getElementById('active-mystery-number');
    const titleEl = document.getElementById('active-mystery-title');
    const rewardEl = document.getElementById('active-mystery-reward');
    const statusEl = document.getElementById('active-mystery-status');
    const sceneEl = document.getElementById('active-mystery-scene');
    const questionEl = document.getElementById('active-mystery-question');
    const optionsContainer = document.getElementById('active-mystery-options');
    const feedbackEl = document.getElementById('active-mystery-feedback');
    const clueLinkDirect = document.getElementById('active-mystery-clue-link');

    if (numEl) numEl.textContent = 'Case #' + mystery.id;
    if (titleEl) titleEl.textContent = mystery.title;
    if (rewardEl) rewardEl.innerHTML = '<i class="fa-solid fa-sack-dollar"></i> +$' + mystery.bounty;
    
    if (statusEl) {
      if (isSolved) {
        statusEl.style.borderColor = '#2ecc71';
        statusEl.style.color = '#2ecc71';
        statusEl.style.background = 'rgba(46, 204, 113, 0.16)';
        statusEl.innerHTML = '<i class="fa-solid fa-circle-check"></i> Case Solved';
      } else {
        statusEl.style.borderColor = '#00e5ff';
        statusEl.style.color = '#00e5ff';
        statusEl.style.background = 'rgba(0, 229, 255, 0.12)';
        statusEl.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> Interrogation Active';
      }
    }

    if (sceneEl) sceneEl.textContent = mystery.scene;
    if (questionEl) questionEl.textContent = mystery.question;

    if (clueLinkDirect) {
      clueLinkDirect.innerHTML = '<a href="' + mystery.clueLink + '" target="_blank" class="clue-deep-link-btn" title="Open canonical lore dossier"><i class="fa-solid fa-book-open"></i> ' + mystery.clueLinkText + ' <i class="fa-solid fa-arrow-up-right-from-square"></i></a>';
    }

    if (feedbackEl) {
      feedbackEl.className = 'mystery-feedback-bar';
      if (isSolved) {
        feedbackEl.classList.add('success', 'show');
        feedbackEl.innerHTML = '<i class="fa-solid fa-circle-check"></i> <strong>Case Solved!</strong> ' + mystery.explanation;
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
        btn.innerHTML = '<span class="choice-tag">' + opt.label + '</span> <span class="choice-text">' + opt.text + '</span>';
        btn.addEventListener('click', () => handleOptionClick(mystery, opt.label, btn));
        optionsContainer.appendChild(btn);
      });
    }

    const modalTitle = document.getElementById('clue-modal-title');
    const modalBody = document.getElementById('clue-modal-body');
    const modalLink = document.getElementById('clue-modal-link-wrap');

    if (modalTitle) modalTitle.innerHTML = '<i class="fa-solid fa-folder-open"></i> Clue Dossier: Case #' + mystery.id;
    if (modalBody) modalBody.textContent = mystery.clueDetails;
    if (modalLink) {
      modalLink.innerHTML = '<a href="' + mystery.clueLink + '" target="_blank" class="btn btn-primary" style="margin-top: 1rem; display: inline-flex; align-items: center; gap: 0.5rem; background: linear-gradient(135deg, #00e5ff, #0077b6); color: #000; font-weight: 800; padding: 0.75rem 1.5rem; border-radius: 10px; text-decoration: none;"><i class="fa-solid fa-book-open"></i> ' + mystery.clueLinkText + ' <i class="fa-solid fa-arrow-up-right-from-square"></i></a>';
    }

    renderArchives();
  }

  function handleOptionClick(mystery, chosenLabel, buttonElement) {
    const feedbackEl = document.getElementById('active-mystery-feedback');
    const figureEl = document.getElementById('detective-nj-figure');
    const isAlreadySolved = gameState.solvedMysteries.includes(mystery.id);

    if (chosenLabel === mystery.correctAnswer) {
      buttonElement.classList.add('correct');
      setDetectiveEmote('smirk'); // Confident triumphant smirk on correct answer

      if (!isAlreadySolved) {
        gameState.solvedMysteries.push(mystery.id);
        gameState.walletBalance += mystery.bounty;
        saveState();
        renderHUD();
      }

      if (figureEl) {
        figureEl.style.transform = 'scale(1.03) translateY(-4px)';
        setTimeout(() => {
          figureEl.style.transform = '';
        }, 1200);
      }

      if (feedbackEl) {
        feedbackEl.className = 'mystery-feedback-bar success show';
        feedbackEl.innerHTML = '<i class="fa-solid fa-circle-check"></i> <strong>Spot On! Deduction Verified (+$' + mystery.bounty + ')</strong><p style="margin: 0.35rem 0 0 0; font-size: 0.92rem;">' + mystery.explanation + '</p>';
      }

      if (gameState.solvedMysteries.length === MYSTERIES_DATA.length) {
        setTimeout(() => {
          if (feedbackEl) {
            feedbackEl.innerHTML = '<i class="fa-solid fa-trophy"></i> <strong>ALL 18 CASES SOLVED!</strong> You are officially recognized as a Master DXZ Investigator with a bounty vault of $' + gameState.walletBalance + '!';
          }
        }, 2200);
      } else if (gameState.currentMysteryIndex < MYSTERIES_DATA.length - 1) {
        setTimeout(() => {
          renderMystery(gameState.currentMysteryIndex + 1);
        }, 1900);
      }
    } else {
      buttonElement.classList.add('wrong');
      setDetectiveEmote('serious'); // Shadowed eye serious emote on wrong answer!

      if (figureEl) {
        figureEl.style.transform = 'rotate(-1deg)';
        setTimeout(() => {
          figureEl.style.transform = '';
        }, 800);
      }

      if (feedbackEl) {
        feedbackEl.className = 'mystery-feedback-bar error show';
        feedbackEl.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> <strong>Incorrect Deduction.</strong> Inspect the Clue Drawer or click the lore link to verify!';
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
      card.className = 'case-archive-card ' + (isActive ? 'active' : '') + ' ' + (!isUnlocked ? 'locked' : '') + ' ' + (isSolved ? 'solved' : '');
      card.innerHTML = 
        '<div class="archive-card-status">' +
          '<span>CASE #' + m.id + '</span>' +
          '<span style="color: ' + (isSolved ? '#2ecc71' : isUnlocked ? '#00e5ff' : '#64748B') + ';">' + (isSolved ? 'SOLVED (+$' + m.bounty + ')' : isUnlocked ? 'UNLOCKED' : 'LOCKED') + '</span>' +
        '</div>' +
        '<div class="archive-card-title">' + m.title + '</div>';

      if (isUnlocked) {
        card.addEventListener('click', () => {
          renderMystery(idx);
          const archivesModal = document.getElementById('archives-modal');
          if (archivesModal) archivesModal.classList.remove('active');
        });
      }
      grid.appendChild(card);
    });
  }

  function initModals() {
    // Clue Modal
    const clueBtn = document.getElementById('clue-modal-trigger');
    const clueModal = document.getElementById('clue-modal');
    const clueClose = document.getElementById('clue-modal-close');
    const clueBackdrop = document.getElementById('clue-modal-backdrop');

    if (clueBtn && clueModal) {
      clueBtn.addEventListener('click', () => {
        setDetectiveEmote('thinking'); // Thinking emote when inspecting clues
        clueModal.classList.add('active');
      });
    }

    const closeClue = () => {
      if (clueModal) clueModal.classList.remove('active');
    };

    if (clueClose) clueClose.addEventListener('click', closeClue);
    if (clueBackdrop) clueBackdrop.addEventListener('click', closeClue);

    // Archives Slide-in Modal
    const openArchivesBtn = document.getElementById('open-archives-btn');
    const archivesModal = document.getElementById('archives-modal');
    const archivesClose = document.getElementById('archives-modal-close');
    const archivesBackdrop = document.getElementById('archives-modal-backdrop');

    if (openArchivesBtn && archivesModal) {
      openArchivesBtn.addEventListener('click', () => {
        archivesModal.classList.add('active');
      });
    }

    const closeArchives = () => {
      if (archivesModal) archivesModal.classList.remove('active');
    };

    if (archivesClose) archivesClose.addEventListener('click', closeArchives);
    if (archivesBackdrop) archivesBackdrop.addEventListener('click', closeArchives);

    // Reset Progress
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
    preloadEmotes();
    loadState();
    renderHUD();

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
