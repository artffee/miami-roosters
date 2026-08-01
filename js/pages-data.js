/*
  This deck is the whole coloring book. To add a card:
  1. Drop the image into assets/pages/ (jpg/png/svg all work)
  2. Add an entry to PAGES below.
     - kind: "page"  -> a blank line-art page, meant to be printed and colored
     - kind: "art"   -> a fully rendered/finished illustration (gallery piece)
     - suit: one of the SUITS keys below (controls filter pill + sort order)
     - rank: "A","2"..."10","J","Q","K","Joker","Bonus" (controls sort + corner index)
  Everything else (viewer, archive, filters, download, print) reads from this list.
*/

const SUITS = [
  { key: "space",    label: "Space",    symbol: "⨂", accent: "#22e0ff" }, // reskinned spades
  { key: "hearts",   label: "Hearts",   symbol: "♥", accent: "#ff2e6a" },
  { key: "diamonds", label: "Diamonds", symbol: "♦", accent: "#ff5c8a" },
  { key: "clubs",    label: "Clubs",    symbol: "♣", accent: "#b6ff3c" },
  { key: "joker",    label: "Jokers",   symbol: "★", accent: "#ffd93d" },
  { key: "bonus",    label: "Bonus",    symbol: "✧", accent: "#b06bff" }
];

const RANK_ORDER = ["A","2","3","4","5","6","7","8","9","10","J","Q","K","Joker","Bonus"];

const PAGES = [
  {
    id: 1,
    title: "Ace of Space",
    suit: "space",
    rank: "A",
    kind: "art",
    file: "assets/pages/ace-of-space.png"
  },
  {
    id: 2,
    title: "Ace of Clubs",
    suit: "clubs",
    rank: "A",
    kind: "art",
    file: "assets/pages/ace-of-clubs.png"
  },
  {
    id: 3,
    title: "Jack of Diamonds",
    suit: "diamonds",
    rank: "J",
    kind: "art",
    file: "assets/pages/jack-of-diamonds.png"
  },
  {
    id: 4,
    title: "King of Hearts",
    suit: "hearts",
    rank: "K",
    kind: "art",
    file: "assets/pages/king-of-hearts.png"
  },
  {
    id: 5,
    title: "Joker — The Navigator",
    suit: "joker",
    rank: "Joker",
    kind: "art",
    file: "assets/pages/joker-navigator.png"
  },
  {
    id: 6,
    title: "Joker — The Maestro",
    suit: "joker",
    rank: "Joker",
    kind: "art",
    file: "assets/pages/joker-maestro.png"
  },
  {
    id: 7,
    title: "Joker's Court",
    suit: "joker",
    rank: "Joker",
    kind: "page",
    file: "assets/pages/joker-gator-court-lineart.png"
  },
  {
    id: 8,
    title: "Scales of the Skyline",
    suit: "bonus",
    rank: "Bonus",
    kind: "page",
    file: "assets/pages/bonus-libra-skyline-lineart.png"
  }
];
