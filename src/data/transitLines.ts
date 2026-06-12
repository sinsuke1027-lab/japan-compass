export type TransitLine = {
  id: string
  name_ja: string
  name_en: string
}

export type TransitStation = {
  id: string
  name_ja: string
  name_en: string
  lines: TransitLine[]
}

export type TransitCity = {
  id: string
  name_ja: string
  name_en: string
  stations: TransitStation[]
}

export const TRANSIT_PHRASE_TEMPLATES = [
  {
    id: 'where',
    title: 'Where is this line?',
    japanese: (line: string) => `${line}はどこですか？`,
    english: (line: string) => `Where is the ${line}?`,
  },
  {
    id: 'transfer',
    title: 'I want to transfer',
    japanese: (line: string) => `${line}に乗り換えたいのですが、どこですか？`,
    english: (line: string) => `I want to transfer to the ${line}. Where is it?`,
  },
  {
    id: 'platform',
    title: 'Which platform?',
    japanese: (line: string) => `${line}は何番線ですか？`,
    english: (line: string) => `Which platform number is the ${line}?`,
  },
  {
    id: 'board',
    title: 'Which side to board?',
    japanese: (line: string) => `${line}の電車はどちら側から乗りますか？`,
    english: (line: string) => `Which side do I board the ${line} train from?`,
  },
]

export const TRANSIT_CITIES: TransitCity[] = [
  {
    id: 'tokyo',
    name_ja: '東京',
    name_en: 'Tokyo',
    stations: [
      {
        id: 'shinjuku',
        name_ja: '新宿駅',
        name_en: 'Shinjuku',
        lines: [
          { id: 'jr-yamanote',       name_ja: 'JR山手線',             name_en: 'JR Yamanote Line' },
          { id: 'jr-chuo',           name_ja: 'JR中央線',             name_en: 'JR Chuo Line' },
          { id: 'jr-sobu',           name_ja: 'JR総武線',             name_en: 'JR Sobu Line' },
          { id: 'metro-marunouchi',  name_ja: '東京メトロ丸ノ内線',    name_en: 'Tokyo Metro Marunouchi Line' },
          { id: 'metro-shinjuku',    name_ja: '東京メトロ新宿線',      name_en: 'Toei Shinjuku Line' },
          { id: 'metro-fukutoshin',  name_ja: '東京メトロ副都心線',    name_en: 'Tokyo Metro Fukutoshin Line' },
          { id: 'keio',              name_ja: '京王線',               name_en: 'Keio Line' },
          { id: 'odakyu',            name_ja: '小田急線',             name_en: 'Odakyu Line' },
        ],
      },
      {
        id: 'shibuya',
        name_ja: '渋谷駅',
        name_en: 'Shibuya',
        lines: [
          { id: 'jr-yamanote',       name_ja: 'JR山手線',             name_en: 'JR Yamanote Line' },
          { id: 'jr-saikyo',         name_ja: 'JR埼京線',             name_en: 'JR Saikyo Line' },
          { id: 'metro-ginza',       name_ja: '東京メトロ銀座線',      name_en: 'Tokyo Metro Ginza Line' },
          { id: 'metro-hanzomon',    name_ja: '東京メトロ半蔵門線',    name_en: 'Tokyo Metro Hanzomon Line' },
          { id: 'metro-fukutoshin',  name_ja: '東京メトロ副都心線',    name_en: 'Tokyo Metro Fukutoshin Line' },
          { id: 'tokyu-toyoko',      name_ja: '東急東横線',           name_en: 'Tokyu Toyoko Line' },
          { id: 'tokyu-den-en',      name_ja: '東急田園都市線',       name_en: 'Tokyu Den-en-toshi Line' },
          { id: 'keio-inokashira',   name_ja: '京王井の頭線',         name_en: 'Keio Inokashira Line' },
        ],
      },
      {
        id: 'ikebukuro',
        name_ja: '池袋駅',
        name_en: 'Ikebukuro',
        lines: [
          { id: 'jr-yamanote',       name_ja: 'JR山手線',             name_en: 'JR Yamanote Line' },
          { id: 'jr-saikyo',         name_ja: 'JR埼京線',             name_en: 'JR Saikyo Line' },
          { id: 'metro-marunouchi',  name_ja: '東京メトロ丸ノ内線',    name_en: 'Tokyo Metro Marunouchi Line' },
          { id: 'metro-fukutoshin',  name_ja: '東京メトロ副都心線',    name_en: 'Tokyo Metro Fukutoshin Line' },
          { id: 'metro-yurakucho',   name_ja: '東京メトロ有楽町線',    name_en: 'Tokyo Metro Yurakucho Line' },
          { id: 'seibu-ikebukuro',   name_ja: '西武池袋線',           name_en: 'Seibu Ikebukuro Line' },
          { id: 'tobu-tojo',         name_ja: '東武東上線',           name_en: 'Tobu Tojo Line' },
        ],
      },
      {
        id: 'tokyo-st',
        name_ja: '東京駅',
        name_en: 'Tokyo Station',
        lines: [
          { id: 'jr-yamanote',       name_ja: 'JR山手線',             name_en: 'JR Yamanote Line' },
          { id: 'jr-chuo',           name_ja: 'JR中央線',             name_en: 'JR Chuo Line' },
          { id: 'jr-keihin',         name_ja: 'JR京浜東北線',         name_en: 'JR Keihin-Tohoku Line' },
          { id: 'shinkansen',        name_ja: '新幹線',               name_en: 'Shinkansen' },
          { id: 'metro-marunouchi',  name_ja: '東京メトロ丸ノ内線',    name_en: 'Tokyo Metro Marunouchi Line' },
          { id: 'metro-tozai',       name_ja: '東京メトロ東西線',      name_en: 'Tokyo Metro Tozai Line' },
        ],
      },
      {
        id: 'ueno',
        name_ja: '上野駅',
        name_en: 'Ueno',
        lines: [
          { id: 'jr-yamanote',       name_ja: 'JR山手線',             name_en: 'JR Yamanote Line' },
          { id: 'jr-keihin',         name_ja: 'JR京浜東北線',         name_en: 'JR Keihin-Tohoku Line' },
          { id: 'jr-utsunomiya',     name_ja: 'JR宇都宮線',           name_en: 'JR Utsunomiya Line' },
          { id: 'shinkansen',        name_ja: '新幹線',               name_en: 'Shinkansen' },
          { id: 'metro-ginza',       name_ja: '東京メトロ銀座線',      name_en: 'Tokyo Metro Ginza Line' },
          { id: 'metro-hibiya',      name_ja: '東京メトロ日比谷線',    name_en: 'Tokyo Metro Hibiya Line' },
          { id: 'keisei',            name_ja: '京成線',               name_en: 'Keisei Line' },
        ],
      },
      {
        id: 'shinagawa',
        name_ja: '品川駅',
        name_en: 'Shinagawa',
        lines: [
          { id: 'jr-yamanote',       name_ja: 'JR山手線',             name_en: 'JR Yamanote Line' },
          { id: 'jr-keihin',         name_ja: 'JR京浜東北線',         name_en: 'JR Keihin-Tohoku Line' },
          { id: 'shinkansen',        name_ja: '新幹線',               name_en: 'Shinkansen' },
          { id: 'keikyu',            name_ja: '京急線',               name_en: 'Keikyu Line' },
        ],
      },
    ],
  },
  {
    id: 'osaka',
    name_ja: '大阪',
    name_en: 'Osaka',
    stations: [
      {
        id: 'osaka-umeda',
        name_ja: '大阪・梅田駅',
        name_en: 'Osaka / Umeda',
        lines: [
          { id: 'jr-osaka-loop',     name_ja: 'JR大阪環状線',         name_en: 'JR Osaka Loop Line' },
          { id: 'osaka-midosuji',    name_ja: '大阪メトロ御堂筋線',    name_en: 'Osaka Metro Midosuji Line' },
          { id: 'osaka-tanimachi',   name_ja: '大阪メトロ谷町線',      name_en: 'Osaka Metro Tanimachi Line' },
          { id: 'osaka-yotsubashi',  name_ja: '大阪メトロ四つ橋線',    name_en: 'Osaka Metro Yotsubashi Line' },
          { id: 'hankyu-kobe',       name_ja: '阪急神戸線',           name_en: 'Hankyu Kobe Line' },
          { id: 'hankyu-kyoto',      name_ja: '阪急京都線',           name_en: 'Hankyu Kyoto Line' },
          { id: 'hanshin',           name_ja: '阪神電車',             name_en: 'Hanshin Line' },
        ],
      },
      {
        id: 'namba',
        name_ja: 'なんば駅',
        name_en: 'Namba',
        lines: [
          { id: 'osaka-midosuji',    name_ja: '大阪メトロ御堂筋線',    name_en: 'Osaka Metro Midosuji Line' },
          { id: 'osaka-sennichimae', name_ja: '大阪メトロ千日前線',    name_en: 'Osaka Metro Sennichimae Line' },
          { id: 'osaka-yotsubashi',  name_ja: '大阪メトロ四つ橋線',    name_en: 'Osaka Metro Yotsubashi Line' },
          { id: 'kintetsu',          name_ja: '近鉄線',               name_en: 'Kintetsu Line' },
          { id: 'nankai',            name_ja: '南海電車',             name_en: 'Nankai Line' },
        ],
      },
      {
        id: 'tennoji',
        name_ja: '天王寺駅',
        name_en: 'Tennoji',
        lines: [
          { id: 'jr-osaka-loop',     name_ja: 'JR大阪環状線',         name_en: 'JR Osaka Loop Line' },
          { id: 'jr-yamatoji',       name_ja: 'JR大和路線',           name_en: 'JR Yamatoji Line' },
          { id: 'osaka-midosuji',    name_ja: '大阪メトロ御堂筋線',    name_en: 'Osaka Metro Midosuji Line' },
          { id: 'osaka-tanimachi',   name_ja: '大阪メトロ谷町線',      name_en: 'Osaka Metro Tanimachi Line' },
          { id: 'kintetsu-minami',   name_ja: '近鉄南大阪線',         name_en: 'Kintetsu Minami-Osaka Line' },
        ],
      },
      {
        id: 'shin-osaka',
        name_ja: '新大阪駅',
        name_en: 'Shin-Osaka',
        lines: [
          { id: 'shinkansen',        name_ja: '新幹線',               name_en: 'Shinkansen' },
          { id: 'jr-osaka-loop',     name_ja: 'JR大阪環状線',         name_en: 'JR Osaka Loop Line' },
          { id: 'osaka-midosuji',    name_ja: '大阪メトロ御堂筋線',    name_en: 'Osaka Metro Midosuji Line' },
        ],
      },
    ],
  },
  {
    id: 'nagoya',
    name_ja: '名古屋',
    name_en: 'Nagoya',
    stations: [
      {
        id: 'nagoya-st',
        name_ja: '名古屋駅',
        name_en: 'Nagoya Station',
        lines: [
          { id: 'shinkansen',        name_ja: '新幹線',               name_en: 'Shinkansen' },
          { id: 'jr-tokaido',        name_ja: 'JR東海道線',           name_en: 'JR Tokaido Line' },
          { id: 'nagoya-higashiyama',name_ja: '名古屋市営地下鉄東山線', name_en: 'Nagoya Subway Higashiyama Line' },
          { id: 'nagoya-sakuradori', name_ja: '名古屋市営地下鉄桜通線', name_en: 'Nagoya Subway Sakura-dori Line' },
          { id: 'meitetsu',          name_ja: '名鉄線',               name_en: 'Meitetsu Line' },
          { id: 'kintetsu-nagoya',   name_ja: '近鉄名古屋線',         name_en: 'Kintetsu Nagoya Line' },
        ],
      },
      {
        id: 'sakae',
        name_ja: '栄駅',
        name_en: 'Sakae',
        lines: [
          { id: 'nagoya-higashiyama',name_ja: '名古屋市営地下鉄東山線', name_en: 'Nagoya Subway Higashiyama Line' },
          { id: 'nagoya-meijo',      name_ja: '名古屋市営地下鉄名城線', name_en: 'Nagoya Subway Meijo Line' },
        ],
      },
      {
        id: 'kanayama',
        name_ja: '金山駅',
        name_en: 'Kanayama',
        lines: [
          { id: 'jr-tokaido',        name_ja: 'JR東海道線',           name_en: 'JR Tokaido Line' },
          { id: 'meitetsu',          name_ja: '名鉄線',               name_en: 'Meitetsu Line' },
          { id: 'nagoya-meijo',      name_ja: '名古屋市営地下鉄名城線', name_en: 'Nagoya Subway Meijo Line' },
          { id: 'nagoya-meiko',      name_ja: '名古屋市営地下鉄名港線', name_en: 'Nagoya Subway Meiko Line' },
        ],
      },
    ],
  },
  {
    id: 'kyoto',
    name_ja: '京都',
    name_en: 'Kyoto',
    stations: [
      {
        id: 'kyoto-st',
        name_ja: '京都駅',
        name_en: 'Kyoto Station',
        lines: [
          { id: 'shinkansen',        name_ja: '新幹線',               name_en: 'Shinkansen' },
          { id: 'jr-tokaido',        name_ja: 'JR東海道線',           name_en: 'JR Tokaido Line' },
          { id: 'jr-sagano',         name_ja: 'JR嵯峨野線',           name_en: 'JR Sagano Line' },
          { id: 'kintetsu-kyoto',    name_ja: '近鉄京都線',           name_en: 'Kintetsu Kyoto Line' },
          { id: 'kyoto-karasuma',    name_ja: '京都市営地下鉄烏丸線',  name_en: 'Kyoto Subway Karasuma Line' },
        ],
      },
      {
        id: 'shijo',
        name_ja: '四条駅',
        name_en: 'Shijo',
        lines: [
          { id: 'kyoto-karasuma',    name_ja: '京都市営地下鉄烏丸線',  name_en: 'Kyoto Subway Karasuma Line' },
          { id: 'hankyu-kyoto',      name_ja: '阪急京都線',           name_en: 'Hankyu Kyoto Line' },
        ],
      },
      {
        id: 'sanjo',
        name_ja: '三条駅',
        name_en: 'Sanjo',
        lines: [
          { id: 'kyoto-tozai',       name_ja: '京都市営地下鉄東西線',  name_en: 'Kyoto Subway Tozai Line' },
          { id: 'keihan',            name_ja: '京阪電車',             name_en: 'Keihan Line' },
        ],
      },
    ],
  },
  {
    id: 'fukuoka',
    name_ja: '福岡',
    name_en: 'Fukuoka',
    stations: [
      {
        id: 'hakata',
        name_ja: '博多駅',
        name_en: 'Hakata',
        lines: [
          { id: 'shinkansen',        name_ja: '新幹線',               name_en: 'Shinkansen' },
          { id: 'jr-kagoshima',      name_ja: 'JR鹿児島本線',         name_en: 'JR Kagoshima Main Line' },
          { id: 'fukuoka-kuko',      name_ja: '福岡市営地下鉄空港線',  name_en: 'Fukuoka Subway Kuko Line' },
        ],
      },
      {
        id: 'tenjin',
        name_ja: '天神駅',
        name_en: 'Tenjin',
        lines: [
          { id: 'fukuoka-kuko',      name_ja: '福岡市営地下鉄空港線',  name_en: 'Fukuoka Subway Kuko Line' },
          { id: 'fukuoka-nanakuma',  name_ja: '福岡市営地下鉄七隈線',  name_en: 'Fukuoka Subway Nanakuma Line' },
          { id: 'nishitetsu',        name_ja: '西鉄天神大牟田線',      name_en: 'Nishitetsu Tenjin-Omuta Line' },
        ],
      },
      {
        id: 'fukuoka-airport',
        name_ja: '福岡空港駅',
        name_en: 'Fukuoka Airport',
        lines: [
          { id: 'fukuoka-kuko',      name_ja: '福岡市営地下鉄空港線',  name_en: 'Fukuoka Subway Kuko Line' },
        ],
      },
    ],
  },
  {
    id: 'sapporo',
    name_ja: '札幌',
    name_en: 'Sapporo',
    stations: [
      {
        id: 'sapporo-st',
        name_ja: '札幌駅',
        name_en: 'Sapporo Station',
        lines: [
          { id: 'jr-hakodate',       name_ja: 'JR函館本線',           name_en: 'JR Hakodate Main Line' },
          { id: 'sapporo-namboku',   name_ja: '札幌市営地下鉄南北線',  name_en: 'Sapporo Subway Namboku Line' },
          { id: 'sapporo-tozai',     name_ja: '札幌市営地下鉄東西線',  name_en: 'Sapporo Subway Tozai Line' },
          { id: 'sapporo-toho',      name_ja: '札幌市営地下鉄東豊線',  name_en: 'Sapporo Subway Toho Line' },
        ],
      },
      {
        id: 'odori',
        name_ja: '大通駅',
        name_en: 'Odori',
        lines: [
          { id: 'sapporo-namboku',   name_ja: '札幌市営地下鉄南北線',  name_en: 'Sapporo Subway Namboku Line' },
          { id: 'sapporo-tozai',     name_ja: '札幌市営地下鉄東西線',  name_en: 'Sapporo Subway Tozai Line' },
          { id: 'sapporo-toho',      name_ja: '札幌市営地下鉄東豊線',  name_en: 'Sapporo Subway Toho Line' },
        ],
      },
    ],
  },
]
