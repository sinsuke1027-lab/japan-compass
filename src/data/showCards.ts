export type ShowCategory = {
  id: string
  label: string
  icon: string
  color: string
  cards: ShowCard[]
}

export type ShowCard = {
  id: string
  title: string
  japanese: string
  english: string
}

export type Allergen = {
  id: string
  japanese: string
  english: string
}

export const ALLERGENS: Allergen[] = [
  { id: 'egg',       japanese: '卵',     english: 'Egg' },
  { id: 'dairy',     japanese: '乳製品', english: 'Dairy' },
  { id: 'wheat',     japanese: '小麦',   english: 'Wheat/Gluten' },
  { id: 'shrimp',    japanese: 'えび',   english: 'Shrimp' },
  { id: 'crab',      japanese: 'かに',   english: 'Crab' },
  { id: 'peanut',    japanese: '落花生', english: 'Peanuts' },
  { id: 'buckwheat', japanese: 'そば',   english: 'Buckwheat/Soba' },
  { id: 'soy',       japanese: '大豆',   english: 'Soy' },
]

export function buildAllergenCard(selected: Allergen[]): ShowCard {
  const jp = selected.map(a => a.japanese).join('・')
  const en = selected.map(a => a.english).join(', ')
  return {
    id: 'allergen-custom',
    title: 'Allergen Alert',
    japanese: `私は${jp}アレルギーがあります。\nこれらが入っていない料理はありますか？`,
    english: `I am allergic to ${en}.\nDo you have dishes without these?`,
  }
}

export const SHOW_CATEGORIES: ShowCategory[] = [
  {
    id: 'food',
    label: 'Food',
    icon: '🍽',
    color: '#2C6E49',
    cards: [
      {
        id: 'food-vegetarian',
        title: 'Vegetarian',
        japanese: 'ベジタリアンです。\n肉・魚が入っていないものはありますか？',
        english: 'I am vegetarian.\nDo you have dishes without meat or fish?',
      },
      {
        id: 'food-vegan',
        title: 'Vegan',
        japanese: 'ヴィーガンです。\n肉・魚・卵・乳製品が入っていないものはありますか？',
        english: 'I am vegan.\nDo you have dishes without meat, fish, eggs, or dairy?',
      },
      {
        id: 'food-nospicy',
        title: 'No Spicy Food',
        japanese: '辛いものは食べられません。\n辛くないものはありますか？',
        english: 'I cannot eat spicy food.\nDo you have non-spicy options?',
      },
      {
        id: 'food-halal',
        title: 'Halal',
        japanese: 'ハラール食しか食べられません。\nハラール対応のメニューはありますか？',
        english: 'I can only eat halal food.\nDo you have halal options?',
      },
    ],
  },
  {
    id: 'health',
    label: 'Health',
    icon: '🏥',
    color: '#C8392B',
    cards: [
      {
        id: 'health-sick',
        title: 'I Feel Sick',
        japanese: '気分が悪いです。\n助けてください。',
        english: 'I feel sick.\nPlease help me.',
      },
      {
        id: 'health-ambulance',
        title: 'Call Ambulance',
        japanese: '救急車を呼んでください。\n電話番号は119です。',
        english: 'Please call an ambulance.\nThe number is 119.',
      },
      {
        id: 'health-pharmacy',
        title: 'Need Medicine',
        japanese: '薬が必要です。\n近くに薬局はありますか？',
        english: 'I need medicine.\nIs there a pharmacy nearby?',
      },
      {
        id: 'health-hospital',
        title: 'Need a Hospital',
        japanese: '病院に行く必要があります。\n近くの病院に連れて行ってもらえますか？',
        english: 'I need to go to a hospital.\nCould you take me to the nearest one?',
      },
      {
        id: 'health-dizzy',
        title: 'Feeling Dizzy',
        japanese: 'めまいがします。\n少し休む場所はありますか？',
        english: 'I feel dizzy.\nIs there a place where I can rest?',
      },
    ],
  },
  {
    id: 'transport',
    label: 'Transport',
    icon: '🚉',
    color: '#1A5276',
    cards: [
      {
        id: 'transport-lost',
        title: 'I Am Lost',
        japanese: '道に迷いました。\n助けてもらえますか？',
        english: 'I am lost.\nCould you help me?',
      },
      {
        id: 'transport-ticket',
        title: 'How to Buy a Ticket',
        japanese: '切符の買い方を教えてもらえますか？',
        english: 'Could you show me how to buy a ticket?',
      },
      {
        id: 'transport-exit',
        title: 'Which Exit?',
        japanese: 'どの出口を使えばよいですか？\n地図を見せてもらえますか？',
        english: 'Which exit should I take?\nCould you show me on a map?',
      },
      {
        id: 'transport-luggage',
        title: 'Luggage Storage',
        japanese: '荷物を預けたいのですが、\nコインロッカーはどこですか？',
        english: 'I want to store my luggage.\nWhere are the coin lockers?',
      },
      {
        id: 'transport-taxi',
        title: 'Call a Taxi',
        japanese: 'タクシーを呼んでもらえますか？',
        english: 'Could you call a taxi for me?',
      },
    ],
  },
  {
    id: 'payment',
    label: 'Payment',
    icon: '💳',
    color: '#6C3483',
    cards: [
      {
        id: 'payment-card',
        title: 'Credit Card?',
        japanese: 'クレジットカードは使えますか？',
        english: 'Do you accept credit cards?',
      },
      {
        id: 'payment-ic',
        title: 'IC Card (Suica)?',
        japanese: 'ICカード（Suica・Pasmo）は使えますか？',
        english: 'Do you accept IC cards (Suica / Pasmo)?',
      },
      {
        id: 'payment-cash',
        title: 'Cash Only?',
        japanese: '現金のみですか？\nATMはどこですか？',
        english: 'Is it cash only?\nWhere is the nearest ATM?',
      },
      {
        id: 'payment-receipt',
        title: 'Receipt Please',
        japanese: 'レシートをもらえますか？',
        english: 'Could I have a receipt please?',
      },
    ],
  },
]
