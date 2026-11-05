/**
 * Danger X Zone (DXZ) - Detective NJ 100vh Zero-Scroll Character Game Engine
 * 60 Canonical Case Files across 7 Lore Parts from the official DXZ Master Codex.
 * Features:
 * - 15-Question Random Active Slot per session/refresh
 * - Instant Dynamic Question Swap on incorrect deduction from 45-case reserve pool
 * - Persistent Vault Bounty Cash
 * - Interactive Clue Drawer & 15-Case Slot Archives
 */

(function () {
  'use strict';

  const STORAGE_BALANCE_KEY = 'dxz_detective_nj_vault_balance_v3';
  const ACTIVE_SLOT_SIZE = 15;

  // Detective NJ Dynamic Emotes
  const EMOTES = {
    smirk: 'assets/detective-nj-smirk.png', // Ideal / Default Pose
    coffee: 'assets/detective-nj-coffee.png', // Relaxed coffee sipping
    thinking: 'assets/detective-nj-thinking.png', // Investigating & analyzing
    serious: 'assets/detective-nj-serious.png', // Shadowed eyes with glowing eye
    hatSmirk: 'assets/detective-nj-hat-smirk.png', // Hat down hidden eyes smirk
    hatSerious: 'assets/detective-nj-hat-serious.png', // Hat down hidden eyes grim thought
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

  // Full 60-Case Master Question Bank
  const ALL_LORE_QUESTIONS = [
  {
    "id": 1,
    "part": 1,
    "category": "Part 1 – The World Order",
    "title": "The Political System of Earth",
    "bounty": 100,
    "defaultEmote": "coffee",
    "scene": "Detective NJ sips his café brew while reviewing intelligence dossiers across the continents. Earth is not governed by a typical modern democracy.",
    "clueLink": "universe-lore.html#world-order",
    "clueLinkText": "Read World Order Codex",
    "clueDetails": "Historical intelligence confirms: Earth is partitioned into 4 great territories under 4 regional Emperors, all answering to 1 Supreme Central Judge.",
    "question": "What is the political system of Danger X Zone?",
    "options": [
      {
        "label": "A",
        "text": "Earth is ruled by 4 Great Emperors and 1 Central Judge"
      },
      {
        "label": "B",
        "text": "Earth is ruled by 7 Kings"
      },
      {
        "label": "C",
        "text": "Earth has no central government"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Earth is ruled by 4 Great Emperors across the 4 cardinal territories and 1 Central Judge situated above them all."
  },
  {
    "id": 2,
    "part": 1,
    "category": "Part 1 – The World Order",
    "title": "The Great Emperors Count",
    "bounty": 100,
    "defaultEmote": "smirk",
    "scene": "A geopolitical world map sits open on Detective NJ's desk, partitioned with imperial crests.",
    "clueLink": "universe-lore.html#world-order",
    "clueLinkText": "Read World Order Codex",
    "clueDetails": "Each cardinal territory (East, North, South, West) is placed under the direct command of an Emperor of supreme rank.",
    "question": "How many Great Emperors rule different regions of Earth?",
    "options": [
      {
        "label": "A",
        "text": "Three"
      },
      {
        "label": "B",
        "text": "Four"
      },
      {
        "label": "C",
        "text": "Five"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Exactly Four Great Emperors rule over the different regions of Earth."
  },
  {
    "id": 3,
    "part": 1,
    "category": "Part 1 – The World Order",
    "title": "The Supreme Central Judge",
    "bounty": 100,
    "defaultEmote": "hatSmirk",
    "scene": "Above all regional warfare and territorial borders, one figure holds ultimate judicial supremacy.",
    "clueLink": "universe-lore.html#world-order",
    "clueLinkText": "Read Central Judge Dossier",
    "clueDetails": "Known as the Earth King, this sovereign presides over the high judicial authority of the realm.",
    "question": "Who is the Central Judge above all four Emperors?",
    "options": [
      {
        "label": "A",
        "text": "Rezok"
      },
      {
        "label": "B",
        "text": "Eric (Earth King)"
      },
      {
        "label": "C",
        "text": "Bordo"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Eric (Earth King) is the Supreme Central Judge above all four Great Emperors."
  },
  {
    "id": 4,
    "part": 1,
    "category": "Part 1 – The World Order",
    "title": "Ruler of the Eastern Region",
    "bounty": 100,
    "defaultEmote": "thinking",
    "scene": "Detective NJ inspects imperial trade seals from the Eastern territory.",
    "clueLink": "char-jiggo.html",
    "clueLinkText": "Read Eastern Emperor Profile",
    "clueDetails": "The legendary right-hand commander of Rezok established his supreme reign over the Eastern realm.",
    "question": "Who rules the Eastern region?",
    "options": [
      {
        "label": "A",
        "text": "Zygo Degan"
      },
      {
        "label": "B",
        "text": "Hell"
      },
      {
        "label": "C",
        "text": "Marcle"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Zygo Degan is the Great Emperor who rules the Eastern region."
  },
  {
    "id": 5,
    "part": 1,
    "category": "Part 1 – The World Order",
    "title": "Ruler of the Northern Region",
    "bounty": 100,
    "defaultEmote": "coffee",
    "scene": "Reports of sub-zero blizzards and frost armies arrive from the Northern borders.",
    "clueLink": "universe-lore.html#world-order",
    "clueLinkText": "Read Northern Intelligence",
    "clueDetails": "The frozen northern dominion is commanded by a frost sovereign of unyielding chill.",
    "question": "Who rules the Northern region?",
    "options": [
      {
        "label": "A",
        "text": "Marcle"
      },
      {
        "label": "B",
        "text": "Ice King"
      },
      {
        "label": "C",
        "text": "Zygo Degan"
      }
    ],
    "correctAnswer": "B",
    "explanation": "The Ice King commands and rules the Northern region."
  },
  {
    "id": 6,
    "part": 1,
    "category": "Part 1 – The World Order",
    "title": "Ruler of the Southern Region",
    "bounty": 100,
    "defaultEmote": "smirk",
    "scene": "Detective NJ tracks maritime movements in the warm southern ocean territories.",
    "clueLink": "universe-lore.html#world-order",
    "clueLinkText": "Read Southern Intelligence",
    "clueDetails": "Intelligence records reveal the Southern region is governed by Emperor Marcle.",
    "question": "Who rules the Southern region?",
    "options": [
      {
        "label": "A",
        "text": "Hell"
      },
      {
        "label": "B",
        "text": "Ice King"
      },
      {
        "label": "C",
        "text": "Marcle"
      }
    ],
    "correctAnswer": "C",
    "explanation": "Marcle is the Great Emperor ruling the Southern region."
  },
  {
    "id": 7,
    "part": 1,
    "category": "Part 1 – The World Order",
    "title": "Ruler of the Western Region",
    "bounty": 100,
    "defaultEmote": "serious",
    "scene": "A grim territory dominated by dark ambition, sorrow, and relentless militarization.",
    "clueLink": "char-hell.html",
    "clueLinkText": "Read Western Emperor Dossier",
    "clueDetails": "Rezok's former student built an unstoppable imperial stronghold in the West.",
    "question": "Who rules the Western region?",
    "options": [
      {
        "label": "A",
        "text": "Zygo Degan"
      },
      {
        "label": "B",
        "text": "Hell"
      },
      {
        "label": "C",
        "text": "Eric"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Emperor Hell rules the Western region."
  },
  {
    "id": 8,
    "part": 2,
    "category": "Part 2 – Rezok's Dynasty",
    "title": "The 40-Year Legend",
    "bounty": 100,
    "defaultEmote": "hatSerious",
    "scene": "Forty years ago, the underworld trembled before one supreme criminal warlord.",
    "clueLink": "universe-lore.html#rezok-era",
    "clueLinkText": "Read Rezok Dynasty Codex",
    "clueDetails": "A mythic figure known across generations built a legendary inner family.",
    "question": "Who was the most feared criminal empire leader 40 years ago?",
    "options": [
      {
        "label": "A",
        "text": "Century Legend Rezok"
      },
      {
        "label": "B",
        "text": "Earth King Eric"
      },
      {
        "label": "C",
        "text": "Hell"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Century Legend Rezok was the most feared criminal empire leader 40 years ago."
  },
  {
    "id": 9,
    "part": 2,
    "category": "Part 2 – Rezok's Dynasty",
    "title": "Rezok's Beloved Matriarch",
    "bounty": 100,
    "defaultEmote": "coffee",
    "scene": "Detective NJ studies an old archived portrait of Rezok's inner circle.",
    "clueLink": "universe-lore.html#rezok-era",
    "clueLinkText": "Read Rezok Family Tree",
    "clueDetails": "Beside Rezok stood his loving wife, the heart of the dynasty.",
    "question": "Who was Rezok's wife?",
    "options": [
      {
        "label": "A",
        "text": "Koyo"
      },
      {
        "label": "B",
        "text": "Oma"
      },
      {
        "label": "C",
        "text": "Tressa"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Oma was Rezok's beloved wife."
  },
  {
    "id": 10,
    "part": 2,
    "category": "Part 2 – Rezok's Dynasty",
    "title": "Rezok's Biological Bloodline",
    "bounty": 100,
    "defaultEmote": "serious",
    "scene": "Among Rezok's family of adopted warriors, only one boy inherited his true blood and Redago power.",
    "clueLink": "char-bsg.html",
    "clueLinkText": "Read BSG Lineage Record",
    "clueDetails": "The main hero carries the direct genetic legacy of Century Legend Rezok.",
    "question": "Who is Rezok's biological son?",
    "options": [
      {
        "label": "A",
        "text": "Toko"
      },
      {
        "label": "B",
        "text": "Hell"
      },
      {
        "label": "C",
        "text": "BSG"
      }
    ],
    "correctAnswer": "C",
    "explanation": "BSG is Rezok's biological son, blessed with limitless Redago Force."
  },
  {
    "id": 11,
    "part": 2,
    "category": "Part 2 – Rezok's Dynasty",
    "title": "The Identity of Toko",
    "bounty": 100,
    "defaultEmote": "thinking",
    "scene": "Detective NJ pulls a family registration registry from the Rezok household.",
    "clueLink": "universe-lore.html#rezok-era",
    "clueLinkText": "Read Rezok Household Record",
    "clueDetails": "Rezok raised multiple children with unconditional parental devotion.",
    "question": "Who is Toko?",
    "options": [
      {
        "label": "A",
        "text": "Rezok's adopted child"
      },
      {
        "label": "B",
        "text": "Rezok's biological son"
      },
      {
        "label": "C",
        "text": "Zygo's biological son"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Toko is Rezok's adopted child."
  },
  {
    "id": 12,
    "part": 2,
    "category": "Part 2 – Rezok's Dynasty",
    "title": "Rezok's Adopted Student & Left Hand",
    "bounty": 100,
    "defaultEmote": "hatSerious",
    "scene": "Rezok took in a determined youth, training him personally to become his Left-Hand Man.",
    "clueLink": "char-hell.html",
    "clueLinkText": "Read Hell Apprenticeship Record",
    "clueDetails": "This disciple grew into one of the deadliest emperors on Earth.",
    "question": "Who was Rezok's adopted student and Left-Hand Man?",
    "options": [
      {
        "label": "A",
        "text": "Bordo"
      },
      {
        "label": "B",
        "text": "Hell"
      },
      {
        "label": "C",
        "text": "Zalta"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Hell was Rezok's adopted student and later became his Left-Hand Man."
  },
  {
    "id": 13,
    "part": 2,
    "category": "Part 2 – Rezok's Dynasty",
    "title": "The Original Left-Hand Man",
    "bounty": 100,
    "defaultEmote": "serious",
    "scene": "Years before Hell assumed the mantle, a fierce warrior guarded Rezok's left side.",
    "clueLink": "char-zalta.html",
    "clueLinkText": "Read Zabong & Zalta Dossier",
    "clueDetails": "Zalta's biological father originally occupied this senior rank.",
    "question": "Who was Rezok's original Left-Hand Man?",
    "options": [
      {
        "label": "A",
        "text": "Zabong"
      },
      {
        "label": "B",
        "text": "Zygo"
      },
      {
        "label": "C",
        "text": "Marcle"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Zabong was Rezok's original Left-Hand Man before his demise."
  },
  {
    "id": 14,
    "part": 2,
    "category": "Part 2 – Rezok's Dynasty",
    "title": "Successor to Zabong",
    "bounty": 100,
    "defaultEmote": "thinking",
    "scene": "Following the death of Zabong 25 years ago, Rezok elevated a trusted student.",
    "clueLink": "char-hell.html",
    "clueLinkText": "Read Inner Circle Succession",
    "clueDetails": "The adopted apprentice stepped into Zabong's vacant Left-Hand role.",
    "question": "Who succeeded Zabong after his death?",
    "options": [
      {
        "label": "A",
        "text": "Bordo"
      },
      {
        "label": "B",
        "text": "Hell"
      },
      {
        "label": "C",
        "text": "BSG"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Hell succeeded Zabong as Rezok's Left-Hand Man."
  },
  {
    "id": 15,
    "part": 2,
    "category": "Part 2 – Rezok's Dynasty",
    "title": "Rezok's Right-Hand Man",
    "bounty": 100,
    "defaultEmote": "hatSmirk",
    "scene": "Rezok placed supreme trust in his Right-Hand commander on the battlefield.",
    "clueLink": "char-jiggo.html",
    "clueLinkText": "Read Ziggo Degan Dossier",
    "clueDetails": "This lethal partner later claimed rule over the Eastern quadrant.",
    "question": "Who was Rezok's Right-Hand Man?",
    "options": [
      {
        "label": "A",
        "text": "Hell"
      },
      {
        "label": "B",
        "text": "Zabong"
      },
      {
        "label": "C",
        "text": "Ziggo Degan"
      }
    ],
    "correctAnswer": "C",
    "explanation": "Ziggo Degan was Rezok's formidable Right-Hand Man."
  },
  {
    "id": 16,
    "part": 2,
    "category": "Part 2 – Rezok's Dynasty",
    "title": "Chief Strategist of the Family",
    "bounty": 100,
    "defaultEmote": "coffee",
    "scene": "The tactical genius who architected Rezok's conquests from the shadows.",
    "clueLink": "universe-lore.html#rezok-era",
    "clueLinkText": "Read Bordo Dossier",
    "clueDetails": "The beloved grandfatherly figure of the family who devised all major strategies.",
    "question": "Who was the chief strategist of Rezok's family?",
    "options": [
      {
        "label": "A",
        "text": "Bordo"
      },
      {
        "label": "B",
        "text": "Kraven"
      },
      {
        "label": "C",
        "text": "Zalta"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Bordo was the Chief Strategist and tactical mastermind of Rezok's family."
  },
  {
    "id": 17,
    "part": 2,
    "category": "Part 2 – Rezok's Dynasty",
    "title": "Zygo's Wife",
    "bounty": 100,
    "defaultEmote": "thinking",
    "scene": "A marriage intertwined with deep family ties and subsequent unspeakable tragedy.",
    "clueLink": "char-jiggo.html",
    "clueLinkText": "Read Koyo & Zygo Record",
    "clueDetails": "Zygo's wife whose father was later murdered in a mysterious tragedy.",
    "question": "Who was Zygo's wife?",
    "options": [
      {
        "label": "A",
        "text": "Oma"
      },
      {
        "label": "B",
        "text": "Koyo"
      },
      {
        "label": "C",
        "text": "Tressa"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Koyo was Zygo Degan's wife."
  },
  {
    "id": 18,
    "part": 2,
    "category": "Part 2 – Rezok's Dynasty",
    "title": "Zygo and Koyo's Adopted Children",
    "bounty": 100,
    "defaultEmote": "smirk",
    "scene": "Two gifted orphans were taken in by Zygo and Koyo to be raised as siblings.",
    "clueLink": "char-suma.html",
    "clueLinkText": "Read Berry & Suma Dossier",
    "clueDetails": "A lightning-fast swordsman and a brilliant tectonic tactician grew up in their care.",
    "question": "Who were Zygo and Koyo's adopted children?",
    "options": [
      {
        "label": "A",
        "text": "BSG and Toko"
      },
      {
        "label": "B",
        "text": "Berry and Suma"
      },
      {
        "label": "C",
        "text": "Hell and Zalta"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Berry and Suma were Zygo and Koyo's adopted children."
  },
  {
    "id": 19,
    "part": 2,
    "category": "Part 2 – Rezok's Dynasty",
    "title": "Rezok's Legendary Inner Circle",
    "bounty": 100,
    "defaultEmote": "hatSerious",
    "scene": "Detective NJ counts the seats at the historic inner war table of Rezok.",
    "clueLink": "universe-lore.html#rezok-era",
    "clueLinkText": "Read Inner Circle Council",
    "clueDetails": "Rezok's supreme inner cadre comprised a fixed number of legendary members.",
    "question": "How many members were part of Rezok's legendary inner circle?",
    "options": [
      {
        "label": "A",
        "text": "Four"
      },
      {
        "label": "B",
        "text": "Five"
      },
      {
        "label": "C",
        "text": "Six"
      }
    ],
    "correctAnswer": "C",
    "explanation": "There were Six members in Rezok's legendary inner circle."
  },
  {
    "id": 20,
    "part": 2,
    "category": "Part 2 – Rezok's Dynasty",
    "title": "The Bond of Rezok's Family",
    "bounty": 100,
    "defaultEmote": "coffee",
    "scene": "What made a syndicate of feared warriors feel like a genuine, loving home?",
    "clueLink": "universe-lore.html#rezok-era",
    "clueLinkText": "Read Rezok Family Philosophy",
    "clueDetails": "Rezok instilled a philosophy where loyalty and affection transcended biological ties.",
    "question": "What made Rezok's family special?",
    "options": [
      {
        "label": "A",
        "text": "Only biological relatives were accepted"
      },
      {
        "label": "B",
        "text": "Love and friendship mattered more than blood relations"
      },
      {
        "label": "C",
        "text": "Everyone was forced to join"
      }
    ],
    "correctAnswer": "B",
    "explanation": "In Rezok's family, love and friendship mattered far more than blood relations."
  },
  {
    "id": 21,
    "part": 3,
    "category": "Part 3 – Hell vs. Zygo",
    "title": "Hell's Fiancée",
    "bounty": 100,
    "defaultEmote": "hatSerious",
    "scene": "Before the apocalypse, Emperor Hell lived happily with the love of his life.",
    "clueLink": "char-hell.html",
    "clueLinkText": "Read Tressa Forst Chronicle",
    "clueDetails": "Her untimely death destroyed the peace of Earth and birthed a monster of vengeance.",
    "question": "Who was Hell's fiancée?",
    "options": [
      {
        "label": "A",
        "text": "Koyo"
      },
      {
        "label": "B",
        "text": "Tressa Forst"
      },
      {
        "label": "C",
        "text": "Oma"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Tressa Forst was Hell's fiancée."
  },
  {
    "id": 22,
    "part": 3,
    "category": "Part 3 – Hell vs. Zygo",
    "title": "Destruction of the Brotherhood",
    "bounty": 100,
    "defaultEmote": "serious",
    "scene": "Two lifelong brothers-in-arms became sworn mortal nemeses overnight.",
    "clueLink": "universe-lore.html#hell-zygo",
    "clueLinkText": "Read Hell vs Zygo Tragedy",
    "clueDetails": "A cold-blooded killing shattered their alliance beyond repair.",
    "question": "What destroyed the brotherhood between Hell and Zygo?",
    "options": [
      {
        "label": "A",
        "text": "A battle for territory"
      },
      {
        "label": "B",
        "text": "Zygo murdered Tressa Forst"
      },
      {
        "label": "C",
        "text": "Rezok abandoned them"
      }
    ],
    "correctAnswer": "B",
    "explanation": "The brotherhood was destroyed when Zygo murdered Hell's fiancée, Tressa Forst."
  },
  {
    "id": 23,
    "part": 3,
    "category": "Part 3 – Hell vs. Zygo",
    "title": "The Killer of Tressa Forst",
    "bounty": 100,
    "defaultEmote": "hatSerious",
    "scene": "Detective NJ re-examines the homicide records of the murder that ignited global war.",
    "clueLink": "universe-lore.html#hell-zygo",
    "clueLinkText": "Read Murder Case File",
    "clueDetails": "All historical evidence directly names the perpetrator of this horrific crime.",
    "question": "Who killed Tressa Forst?",
    "options": [
      {
        "label": "A",
        "text": "Kraven"
      },
      {
        "label": "B",
        "text": "Hell"
      },
      {
        "label": "C",
        "text": "Zygo Degan"
      }
    ],
    "correctAnswer": "C",
    "explanation": "Zygo Degan killed Tressa Forst."
  },
  {
    "id": 24,
    "part": 3,
    "category": "Part 3 – Hell vs. Zygo",
    "title": "The Second Murder",
    "bounty": 100,
    "defaultEmote": "thinking",
    "scene": "Tressa Forst was not the only person who died by Zygo's blade.",
    "clueLink": "universe-lore.html#hell-zygo",
    "clueLinkText": "Read Unsolved Victims File",
    "clueDetails": "Zygo executed a shocking murder striking at his very own household.",
    "question": "Whose father did Zygo also kill?",
    "options": [
      {
        "label": "A",
        "text": "Hell's father"
      },
      {
        "label": "B",
        "text": "Koyo's father"
      },
      {
        "label": "C",
        "text": "Rezok's father"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Zygo also killed the father of his own wife, Koyo."
  },
  {
    "id": 25,
    "part": 3,
    "category": "Part 3 – Hell vs. Zygo",
    "title": "The Unstoppable Duo",
    "bounty": 100,
    "defaultEmote": "coffee",
    "scene": "Old war veterans reminisce about the invincible alliance during Rezok's reign.",
    "clueLink": "universe-lore.html#hell-zygo",
    "clueLinkText": "Read Hell & Zygo Early Alliance",
    "clueDetails": "Together, Hell and Zygo formed an unbeatable tactical pairing.",
    "question": "What was the relationship between Hell and Zygo before the tragedy?",
    "options": [
      {
        "label": "A",
        "text": "Great allies and an unstoppable duo"
      },
      {
        "label": "B",
        "text": "Rival emperors from childhood"
      },
      {
        "label": "C",
        "text": "Enemies fighting for Rezok's throne"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Before the tragedy, Hell and Zygo were great allies and an unstoppable duo."
  },
  {
    "id": 26,
    "part": 3,
    "category": "Part 3 – Hell vs. Zygo",
    "title": "Hell's Motive for Vengeance",
    "bounty": 100,
    "defaultEmote": "serious",
    "scene": "Hell is willing to plunge the entire world into ruin to achieve one goal.",
    "clueLink": "char-hell.html",
    "clueLinkText": "Read Hell's Motivation",
    "clueDetails": "The grief of losing his betrothed converted his sorrow into bottomless hatred.",
    "question": "Why does Hell want revenge against Zygo?",
    "options": [
      {
        "label": "A",
        "text": "Zygo stole his empire"
      },
      {
        "label": "B",
        "text": "Zygo killed his fiancée"
      },
      {
        "label": "C",
        "text": "Zygo defeated him in a tournament"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Hell wants revenge because Zygo killed his fiancée Tressa Forst."
  },
  {
    "id": 27,
    "part": 3,
    "category": "Part 3 – Hell vs. Zygo",
    "title": "The Dark Alliance",
    "bounty": 100,
    "defaultEmote": "hatSerious",
    "scene": "To ensure the complete devastation of his enemy, Hell forged a pact with an occult master.",
    "clueLink": "universe-lore.html#curse-god",
    "clueLinkText": "Read Dark Covenant Dossier",
    "clueDetails": "Hell allied with a dark priest who possessed the knowledge to awaken the Curse God.",
    "question": "Who did Hell form an alliance with to execute his plan?",
    "options": [
      {
        "label": "A",
        "text": "Eric"
      },
      {
        "label": "B",
        "text": "Kraven"
      },
      {
        "label": "C",
        "text": "Bordo"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Hell formed an alliance with Devil Priest Kraven to execute his plan."
  },
  {
    "id": 28,
    "part": 3,
    "category": "Part 3 – Hell vs. Zygo",
    "title": "The Identity of Kraven",
    "bounty": 100,
    "defaultEmote": "thinking",
    "scene": "A shadowy figure performing forbidden blood rites across ancient shrines.",
    "clueLink": "universe-lore.html#curse-god",
    "clueLinkText": "Read Devil Priest Dossier",
    "clueDetails": "He is the fearsome spiritual leader who awakened the 7,999-year horror.",
    "question": "Who is Kraven?",
    "options": [
      {
        "label": "A",
        "text": "The Devil Priest"
      },
      {
        "label": "B",
        "text": "The Northern Emperor"
      },
      {
        "label": "C",
        "text": "Rezok's son"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Kraven is the Devil Priest."
  },
  {
    "id": 29,
    "part": 3,
    "category": "Part 3 – Hell vs. Zygo",
    "title": "The Unsolved Enigma of Zygo",
    "bounty": 100,
    "defaultEmote": "hatSmirk",
    "scene": "Detective NJ: 'One crucial puzzle remains unanswered in this entire global conflict.'",
    "clueLink": "universe-lore.html#hell-zygo",
    "clueLinkText": "Read The Great Mystery",
    "clueDetails": "Zygo has never revealed his true underlying reason for committing the murders.",
    "question": "What is the biggest mystery surrounding Zygo's actions?",
    "options": [
      {
        "label": "A",
        "text": "Why he killed Tressa and Koyo's father"
      },
      {
        "label": "B",
        "text": "Why he left the Eastern region"
      },
      {
        "label": "C",
        "text": "Why he betrayed Rezok 40 years ago"
      }
    ],
    "correctAnswer": "A",
    "explanation": "The biggest mystery is why Zygo killed Tressa Forst and Koyo's father."
  },
  {
    "id": 30,
    "part": 4,
    "category": "Part 4 – The Curse God",
    "title": "The Ancient Herobrine Bloodline",
    "bounty": 100,
    "defaultEmote": "thinking",
    "scene": "An ancient clan was wiped out decades ago, leaving behind only one survivor carrying their blood.",
    "clueLink": "char-zalta.html",
    "clueLinkText": "Read Herobrine Lineage",
    "clueDetails": "This warrior's genetic heritage holds the key to cosmic seals.",
    "question": "Who belongs to an ancient bloodline of Herobrines?",
    "options": [
      {
        "label": "A",
        "text": "Kan"
      },
      {
        "label": "B",
        "text": "Zalta"
      },
      {
        "label": "C",
        "text": "Shane"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Zalta belongs to an ancient bloodline of Herobrines."
  },
  {
    "id": 31,
    "part": 4,
    "category": "Part 4 – The Curse God",
    "title": "BSG's Trusted Ally",
    "bounty": 100,
    "defaultEmote": "smirk",
    "scene": "After discovering Hell had lied to him for 25 years, this warrior fought alongside BSG.",
    "clueLink": "char-zalta.html",
    "clueLinkText": "Read Zalta & BSG Friendship",
    "clueDetails": "He stood as BSG's loyal friend to undo the horrors unleashed by Hell.",
    "question": "Who is BSG's friend?",
    "options": [
      {
        "label": "A",
        "text": "Zalta"
      },
      {
        "label": "B",
        "text": "Kraven"
      },
      {
        "label": "C",
        "text": "Gain"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Zalta is BSG's trusted friend and teammate."
  },
  {
    "id": 32,
    "part": 4,
    "category": "Part 4 – The Curse God",
    "title": "The Awakening Specialist",
    "bounty": 100,
    "defaultEmote": "serious",
    "scene": "Zalta's Herobrine blood is powerless on its own without a specialized occult ritualist.",
    "clueLink": "universe-lore.html#curse-god",
    "clueLinkText": "Read Ritual Requirements",
    "clueDetails": "Only someone holding the dark priesthood can channel the ancient seal.",
    "question": "Who can awaken the Curse God through Zalta?",
    "options": [
      {
        "label": "A",
        "text": "A Great Emperor"
      },
      {
        "label": "B",
        "text": "A Devil Priest"
      },
      {
        "label": "C",
        "text": "The Earth King"
      }
    ],
    "correctAnswer": "B",
    "explanation": "A Devil Priest is the only one who can awaken the Curse God through Zalta."
  },
  {
    "id": 33,
    "part": 4,
    "category": "Part 4 – The Curse God",
    "title": "The Awakening in Episode 24",
    "bounty": 100,
    "defaultEmote": "hatSerious",
    "scene": "Seismic tremors shook the planet during the terrifying climax of Episode 24.",
    "clueLink": "universe-lore.html#curse-god",
    "clueLinkText": "Read Episode 24 Chronicle",
    "clueDetails": "The Devil Priest completed the ritual to release the imprisoned entity.",
    "question": "Who awakened the Curse God in Episode 24?",
    "options": [
      {
        "label": "A",
        "text": "Hell"
      },
      {
        "label": "B",
        "text": "Eysa"
      },
      {
        "label": "C",
        "text": "Kraven"
      }
    ],
    "correctAnswer": "C",
    "explanation": "Kraven awakened the Curse God in Episode 24."
  },
  {
    "id": 34,
    "part": 4,
    "category": "Part 4 – The Curse God",
    "title": "The Underworld Prison",
    "bounty": 100,
    "defaultEmote": "serious",
    "scene": "Where had the ancient deity been sealed away since the dawn of recorded history?",
    "clueLink": "universe-lore.html#curse-god",
    "clueLinkText": "Read Ancient Sealing Record",
    "clueDetails": "The cosmic entity was entombed in the underworld depths.",
    "question": "Where had the Curse God been trapped?",
    "options": [
      {
        "label": "A",
        "text": "Inside Ogre"
      },
      {
        "label": "B",
        "text": "In Hell"
      },
      {
        "label": "C",
        "text": "Inside Flama Nation"
      }
    ],
    "correctAnswer": "B",
    "explanation": "The Curse God had been trapped in Hell."
  },
  {
    "id": 35,
    "part": 4,
    "category": "Part 4 – The Curse God",
    "title": "The Eight Millennia Confinement",
    "bounty": 100,
    "defaultEmote": "coffee",
    "scene": "Detective NJ counts the centuries documented in the ancient prophetic tablets.",
    "clueLink": "universe-lore.html#curse-god",
    "clueLinkText": "Read Millennial Chronicle",
    "clueDetails": "The entity remained imprisoned for nearly eighty centuries.",
    "question": "For approximately how long had the Curse God been trapped?",
    "options": [
      {
        "label": "A",
        "text": "799 years"
      },
      {
        "label": "B",
        "text": "7,999 years"
      },
      {
        "label": "C",
        "text": "70,000 years"
      }
    ],
    "correctAnswer": "B",
    "explanation": "The Curse God had been trapped for approximately 7,999 years."
  },
  {
    "id": 36,
    "part": 4,
    "category": "Part 4 – The Curse God",
    "title": "The Supernatural Menace",
    "bounty": 100,
    "defaultEmote": "hatSerious",
    "scene": "Hell deployed this primordial cataclysm onto the battlefields of Flama Nation.",
    "clueLink": "universe-lore.html#curse-god",
    "clueLinkText": "Read Flama War Threat Report",
    "clueDetails": "The entity acts as the supreme supernatural weapon of mass destruction.",
    "question": "What is the Curse God's role in the Flama Nation War?",
    "options": [
      {
        "label": "A",
        "text": "He is the main supernatural threat"
      },
      {
        "label": "B",
        "text": "He protects Flama Nation"
      },
      {
        "label": "C",
        "text": "He commands the Eastern region"
      }
    ],
    "correctAnswer": "A",
    "explanation": "The Curse God is the main supernatural threat in the Flama Nation War."
  },
  {
    "id": 37,
    "part": 5,
    "category": "Part 5 – The Flama Nation War",
    "title": "Masterminds of the Invasion",
    "bounty": 100,
    "defaultEmote": "serious",
    "scene": "Flama Nation is under siege by dark forces. Who orchestrated this catastrophe?",
    "clueLink": "universe-lore.html#curse-god",
    "clueLinkText": "Read Invasion Masterminds",
    "clueDetails": "The Western Emperor combined forces with the Devil Priest to direct the siege.",
    "question": "Who is the mastermind behind the destruction of Flama Nation?",
    "options": [
      {
        "label": "A",
        "text": "BSG and Kan"
      },
      {
        "label": "B",
        "text": "Hell and Kraven"
      },
      {
        "label": "C",
        "text": "Zygo and Eric"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Hell and Kraven are the joint masterminds behind the destruction of Flama Nation."
  },
  {
    "id": 38,
    "part": 5,
    "category": "Part 5 – The Flama Nation War",
    "title": "The Existential Threat to Flama",
    "bounty": 100,
    "defaultEmote": "hatSerious",
    "scene": "Flama Nation defenses cannot withstand this apocalyptic monstrosity.",
    "clueLink": "universe-lore.html#curse-god",
    "clueLinkText": "Read Flama Threat Assessment",
    "clueDetails": "The newly awakened ancient deity poses an existential threat to the nation.",
    "question": "Who is the main threat to Flama Nation?",
    "options": [
      {
        "label": "A",
        "text": "Curse God"
      },
      {
        "label": "B",
        "text": "Ice King"
      },
      {
        "label": "C",
        "text": "Bordo"
      }
    ],
    "correctAnswer": "A",
    "explanation": "The Curse God is the main threat to Flama Nation."
  },
  {
    "id": 39,
    "part": 5,
    "category": "Part 5 – The Flama Nation War",
    "title": "Hell's Ultimate Goal",
    "bounty": 100,
    "defaultEmote": "serious",
    "scene": "Hell refuses compromise or peace negotiations.",
    "clueLink": "char-hell.html",
    "clueLinkText": "Read Hell's War Objectives",
    "clueDetails": "Hell seeks total apocalyptic obliteration of Flama Nation.",
    "question": "What is Hell's ultimate objective?",
    "options": [
      {
        "label": "A",
        "text": "To conquer the Eastern region"
      },
      {
        "label": "B",
        "text": "To completely devastate Flama Nation"
      },
      {
        "label": "C",
        "text": "To become the Earth King"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Hell's ultimate objective is to completely devastate Flama Nation."
  },
  {
    "id": 40,
    "part": 5,
    "category": "Part 5 – The Flama Nation War",
    "title": "The Multi-Billion Deal",
    "bounty": 100,
    "defaultEmote": "coffee",
    "scene": "Detective NJ follows a massive financial transaction tied to Bezrk.",
    "clueLink": "universe-lore.html#hell-zygo",
    "clueLinkText": "Read Financial Audit Log",
    "clueDetails": "A staggering fortune was bargained to fund the impending destruction.",
    "question": "How much money was involved in Hell's deal with Bezrk?",
    "options": [
      {
        "label": "A",
        "text": "500 million"
      },
      {
        "label": "B",
        "text": "1 billion"
      },
      {
        "label": "C",
        "text": "5 billion"
      }
    ],
    "correctAnswer": "C",
    "explanation": "5 billion was involved in Hell's deal with Bezrk."
  },
  {
    "id": 41,
    "part": 5,
    "category": "Part 5 – The Flama Nation War",
    "title": "The Heist's Hidden Motive",
    "bounty": 100,
    "defaultEmote": "thinking",
    "scene": "The heist pulled off with Bezrk was not driven by simple greed.",
    "clueLink": "universe-lore.html#hell-zygo",
    "clueLinkText": "Read Heist Strategic Dossier",
    "clueDetails": "The robbery was merely one cog in an all-out destruction blueprint.",
    "question": "What was the purpose of the heist involving Bezrk?",
    "options": [
      {
        "label": "A",
        "text": "It was part of a much bigger destruction plan"
      },
      {
        "label": "B",
        "text": "It was to rebuild Rezok's empire"
      },
      {
        "label": "C",
        "text": "It was to rescue Tressa"
      }
    ],
    "correctAnswer": "A",
    "explanation": "The heist was part of a much bigger destruction plan devised by Hell."
  },
  {
    "id": 42,
    "part": 5,
    "category": "Part 5 – The Flama Nation War",
    "title": "The Hired Legion",
    "bounty": 100,
    "defaultEmote": "hatSerious",
    "scene": "An elite force of lethal killers was hired with Hell's billions.",
    "clueLink": "universe-lore.html#curse-god",
    "clueLinkText": "Read Mercenary Force Record",
    "clueDetails": "Hell and Kraven bought the services of an army notorious for merciless killings.",
    "question": "Which army did Hell and Kraven hire?",
    "options": [
      {
        "label": "A",
        "text": "The Royal Army"
      },
      {
        "label": "B",
        "text": "The Assassins Army"
      },
      {
        "label": "C",
        "text": "The Northern Army"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Hell and Kraven hired the Assassins Army."
  },
  {
    "id": 43,
    "part": 5,
    "category": "Part 5 – The Flama Nation War",
    "title": "The Defense Alliance",
    "bounty": 100,
    "defaultEmote": "smirk",
    "scene": "A courageous alliance stands as the final barrier between Hell and total world destruction.",
    "clueLink": "universe-lore.html#three-shades",
    "clueLinkText": "Read Resistance Vanguard Dossier",
    "clueDetails": "BSG, his inner core, and the Three Shades lead the battle against Hell.",
    "question": "Who is leading the fight to stop Hell's plan?",
    "options": [
      {
        "label": "A",
        "text": "BSG, Suma, Kan, Berry and the Three Shades"
      },
      {
        "label": "B",
        "text": "Zygo and the four Emperors"
      },
      {
        "label": "C",
        "text": "Rezok and his original inner circle"
      }
    ],
    "correctAnswer": "A",
    "explanation": "BSG, Suma, Kan, Berry and the Three Shades are leading the fight to stop Hell's plan."
  },
  {
    "id": 44,
    "part": 6,
    "category": "Part 6 – BSG and His Team",
    "title": "The Central Protagonists",
    "bounty": 100,
    "defaultEmote": "smirk",
    "scene": "At the heart of the Danger X Zone anime story stands a legendary heroic squad.",
    "clueLink": "char-bsg.html",
    "clueLinkText": "Read DXZ Character Overview",
    "clueDetails": "The storyline centers upon Rezok's biological son and his companions.",
    "question": "Who is the main character of Danger X Zone?",
    "options": [
      {
        "label": "A",
        "text": "Hell"
      },
      {
        "label": "B",
        "text": "BSG and his team"
      },
      {
        "label": "C",
        "text": "Zygo"
      }
    ],
    "correctAnswer": "B",
    "explanation": "BSG and his team are the central protagonists of Danger X Zone."
  },
  {
    "id": 45,
    "part": 6,
    "category": "Part 6 – BSG and His Team",
    "title": "The Nature of BSG",
    "bounty": 100,
    "defaultEmote": "hatSmirk",
    "scene": "A fearless young warrior wielding limitless crimson aura energy.",
    "clueLink": "char-bsg.html",
    "clueLinkText": "Read BSG Profile",
    "clueDetails": "He carries the true genetic lineage of Century Legend Rezok and infinite Redago Force.",
    "question": "Who is BSG?",
    "options": [
      {
        "label": "A",
        "text": "Rezok's biological son with limitless Redago Force"
      },
      {
        "label": "B",
        "text": "Zygo's adopted son"
      },
      {
        "label": "C",
        "text": "The Devil Priest's brother"
      }
    ],
    "correctAnswer": "A",
    "explanation": "BSG is Rezok's biological son who commands limitless Redago Force."
  },
  {
    "id": 46,
    "part": 6,
    "category": "Part 6 – BSG and His Team",
    "title": "Suma the Mastermind",
    "bounty": 100,
    "defaultEmote": "coffee",
    "scene": "The calm brain of the group who formulates winning tactical plans in the heat of combat.",
    "clueLink": "char-suma.html",
    "clueLinkText": "Read Suma Dossier",
    "clueDetails": "She serves as the supreme strategist and commander of the team.",
    "question": "Who is Suma?",
    "options": [
      {
        "label": "A",
        "text": "The Northern Emperor"
      },
      {
        "label": "B",
        "text": "A mastermind strategist and leader"
      },
      {
        "label": "C",
        "text": "A member of the Assassins Army"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Suma is a mastermind strategist and leader."
  },
  {
    "id": 47,
    "part": 6,
    "category": "Part 6 – BSG and His Team",
    "title": "Suma's Tectonic Ability",
    "bounty": 100,
    "defaultEmote": "serious",
    "scene": "Suma locates faultlines beneath the battlefield to trigger massive tremors.",
    "clueLink": "char-suma.html",
    "clueLinkText": "Read Suma Ability Breakdown",
    "clueDetails": "Her power targets structural vulnerabilities to shatter bedrock and detonate explosions.",
    "question": "What is Suma's special ability?",
    "options": [
      {
        "label": "A",
        "text": "Mind possession"
      },
      {
        "label": "B",
        "text": "Weak Point, causing tectonic earthquakes and underground explosions"
      },
      {
        "label": "C",
        "text": "Teleportation using Blue Pens"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Suma's special ability is Weak Point, allowing her to trigger tectonic earthquakes and underground explosions."
  },
  {
    "id": 48,
    "part": 6,
    "category": "Part 6 – BSG and His Team",
    "title": "Kan the DeadMind Vanguard",
    "bounty": 100,
    "defaultEmote": "hatSerious",
    "scene": "A scarred, one-eyed warrior who never smiles and annihilates foes in silence.",
    "clueLink": "char-kan.html",
    "clueLinkText": "Read Kan Warrior Profile",
    "clueDetails": "Kan is recognized as the strongest combat specialist in DeadMind.",
    "question": "Who is Kan?",
    "options": [
      {
        "label": "A",
        "text": "A one-eyed warrior and strongest team member of DeadMind"
      },
      {
        "label": "B",
        "text": "A Devil Priest"
      },
      {
        "label": "C",
        "text": "The fastest member of the team"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Kan is a one-eyed warrior and the strongest combatant in DeadMind."
  },
  {
    "id": 49,
    "part": 6,
    "category": "Part 6 – BSG and His Team",
    "title": "Kan's Blue Pens",
    "bounty": 100,
    "defaultEmote": "thinking",
    "scene": "Kan tosses an azure pen into midair and instantly remanifests across the battlefield.",
    "clueLink": "char-kan.html",
    "clueLinkText": "Read Blue Pen Mechanics",
    "clueDetails": "Blue Pens govern spatial relocation and instant transit.",
    "question": "What do Kan's Blue Pens do?",
    "options": [
      {
        "label": "A",
        "text": "Create earthquakes"
      },
      {
        "label": "B",
        "text": "Teleport"
      },
      {
        "label": "C",
        "text": "Control minds"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Kan's Blue Pens allow him to teleport instantaneously."
  },
  {
    "id": 50,
    "part": 6,
    "category": "Part 6 – BSG and His Team",
    "title": "Kan's Red Pens",
    "bounty": 100,
    "defaultEmote": "serious",
    "scene": "Kan flicks a scarlet pen towards enemy fortifications, triggering a massive blast.",
    "clueLink": "char-kan.html",
    "clueLinkText": "Read Red Pen Mechanics",
    "clueDetails": "Red Pens produce high-yield thermal and kinetic detonations.",
    "question": "What do Kan's Red Pens do?",
    "options": [
      {
        "label": "A",
        "text": "Create explosions"
      },
      {
        "label": "B",
        "text": "Increase speed"
      },
      {
        "label": "C",
        "text": "Seal the Curse God"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Kan's Red Pens create devastating explosions."
  },
  {
    "id": 51,
    "part": 6,
    "category": "Part 6 – BSG and His Team",
    "title": "Berry the Lightning Speedster",
    "bounty": 100,
    "defaultEmote": "smirk",
    "scene": "A golden blur dashes across enemy lines faster than bullets.",
    "clueLink": "char-berry.html",
    "clueLinkText": "Read Berry Speed Dossier",
    "clueDetails": "His swiftness surpasses all other members of the squad.",
    "question": "Who is Berry?",
    "options": [
      {
        "label": "A",
        "text": "The team's chief strategist"
      },
      {
        "label": "B",
        "text": "The fastest member of the team"
      },
      {
        "label": "C",
        "text": "The leader of the Assassins Army"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Berry is the fastest member of the team."
  },
  {
    "id": 52,
    "part": 6,
    "category": "Part 6 – BSG and His Team",
    "title": "Berry's Legendary Blade",
    "bounty": 100,
    "defaultEmote": "hatSmirk",
    "scene": "Berry unsheathes a mythic weapon famed for cutting down ancient beasts.",
    "clueLink": "char-berry.html",
    "clueLinkText": "Read Legendary Swords Dossier",
    "clueDetails": "This renowned sword carries the title of Ogre.",
    "question": "Which legendary sword does Berry wield?",
    "options": [
      {
        "label": "A",
        "text": "Ogre"
      },
      {
        "label": "B",
        "text": "Redago"
      },
      {
        "label": "C",
        "text": "Blue Pen"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Berry wields the legendary sword Ogre."
  },
  {
    "id": 53,
    "part": 6,
    "category": "Part 6 – BSG and His Team",
    "title": "Berry's Mortal Gamble",
    "bounty": 100,
    "defaultEmote": "serious",
    "scene": "Berry lies severely injured after taking a crazy gamble against an ancient monster.",
    "clueLink": "char-berry.html",
    "clueLinkText": "Read Berry Crisis Dossier",
    "clueDetails": "His thrill-seeking personality drove him into a duel with the Curse God purely for fun.",
    "question": "Why is Berry facing a life-and-death crisis?",
    "options": [
      {
        "label": "A",
        "text": "He fought the Curse God for fun"
      },
      {
        "label": "B",
        "text": "He was attacked by Zygo"
      },
      {
        "label": "C",
        "text": "He lost his sword in the heist"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Berry is facing a life-and-death crisis because he fought the Curse God for fun."
  },
  {
    "id": 54,
    "part": 6,
    "category": "Part 6 – BSG and His Team",
    "title": "Eysa's Lineage",
    "bounty": 100,
    "defaultEmote": "thinking",
    "scene": "Detective NJ opens a classified file on a mysterious priestess.",
    "clueLink": "char-eysa.html",
    "clueLinkText": "Read Eysa Profile",
    "clueDetails": "She is Kraven's sister and one of the sole survivors of the Devil Priest Clan.",
    "question": "Who is Eysa?",
    "options": [
      {
        "label": "A",
        "text": "Kraven's sister and a Devil Priest survivor"
      },
      {
        "label": "B",
        "text": "Zygo's adopted daughter"
      },
      {
        "label": "C",
        "text": "The ruler of Flama Nation"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Eysa is Kraven's sister and a Devil Priest survivor."
  },
  {
    "id": 55,
    "part": 6,
    "category": "Part 6 – BSG and His Team",
    "title": "The Sealing Key",
    "bounty": 100,
    "defaultEmote": "hatSerious",
    "scene": "Weapons alone cannot defeat the Curse God—a spiritual lock is needed.",
    "clueLink": "char-eysa.html",
    "clueLinkText": "Read Ancient Sealing Spell",
    "clueDetails": "Eysa memorized the sacred ancestral mantra to re-seal the monster.",
    "question": "What makes Eysa important to defeating the Curse God?",
    "options": [
      {
        "label": "A",
        "text": "She holds the mantra to seal him"
      },
      {
        "label": "B",
        "text": "She possesses the Ogre sword"
      },
      {
        "label": "C",
        "text": "She commands the Assassins Army"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Eysa is vital because she holds the ancient mantra to seal the Curse God."
  },
  {
    "id": 56,
    "part": 6,
    "category": "Part 6 – BSG and His Team",
    "title": "Eysa's Mind Control",
    "bounty": 100,
    "defaultEmote": "serious",
    "scene": "Eysa speaks a quiet phrase, and enemy guards drop their weapons in submission.",
    "clueLink": "char-eysa.html",
    "clueLinkText": "Read Eysa Mental Ability",
    "clueDetails": "Her spoken voice carries psychic command over human minds.",
    "question": "What special ability does Eysa possess?",
    "options": [
      {
        "label": "A",
        "text": "Extreme speed"
      },
      {
        "label": "B",
        "text": "Her words can possess minds"
      },
      {
        "label": "C",
        "text": "Tectonic earthquake creation"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Eysa possesses the special ability to control and possess minds with her words."
  },
  {
    "id": 57,
    "part": 7,
    "category": "Part 7 – The Three Shades",
    "title": "The Identity of The Three Shades",
    "bounty": 100,
    "defaultEmote": "coffee",
    "scene": "Three legendary mercenaries arrive on the Flama frontline to reinforce the defense.",
    "clueLink": "universe-lore.html#three-shades",
    "clueLinkText": "Read The Three Shades Dossier",
    "clueDetails": "They are veteran battlefield companions of Kan who pledged their aid.",
    "question": "Who are the Three Shades?",
    "options": [
      {
        "label": "A",
        "text": "Old friends of Kan and allies of his team"
      },
      {
        "label": "B",
        "text": "The original rulers of Earth"
      },
      {
        "label": "C",
        "text": "Rezok's six legendary members"
      }
    ],
    "correctAnswer": "A",
    "explanation": "The Three Shades are old friends of Kan and powerful allies of his team."
  },
  {
    "id": 58,
    "part": 7,
    "category": "Part 7 – The Three Shades",
    "title": "The Gunman of The Three Shades",
    "bounty": 100,
    "defaultEmote": "hatSmirk",
    "scene": "A sharpshooter who never wastes a bullet and controls high-ground perches.",
    "clueLink": "universe-lore.html#three-shades",
    "clueLinkText": "Read Gain Gunman Profile",
    "clueDetails": "This gunslinger member of the Three Shades is universally called the Gunman.",
    "question": "Who is known as the Gunman?",
    "options": [
      {
        "label": "A",
        "text": "Gain"
      },
      {
        "label": "B",
        "text": "Fin"
      },
      {
        "label": "C",
        "text": "Shane"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Gain is known as the Gunman among the Three Shades."
  },
  {
    "id": 59,
    "part": 7,
    "category": "Part 7 – The Three Shades",
    "title": "Superhuman Colossus",
    "bounty": 100,
    "defaultEmote": "serious",
    "scene": "A massive warrior who can lift siege vehicles and shatter stone with raw muscle.",
    "clueLink": "universe-lore.html#three-shades",
    "clueLinkText": "Read Shane Strength Profile",
    "clueDetails": "He commands terrifying monster-like strength in close-quarters combat.",
    "question": "Who possesses immense monster-like strength?",
    "options": [
      {
        "label": "A",
        "text": "Gain"
      },
      {
        "label": "B",
        "text": "Shane"
      },
      {
        "label": "C",
        "text": "Fin"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Shane possesses immense monster-like strength."
  },
  {
    "id": 60,
    "part": 7,
    "category": "Part 7 – The Three Shades",
    "title": "Fin the Lethal Virtuoso",
    "bounty": 100,
    "defaultEmote": "hatSerious",
    "scene": "Fin plays an acoustic melody on his guitar while enemies fall around him.",
    "clueLink": "universe-lore.html#three-shades",
    "clueLinkText": "Read Fin Lethal Skills File",
    "clueDetails": "He is an unpredictably skilled fighter who can weaponize almost any object.",
    "question": "What makes Fin dangerous?",
    "options": [
      {
        "label": "A",
        "text": "He can kill using almost anything and has countless skills"
      },
      {
        "label": "B",
        "text": "He can awaken the Curse God"
      },
      {
        "label": "C",
        "text": "He controls the four Emperors"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Fin is dangerous because he can kill using almost anything and possesses countless deadly skills."
  }
];

  // Fisher-Yates Array Shuffle
  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  // Session State
  let sessionActive = [];       // Array of exactly 15 active cases
  let sessionReserve = [];      // Array of remaining 45 reserve cases for dynamic swaps
  let solvedSlotMap = {};       // Map of slot index (0..14) -> boolean
  let currentSlotIndex = 0;     // Active viewing slot index (0..14)
  let vaultBalance = 0;         // Persistent vault cash balance
  let isSwappingInProgress = false;

  function loadVaultBalance() {
    try {
      const saved = localStorage.getItem(STORAGE_BALANCE_KEY);
      if (saved !== null) {
        vaultBalance = parseInt(saved, 10) || 0;
      } else {
        vaultBalance = 0;
      }
    } catch (e) {
      console.warn('Unable to load vault balance', e);
      vaultBalance = 0;
    }
  }

  function saveVaultBalance() {
    try {
      localStorage.setItem(STORAGE_BALANCE_KEY, vaultBalance.toString());
    } catch (e) {
      console.warn('Unable to save vault balance', e);
    }
  }

  function initSession() {
    loadVaultBalance();
    const shuffledBank = shuffle(ALL_LORE_QUESTIONS);
    sessionActive = shuffledBank.slice(0, ACTIVE_SLOT_SIZE);
    sessionReserve = shuffledBank.slice(ACTIVE_SLOT_SIZE);
    solvedSlotMap = {};
    currentSlotIndex = 0;
    isSwappingInProgress = false;
  }

  function getSolvedCount() {
    return Object.values(solvedSlotMap).filter(Boolean).length;
  }

  function renderHUD() {
    const solvedEl = document.getElementById('hud-solved-count');
    const progText = document.getElementById('hud-progress-text');
    const fillEl = document.getElementById('hud-progress-fill');
    const walletEl = document.getElementById('hud-wallet-balance');

    const solved = getSolvedCount();
    const total = ACTIVE_SLOT_SIZE;
    const pct = Math.round((solved / total) * 100);

    if (solvedEl) solvedEl.textContent = solved + ' / ' + total;
    if (progText) progText.textContent = pct + '% Solved';
    if (fillEl) fillEl.style.width = pct + '%';
    if (walletEl) walletEl.textContent = '$' + vaultBalance;
  }

  function renderMystery(slotIndex, isSwapAnim) {
    if (slotIndex < 0 || slotIndex >= sessionActive.length) return;
    currentSlotIndex = slotIndex;

    const mystery = sessionActive[slotIndex];
    const isSolved = Boolean(solvedSlotMap[slotIndex]);

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
    const balloonBody = document.querySelector('.balloon-scroll-body');

    // Trigger visual swap pulse animation if just swapped
    if (isSwapAnim && balloonBody) {
      balloonBody.classList.remove('case-swapping');
      void balloonBody.offsetWidth;
      balloonBody.classList.add('case-swapping');
      setTimeout(() => {
        balloonBody.classList.remove('case-swapping');
      }, 500);
    }

    if (numEl) {
      numEl.innerHTML = '<span style="opacity: 0.8; font-size: 0.8em;">Slot ' + (slotIndex + 1) + '/' + ACTIVE_SLOT_SIZE + '</span> Case #' + mystery.id;
    }
    if (titleEl) {
      titleEl.textContent = mystery.title;
    }
    if (rewardEl) {
      rewardEl.innerHTML = '<i class="fa-solid fa-sack-dollar"></i> +$' + mystery.bounty;
    }
    
    if (statusEl) {
      if (isSolved) {
        statusEl.style.borderColor = '#2ecc71';
        statusEl.style.color = '#2ecc71';
        statusEl.style.background = 'rgba(46, 204, 113, 0.16)';
        statusEl.innerHTML = '<i class="fa-solid fa-circle-check"></i> Case Solved';
      } else {
        statusEl.style.borderColor = '#F6C75A';
        statusEl.style.color = '#FFF6D6';
        statusEl.style.background = 'rgba(246, 199, 90, 0.14)';
        statusEl.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> Investigation Active';
      }
    }

    if (sceneEl) {
      sceneEl.textContent = mystery.scene;
    }
    if (questionEl) {
      questionEl.textContent = mystery.question;
    }

    if (clueLinkDirect) {
      clueLinkDirect.innerHTML = '<a href="' + mystery.clueLink + '" target="_blank" class="clue-deep-link-btn" title="Open canonical lore dossier"><i class="fa-solid fa-book-open"></i> ' + mystery.clueLinkText + ' <i class="fa-solid fa-arrow-up-right-from-square"></i></a>';
    }

    if (feedbackEl) {
      feedbackEl.className = 'mystery-feedback-bar';
      if (isSolved) {
        feedbackEl.classList.add('success', 'show');
        feedbackEl.innerHTML = '<i class="fa-solid fa-circle-check"></i> <strong>Case Solved!</strong> ' + mystery.explanation;
      } else if (isSwapAnim) {
        feedbackEl.classList.add('show');
        feedbackEl.style.background = 'linear-gradient(135deg, rgba(246, 199, 90, 0.15), rgba(12, 10, 8, 0.9))';
        feedbackEl.style.border = '1.5px solid var(--color-gold-bright)';
        feedbackEl.style.color = '#FFF6D6';
        feedbackEl.innerHTML = '<span class="badge-swapped"><i class="fa-solid fa-arrows-rotate"></i> CASE REPLACED</span> <strong>New Case Drawn!</strong> Detective NJ swapped in Case #' + mystery.id + '. Give us your deduction!';
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
        btn.addEventListener('click', () => handleOptionClick(slotIndex, opt.label, btn));
        optionsContainer.appendChild(btn);
      });
    }

    // Update Clue Drawer Modal contents
    const modalTitle = document.getElementById('clue-modal-title');
    const modalBody = document.getElementById('clue-modal-body');
    const modalLink = document.getElementById('clue-modal-link-wrap');

    if (modalTitle) modalTitle.innerHTML = '<i class="fa-solid fa-folder-open"></i> Clue Dossier: Case #' + mystery.id + ' (' + mystery.category + ')';
    if (modalBody) modalBody.textContent = mystery.clueDetails;
    if (modalLink) {
      modalLink.innerHTML = '<a href="' + mystery.clueLink + '" target="_blank" class="btn btn-primary" style="margin-top: 1rem; display: inline-flex; align-items: center; gap: 0.5rem; background: linear-gradient(135deg, #FFF6D6 0%, #F6C75A 45%, #FFB300 100%); color: #000; font-weight: 800; padding: 0.75rem 1.5rem; border-radius: 10px; text-decoration: none;"><i class="fa-solid fa-book-open"></i> ' + mystery.clueLinkText + ' <i class="fa-solid fa-arrow-up-right-from-square"></i></a>';
    }

    renderArchives();
  }

  function handleOptionClick(slotIndex, chosenLabel, buttonElement) {
    if (isSwappingInProgress) return;

    const mystery = sessionActive[slotIndex];
    if (!mystery) return;

    const isAlreadySolved = Boolean(solvedSlotMap[slotIndex]);
    const feedbackEl = document.getElementById('active-mystery-feedback');
    const figureEl = document.getElementById('detective-nj-figure');
    const walletValEl = document.getElementById('hud-wallet-balance');

    // If answer is CORRECT
    if (chosenLabel === mystery.correctAnswer) {
      buttonElement.classList.add('correct');
      setDetectiveEmote('smirk');

      if (!isAlreadySolved) {
        solvedSlotMap[slotIndex] = true;
        vaultBalance += 100; // Award +$100 bounty cash
        saveVaultBalance();
        renderHUD();

        if (walletValEl) {
          walletValEl.classList.remove('bounty-gain', 'penalty-loss');
          void walletValEl.offsetWidth;
          walletValEl.classList.add('bounty-gain');
        }
      }

      if (figureEl) {
        figureEl.style.transform = 'scale(1.03) translateY(-4px)';
        setTimeout(() => {
          figureEl.style.transform = '';
        }, 1200);
      }

      if (feedbackEl) {
        feedbackEl.className = 'mystery-feedback-bar success show';
        feedbackEl.style.background = '';
        feedbackEl.style.border = '';
        feedbackEl.style.color = '';
        feedbackEl.innerHTML = '<i class="fa-solid fa-circle-check"></i> <strong>Spot On! Deduction Verified (+$100 Cash)</strong><p style="margin: 0.35rem 0 0 0; font-size: 0.92rem;">' + mystery.explanation + '</p>';
      }

      // Check if all 15 cases in this slot are solved
      if (getSolvedCount() === ACTIVE_SLOT_SIZE) {
        setTimeout(() => {
          if (feedbackEl) {
            feedbackEl.innerHTML = '<i class="fa-solid fa-trophy"></i> <strong>ALL 15 CASES IN THIS SESSION SOLVED!</strong> Grand Detective Master! You conquered this 15-case assignment with a bounty vault of $' + vaultBalance + '! Refresh anytime for a fresh 15-case assignment from the archives.';
          }
        }, 1800);
      } else {
        // Automatically proceed to next unsolved case
        setTimeout(() => {
          let nextUnsolved = -1;
          for (let i = 0; i < ACTIVE_SLOT_SIZE; i++) {
            const checkIdx = (slotIndex + 1 + i) % ACTIVE_SLOT_SIZE;
            if (!solvedSlotMap[checkIdx]) {
              nextUnsolved = checkIdx;
              break;
            }
          }
          if (nextUnsolved !== -1) {
            renderMystery(nextUnsolved);
          }
        }, 1500);
      }
    } 
    // If answer is WRONG -> Instant question swap with reserve pool!
    else {
      buttonElement.classList.add('wrong');
      setDetectiveEmote('serious');

      // Penalty: -$200 cash penalty (floor at 0)
      vaultBalance = Math.max(0, vaultBalance - 200);
      saveVaultBalance();
      renderHUD();

      if (walletValEl) {
        walletValEl.classList.remove('bounty-gain', 'penalty-loss');
        void walletValEl.offsetWidth;
        walletValEl.classList.add('penalty-loss');
      }

      if (figureEl) {
        figureEl.style.transform = 'rotate(-1.5deg)';
        setTimeout(() => {
          figureEl.style.transform = '';
        }, 800);
      }

      // Dynamic question swap if reserve questions remain
      if (sessionReserve.length > 0) {
        isSwappingInProgress = true;
        const failedCase = sessionActive[slotIndex];
        const replacementCase = sessionReserve.shift();
        sessionActive[slotIndex] = replacementCase;

        if (feedbackEl) {
          feedbackEl.className = 'mystery-feedback-bar error show';
          feedbackEl.style.background = '';
          feedbackEl.style.border = '';
          feedbackEl.style.color = '';
          feedbackEl.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> <strong>Incorrect Deduction (-$200 Penalty)!</strong> Case #' + failedCase.id + ' compromised! Detective NJ immediately swapped in Case #' + replacementCase.id + ' (' + replacementCase.title + ') from the archives!';
        }

        // Disable options during swap
        const optionBtns = document.querySelectorAll('.choice-btn');
        optionBtns.forEach(b => b.style.pointerEvents = 'none');

        setTimeout(() => {
          isSwappingInProgress = false;
          renderMystery(slotIndex, true /* isSwapAnim */);
        }, 1200);
      } else {
        // Fallback if reserve pool was completely depleted
        if (feedbackEl) {
          feedbackEl.className = 'mystery-feedback-bar error show';
          feedbackEl.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> <strong>Incorrect Deduction (-$200 Penalty).</strong> Inspect the Clue Drawer or read the lore dossier to verify!';
        }
        setTimeout(() => {
          buttonElement.classList.remove('wrong');
        }, 1200);
      }
    }
  }

  function renderArchives() {
    const grid = document.getElementById('case-archive-grid');
    if (!grid) return;

    grid.innerHTML = '';
    sessionActive.forEach((m, idx) => {
      const isSolved = Boolean(solvedSlotMap[idx]);
      const isActive = idx === currentSlotIndex;

      const card = document.createElement('div');
      card.className = 'case-archive-card ' + (isActive ? 'active ' : '') + (isSolved ? 'solved' : '');
      card.innerHTML = 
        '<div class="archive-card-status">' +
          '<span>SLOT #' + (idx + 1) + ' &bull; CASE #' + m.id + '</span>' +
          '<span style="color: ' + (isSolved ? '#2ecc71' : isActive ? '#F6C75A' : '#94A3B8') + ';">' + 
            (isSolved ? 'SOLVED (+$' + m.bounty + ')' : isActive ? 'INVESTIGATING' : 'ACTIVE') + 
          '</span>' +
        '</div>' +
        '<div class="archive-card-title">' + m.title + '</div>' +
        '<div style="font-size: 0.76rem; color: #94A3B8; margin-top: 0.35rem;">' + m.category + '</div>';

      card.addEventListener('click', () => {
        renderMystery(idx);
        const archivesModal = document.getElementById('archives-modal');
        if (archivesModal) archivesModal.classList.remove('active');
      });

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
        setDetectiveEmote('thinking');
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
        renderArchives();
        archivesModal.classList.add('active');
      });
    }

    const closeArchives = () => {
      if (archivesModal) archivesModal.classList.remove('active');
    };

    if (archivesClose) archivesClose.addEventListener('click', closeArchives);
    if (archivesBackdrop) archivesBackdrop.addEventListener('click', closeArchives);

    // Reset Progress & Reroll 15 Cases
    const resetBtn = document.getElementById('reset-progress-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset your Detective NJ bounty cash and roll a brand new 15-case assignment?')) {
          localStorage.removeItem(STORAGE_BALANCE_KEY);
          vaultBalance = 0;
          initSession();
          renderHUD();
          renderMystery(0);
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    preloadEmotes();
    initSession();
    renderHUD();
    renderMystery(0);
    initModals();
  });

})();
