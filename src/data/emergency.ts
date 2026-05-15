export interface Phrase {
  japanese: string
  reading: string
  english: string
}

export interface Embassy {
  country: string
  flag: string
  phone: string
  address: string
}

export interface NearbyCategory {
  title: string
  icon: string
  items: { name: string; address: string; phone: string; note?: string }[]
}

export interface EmergencyType {
  id: string
  title: string
  icon: string
  color: string
  bgColor: string
  number?: string
  numberLabel?: string
  description: string
  steps: string[]
  phrases: Phrase[]
  embassies?: Embassy[]
  nearbySections?: NearbyCategory[]
}

export const EMERGENCY_TYPES: EmergencyType[] = [
  {
    id: 'police',
    title: 'Police',
    icon: '🚓',
    color: '#1A5276',
    bgColor: '#EBF5FB',
    number: '110',
    numberLabel: 'Emergency Police',
    description: 'For theft, assault, traffic accidents, lost items, and suspicious activity.',
    steps: [
      'Call 110 (Police) from any phone — free of charge.',
      'Stay calm and speak slowly. An interpreter may be available.',
      'State your location clearly: city, nearest landmark, or address.',
      'Describe the incident briefly: what happened, how many people involved.',
      'Do not hang up until the operator tells you to.',
      'If a crime just occurred, do not touch or move anything at the scene.',
      'Wait at the scene unless it is dangerous to do so.',
    ],
    phrases: [
      { japanese: '警察を呼んでください', reading: 'Keisatsu wo yonde kudasai', english: 'Please call the police' },
      { japanese: '助けてください', reading: 'Tasukete kudasai', english: 'Please help me' },
      { japanese: '泥棒です', reading: 'Dorobou desu', english: 'There is a thief / I was robbed' },
      { japanese: '事故がありました', reading: 'Jiko ga arimashita', english: 'There has been an accident' },
      { japanese: '財布を盗まれました', reading: 'Saifu wo nusumaremashita', english: 'My wallet was stolen' },
      { japanese: '英語が話せる人はいますか', reading: 'Eigo ga hanaseru hito wa imasu ka', english: 'Is there anyone who speaks English?' },
      { japanese: 'ここはどこですか', reading: 'Koko wa doko desu ka', english: 'Where is this place?' },
    ],
  },
  {
    id: 'ambulance',
    title: 'Ambulance / Fire',
    icon: '🚑',
    color: '#922B21',
    bgColor: '#FDEDEC',
    number: '119',
    numberLabel: 'Ambulance & Fire',
    description: 'For medical emergencies, injuries, illness, and fires.',
    steps: [
      'Call 119 (Ambulance/Fire) from any phone — free of charge.',
      'Say "救急" (Kyuukyuu) for ambulance or "火事" (Kaji) for fire.',
      'Give your exact location: address, building name, floor, or nearby landmark.',
      'Describe the patient\'s condition: conscious? breathing? major bleeding?',
      'Stay on the line — the operator will guide you until help arrives.',
      'If possible, send someone to the building entrance to guide paramedics.',
      'Do not give food or water to an unconscious person.',
      'CPR: push hard and fast on the center of the chest (100-120 times/min).',
    ],
    phrases: [
      { japanese: '救急車を呼んでください', reading: 'Kyuukyuusha wo yonde kudasai', english: 'Please call an ambulance' },
      { japanese: '火事です', reading: 'Kaji desu', english: 'There is a fire' },
      { japanese: '意識がありません', reading: 'Ishiki ga arimasen', english: 'They are unconscious' },
      { japanese: '呼吸していません', reading: 'Kokyuu shite imasen', english: 'They are not breathing' },
      { japanese: 'たくさん出血しています', reading: 'Takusan shukketsu shite imasu', english: 'There is heavy bleeding' },
      { japanese: 'アレルギーがあります', reading: 'Arerugii ga arimasu', english: 'I have an allergy' },
      { japanese: '病院はどこですか', reading: 'Byouin wa doko desu ka', english: 'Where is the hospital?' },
    ],
  },
  {
    id: 'embassy',
    title: 'Embassy',
    icon: '🏛',
    color: '#1E8449',
    bgColor: '#EAFAF1',
    description: 'Contact your country\'s embassy or consulate for passport loss, arrest, or serious emergencies.',
    steps: [
      'Contact your embassy if your passport is lost or stolen.',
      'Embassies can assist if you are arrested or in serious legal trouble.',
      'They can help contact family in your home country.',
      'Embassies cannot pay your legal fees or get you out of jail.',
      'Register your trip with your country\'s travel advisory before visiting Japan.',
      'Keep the embassy number saved in your phone before traveling.',
      'Outside business hours, use the emergency line listed on the embassy website.',
    ],
    phrases: [
      { japanese: '大使館に連絡したいです', reading: 'Taishikan ni renraku shitai desu', english: 'I want to contact my embassy' },
      { japanese: 'パスポートをなくしました', reading: 'Pasupooto wo nakushimashita', english: 'I lost my passport' },
      { japanese: '逮捕されました', reading: 'Taiho saremashita', english: 'I have been arrested' },
      { japanese: '弁護士が必要です', reading: 'Bengoshi ga hitsuyou desu', english: 'I need a lawyer' },
    ],
    embassies: [
      { country: 'United States', flag: '🇺🇸', phone: '+81-3-3224-5000', address: '1-10-5 Akasaka, Minato-ku, Tokyo' },
      { country: 'United Kingdom', flag: '🇬🇧', phone: '+81-3-5211-1100', address: '1 Ichibancho, Chiyoda-ku, Tokyo' },
      { country: 'Australia',      flag: '🇦🇺', phone: '+81-3-5232-4111', address: '2-1-14 Mita, Minato-ku, Tokyo' },
      { country: 'Canada',         flag: '🇨🇦', phone: '+81-3-5412-6200', address: '7-3-38 Akasaka, Minato-ku, Tokyo' },
      { country: 'France',         flag: '🇫🇷', phone: '+81-3-5798-6000', address: '4-11-44 Minami-Azabu, Minato-ku, Tokyo' },
      { country: 'Germany',        flag: '🇩🇪', phone: '+81-3-5791-7700', address: '4-5-10 Minami-Azabu, Minato-ku, Tokyo' },
      { country: 'South Korea',    flag: '🇰🇷', phone: '+81-3-3452-7611', address: '1-2-5 Minami-Azabu, Minato-ku, Tokyo' },
      { country: 'China',          flag: '🇨🇳', phone: '+81-3-3403-3388', address: '3-4-33 Moto-Azabu, Minato-ku, Tokyo' },
      { country: 'India',          flag: '🇮🇳', phone: '+81-3-3262-2391', address: '2-2-11 Kudan-Minami, Chiyoda-ku, Tokyo' },
      { country: 'New Zealand',    flag: '🇳🇿', phone: '+81-3-3467-2271', address: '20-40 Kamiyamacho, Shibuya-ku, Tokyo' },
      { country: 'Singapore',      flag: '🇸🇬', phone: '+81-3-3586-9111', address: '5-12-3 Roppongi, Minato-ku, Tokyo' },
      { country: 'Thailand',       flag: '🇹🇭', phone: '+81-3-3441-1386', address: '3-14-6 Kami-Osaki, Shinagawa-ku, Tokyo' },
    ],
  },
  {
    id: 'disaster',
    title: 'Disaster',
    icon: '⛑',
    color: '#784212',
    bgColor: '#FEF9E7',
    description: 'Guidance for earthquakes, typhoons, tsunamis, and other natural disasters common in Japan.',
    steps: [
      '【EARTHQUAKE】 Drop, Cover, and Hold On. Get under a sturdy table or desk.',
      '【EARTHQUAKE】 Stay away from windows, bookshelves, and hanging objects.',
      '【EARTHQUAKE】 Do NOT use elevators. Use the stairs after shaking stops.',
      '【EARTHQUAKE】 If outside, move away from buildings, utility poles, and walls.',
      '【EARTHQUAKE】 Check for gas leaks after the shaking stops — open windows for ventilation.',
      '【TYPHOON】 Stay indoors. Avoid rivers, coastlines, and low-lying areas.',
      '【TYPHOON】 Follow instructions from local authorities and NHK World.',
      '【TSUNAMI】 If you feel a strong earthquake near the coast — move to high ground immediately.',
      '【TSUNAMI】 Do not wait for an official warning. Vertical evacuation to upper floors is acceptable.',
      '【ALL】 Install "Safety Tips" app (Japan Tourism Agency) for multilingual alerts.',
      '【ALL】 NHK World App provides English-language emergency broadcasts.',
      '【ALL】 Call 171 (Disaster Message Dial) to leave/check messages for family.',
    ],
    phrases: [
      { japanese: '地震です', reading: 'Jishin desu', english: 'There is an earthquake' },
      { japanese: '津波警報が出ています', reading: 'Tsunami keihou ga dete imasu', english: 'A tsunami warning has been issued' },
      { japanese: '火事です', reading: 'Kaji desu', english: 'There is a fire' },
      { japanese: '避難してください', reading: 'Hinan shite kudasai', english: 'Please evacuate' },
      { japanese: '避難場所はどこですか', reading: 'Hinanbasho wa doko desu ka', english: 'Where is the evacuation shelter?' },
      { japanese: 'けが人がいます', reading: 'Kejganin ga imasu', english: 'There are injured people' },
      { japanese: '助けを呼んでください', reading: 'Tasuke wo yonde kudasai', english: 'Please call for help' },
    ],
  },
]

export const NEARBY_SERVICES: NearbyCategory[] = [
  {
    title: 'Hospitals with English Support',
    icon: '🏥',
    items: [
      { name: 'St. Luke\'s International Hospital', address: '9-1 Akashi-cho, Chuo-ku, Tokyo', phone: '+81-3-5550-7166', note: '24h ER, English OK' },
      { name: 'Tokyo Medical and Surgical Clinic', address: '32 Shiba-koen, Minato-ku, Tokyo', phone: '+81-3-3436-3028', note: 'Multilingual' },
      { name: 'International Catholic Hospital', address: '2-5-1 Naka-Ochiai, Shinjuku-ku, Tokyo', phone: '+81-3-3951-1111', note: 'English OK' },
      { name: 'Osaka City General Medical Center', address: '2-13-22 Miyakojima-Hondori, Osaka', phone: '+81-6-6929-1221', note: '24h ER' },
      { name: 'Kyoto University Hospital', address: '54 Shogoin-Kawahara-cho, Sakyo-ku, Kyoto', phone: '+81-75-751-3111' },
    ],
  },
  {
    title: 'Pharmacy (Drugstores)',
    icon: '💊',
    items: [
      { name: 'Matsumoto Kiyoshi (nationwide)', address: 'Available at major train stations', phone: '—', note: 'Basic OTC medicine, some English labels' },
      { name: 'Welcia (nationwide)', address: 'Various locations', phone: '—', note: 'Larger selection, some English-speaking staff' },
      { name: 'American Pharmacy (Tokyo)', address: 'B1, Marunouchi My Plaza, Chiyoda-ku', phone: '+81-3-5220-7716', note: 'English-speaking staff, imported medicines' },
    ],
  },
  {
    title: 'Tourist Information',
    icon: 'ℹ️',
    items: [
      { name: 'JNTO Tourist Info Center Tokyo', address: '2F, Shin-Tokyo Bldg, 3-3-1 Marunouchi, Tokyo', phone: '+81-3-3201-3331', note: '9:00–17:00 weekdays' },
      { name: 'Kyoto Tourist Info Center', address: '2F, JR Kyoto Station', phone: '+81-75-343-0548' },
      { name: 'Osaka Tourism Info', address: '1F, JR Osaka Station', phone: '+81-6-6345-2189' },
      { name: 'Japan Visitor Hotline (24h)', address: '—', phone: '+81-50-3816-2787', note: 'Multilingual, 24 hours' },
    ],
  },
]
