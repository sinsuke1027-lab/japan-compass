export interface ShrineStep {
  number: number
  emoji: string
  title: string
  body: string
}

export interface OsaisenCoin {
  amount: string
  reading: string
  meaning: string
  note: string
  lucky: boolean
}

export interface FortunLevel {
  kanji: string
  reading: string
  english: string
  description: string
  color: string
}

export interface ShrineSymbol {
  emoji: string
  name: string
  reading: string
  description: string
}

export interface Blessing {
  emoji: string
  type: string
  japanese: string
  reading: string
  description: string
}

export const SHRINE_STEPS: ShrineStep[] = [
  {
    number: 1,
    emoji: '⛩',
    title: 'Enter the Torii Gate',
    body: 'Bow once (一礼, ichrei) before passing through the torii gate. The center of the path is traditionally reserved for the deity — walk on the left or right side. The torii marks the transition from the ordinary world to the sacred.',
  },
  {
    number: 2,
    emoji: '💧',
    title: 'Purify at the Temizuya',
    body: 'At the stone water basin (手水舎), rinse both hands and your mouth:\n1. Take the ladle with your right hand, rinse your left hand.\n2. Transfer to your left hand, rinse your right hand.\n3. Pour water into your cupped left hand and rinse your mouth (do not drink).\n4. Rinse your left hand once more, then stand the ladle upright to rinse the handle.',
  },
  {
    number: 3,
    emoji: '🪙',
    title: 'Offer a Coin (Osaiseninfo)',
    body: 'Approach the offering box (賽銭箱, saisen-bako) and toss your coin gently — do not throw it hard. The amount has symbolic meaning (see the Osaiseninfo guide below). Sincerity matters more than the amount.',
  },
  {
    number: 4,
    emoji: '🔔',
    title: 'Ring the Bell',
    body: 'If a large bell rope (鈴緒, suzu-o) is present, shake it two or three times to announce your presence to the deity. The sound is said to purify the space and wake the kami (神, god).',
  },
  {
    number: 5,
    emoji: '🙏',
    title: 'Two Bows, Two Claps, One Bow (二礼二拍手一礼)',
    body: '1. Bow deeply twice (約90度, about 90°).\n2. Clap your hands twice — bring palms together, shift your right hand slightly lower, then clap clearly.\n3. Hold your hands together briefly and make your wish or offer a silent prayer.\n4. Bow deeply once more to conclude.\n\nNote: Buddhist temples use a different etiquette — clapping is not appropriate at most temples.',
  },
]

export const OSAISEN_COINS: OsaisenCoin[] = [
  {
    amount: '5円',
    reading: 'Go-en',
    meaning: 'ご縁 (Goen) — Good connection, destiny',
    note: '"Go-en" also means "fate" or "bond" in Japanese. Most popular offering.',
    lucky: true,
  },
  {
    amount: '25円',
    reading: 'Ni-juu-go-en',
    meaning: '二重のご縁 — Double good connection',
    note: '25 = 5×5, doubling the lucky "en" charm.',
    lucky: true,
  },
  {
    amount: '50円',
    reading: 'Go-juu-en',
    meaning: '五重のご縁 — Fivefold good connection',
    note: 'Five-yen connections. The hole in the coin symbolises "seeing through" to the future.',
    lucky: true,
  },
  {
    amount: '10円',
    reading: 'Juu-en',
    meaning: '遠縁 (Tooen) — Distant connection',
    note: '"Too-en" sounds like "distant fate" — considered unlucky by some.',
    lucky: false,
  },
  {
    amount: '500円',
    reading: 'Go-hyaku-en',
    meaning: '効果500倍？ — Effect × 500?',
    note: 'Generous but not traditionally symbolic. Any sincere offering is acceptable.',
    lucky: true,
  },
]

export const FORTUNE_LEVELS: FortunLevel[] = [
  { kanji: '大吉', reading: 'Daikichi',  english: 'Great Blessing',   description: 'The best fortune. Everything will go well.',         color: '#C0392B' },
  { kanji: '吉',   reading: 'Kichi',     english: 'Blessing',         description: 'Good fortune overall.',                             color: '#E67E22' },
  { kanji: '中吉', reading: 'Chukichi',  english: 'Middle Blessing',  description: 'Good fortune in some areas.',                       color: '#F39C12' },
  { kanji: '小吉', reading: 'Shokichi',  english: 'Small Blessing',   description: 'Minor good luck. Keep working hard.',               color: '#27AE60' },
  { kanji: '末吉', reading: 'Suekichi',  english: 'Future Blessing',  description: 'Luck will come later. Be patient.',                 color: '#2980B9' },
  { kanji: '凶',   reading: 'Kyo',       english: 'Bad Luck',         description: 'Unfavorable fortune. Tie it to a pine tree.',       color: '#7F8C8D' },
  { kanji: '大凶', reading: 'Daikyo',    english: 'Great Bad Luck',   description: 'Very unfavorable. Definitely tie it to the tree!',  color: '#5D6D7E' },
]

export const OMIKUJI_TIPS = [
  'Draw an omikuji (おみくじ) by shaking the numbered cylinder and pulling out a stick, or by selecting a folded paper.',
  'If you receive a bad fortune (凶/大凶), tie it to a pine tree (松, matsu) on the shrine grounds. "Matsu" also means "to wait" — leaving bad luck behind.',
  'Good fortune can also be tied to the tree to "attach" the luck to the shrine, or taken home.',
  'Omikuji predict fortune in areas like love, health, work, travel, and lost items.',
  'The paper is not permanent — it\'s a snapshot of your fortune today, not a fixed destiny.',
]

export const SHRINE_SYMBOLS: ShrineSymbol[] = [
  {
    emoji: '⛩',
    name: 'Torii Gate',
    reading: '鳥居 (Torii)',
    description: 'The iconic red gate marks the entrance to sacred shrine grounds. Passing through symbolises entering the realm of the kami.',
  },
  {
    emoji: '🦁',
    name: 'Komainu',
    reading: '狛犬 (Komainu)',
    description: 'A pair of guardian lion-dog statues flanking the entrance. One has its mouth open (saying "a"), the other closed (saying "un") — representing the beginning and end of all things.',
  },
  {
    emoji: '🪢',
    name: 'Shimenawa',
    reading: 'しめ縄 (Shimenawa)',
    description: 'Thick twisted straw ropes that mark sacred spaces, trees, and objects. Do not touch or pass under them.',
  },
  {
    emoji: '🎴',
    name: 'Ema',
    reading: '絵馬 (Ema)',
    description: 'Wooden plaques on which visitors write wishes and prayers. Hang them at the ema rack (絵馬掛け) to leave your wish at the shrine.',
  },
  {
    emoji: '🧧',
    name: 'Omamori',
    reading: 'お守り (Omamori)',
    description: 'Lucky charms sold at shrines for protection, love, health, or success. Keep them in your bag or on your person — do not open them.',
  },
  {
    emoji: '🌳',
    name: 'Goshinboku',
    reading: '御神木 (Goshinboku)',
    description: 'A sacred tree believed to be inhabited by a kami. Often wrapped with shimenawa. Treat with reverence — do not climb or carve.',
  },
  {
    emoji: '🪔',
    name: 'Toro (Stone Lantern)',
    reading: '燈籠 (Toro)',
    description: 'Stone lanterns lining the approach path. They symbolise offering light to the deity. Some are lit during festivals.',
  },
  {
    emoji: '📜',
    name: 'Ofuda',
    reading: 'お札 (Ofuda)',
    description: 'Sacred paper or wooden talismans inscribed with the name of the deity. Placed in the home on a kamidana (household shrine) for protection.',
  },
]

export const BLESSINGS: Blessing[] = [
  {
    emoji: '❤️',
    type: 'Love & Relationships',
    japanese: '縁結び',
    reading: 'En-musubi',
    description: 'Finding a partner, strengthening bonds, and good relationships. Famous shrines: Izumo Taisha, Meiji Jingu.',
  },
  {
    emoji: '📚',
    type: 'Exam & Academic Success',
    japanese: '合格祈願',
    reading: 'Goukaku kigan',
    description: 'Passing exams and achieving academic goals. Tenjin shrines (天満宮) dedicated to Sugawara Michizane are most popular.',
  },
  {
    emoji: '💼',
    type: 'Business Prosperity',
    japanese: '商売繁盛',
    reading: 'Shobai hanjou',
    description: 'Success in business and financial luck. Inari shrines (稲荷神社) with fox guardians are dedicated to commerce.',
  },
  {
    emoji: '💪',
    type: 'Health & Longevity',
    japanese: '健康祈願',
    reading: 'Kenkou kigan',
    description: 'Wishing for good health, recovery from illness, and long life.',
  },
  {
    emoji: '🚗',
    type: 'Traffic Safety',
    japanese: '交通安全',
    reading: 'Koutsuu anzen',
    description: 'Safe travels and accident prevention. Omamori for cars are commonly placed on the dashboard.',
  },
  {
    emoji: '🛡',
    type: 'Protection from Evil',
    japanese: '厄除け',
    reading: 'Yaku-yoke',
    description: 'Warding off misfortune, especially during unlucky years (厄年). Age 25, 42 for men; 19, 33 for women.',
  },
  {
    emoji: '🏠',
    type: 'Family Safety',
    japanese: '家内安全',
    reading: 'Kanai anzen',
    description: 'Protection and harmony for the whole household.',
  },
  {
    emoji: '👶',
    type: 'Fertility & Children',
    japanese: '子宝祈願',
    reading: 'Kodakara kigan',
    description: 'Blessing for pregnancy, safe childbirth, and healthy children.',
  },
]
