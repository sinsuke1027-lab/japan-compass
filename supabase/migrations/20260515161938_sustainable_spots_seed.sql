-- Seed data for sustainable_spots
-- Tokyo / Kyoto / Osaka — real coordinates

insert into sustainable_spots (category_id, name_ja, name_en, description_ja, description_en, location, address_ja, address_en, tags)
select c.id, v.name_ja, v.name_en, v.description_ja, v.description_en,
       st_point(v.lng, v.lat)::geography, v.address_ja, v.address_en, v.tags
from (values
  -- ── TOKYO / TEMPLE ────────────────────────────────────────────────
  ('temple', '明治神宮',       'Meiji Shrine',
   '都心に広がる鎮守の森。自然と歴史が調和した都市型の聖地。',
   'A serene forested shrine in the heart of Tokyo, dedicated to Emperor Meiji.',
   139.6993, 35.6763, '東京都渋谷区代々木神園町1-1', '1-1 Yoyogi Kamizonocho, Shibuya, Tokyo',
   ARRAY['shrine','forest','heritage','free']::text[]),

  ('temple', '浅草寺',         'Senso-ji Temple',
   '東京最古の仏教寺院。雷門・仲見世通りで有名。',
   'Tokyo''s oldest Buddhist temple, famed for its Kaminarimon gate and Nakamise market.',
   139.7966, 35.7147, '東京都台東区浅草2-3-1', '2-3-1 Asakusa, Taito, Tokyo',
   ARRAY['temple','heritage','market','free']::text[]),

  ('temple', '根津神社',       'Nezu Shrine',
   '文京区に佇む静かな神社。ツツジまつりが有名。',
   'A tranquil shrine in Bunkyo-ku, known for its spectacular azalea festival each spring.',
   139.7629, 35.7208, '東京都文京区根津1-28-9', '1-28-9 Nezu, Bunkyo, Tokyo',
   ARRAY['shrine','garden','seasonal','free']::text[]),

  -- ── TOKYO / ECO ───────────────────────────────────────────────────
  ('eco', '浜離宮恩賜庭園',   'Hamarikyu Gardens',
   '東京湾に面した潮入りの池をもつ特別名勝の庭園。',
   'Historic tidal garden with seawater ponds along Tokyo Bay.',
   139.7638, 35.6571, '東京都中央区浜離宮庭園1-1', '1-1 Hamarikyu-teien, Chuo, Tokyo',
   ARRAY['garden','nature','heritage']::text[]),

  ('eco', '代々木公園',        'Yoyogi Park',
   'ファーマーズマーケットや環境イベントが定期開催される都市公園。',
   'Large urban park hosting weekly farmers'' markets and eco events.',
   139.6953, 35.6714, '東京都渋谷区代々木神園町2-1', '2-1 Yoyogi Kamizonocho, Shibuya, Tokyo',
   ARRAY['park','market','events','free']::text[]),

  -- ── TOKYO / FOOD ──────────────────────────────────────────────────
  ('food', '谷中銀座商店街',   'Yanaka Ginza Market',
   '昭和の面影が残るレトロな商店街。地元食材や惣菜が揃う。',
   'A retro shotengai market street preserving old Tokyo charm, with local produce and deli foods.',
   139.7706, 35.7267, '東京都台東区谷中3-13-1', '3-13-1 Yanaka, Taito, Tokyo',
   ARRAY['market','local food','retro','free']::text[]),

  ('food', '東京ファーマーズマーケット', 'Tokyo Farmers'' Market',
   '国連大学前で週末開催。有機野菜・クラフトフードが集まる。',
   'Weekend organic market in front of the United Nations University in Aoyama.',
   139.7133, 35.6635, '東京都渋谷区神宮前5-53-70', '5-53-70 Jingumae, Shibuya, Tokyo',
   ARRAY['organic','market','weekend','local food']::text[]),

  -- ── TOKYO / SHOPPING ──────────────────────────────────────────────
  ('shopping', 'ロフト 渋谷本店', 'Loft Shibuya',
   'エコ・サステナブル雑貨・文房具を豊富に取り揃えるライフスタイルショップ。',
   'Lifestyle store with a wide selection of eco-friendly goods and stationery.',
   139.7017, 35.6598, '東京都渋谷区宇田川町21-1', '21-1 Udagawacho, Shibuya, Tokyo',
   ARRAY['eco goods','lifestyle','shopping']::text[]),

  -- ── KYOTO / TEMPLE ───────────────────────────────────────────────
  ('temple', '伏見稲荷大社',   'Fushimi Inari Taisha',
   '千本鳥居で有名。稲荷山全体が境内の巨大神社。',
   'Famous for its thousands of vermilion torii gates winding up Mount Inari.',
   135.7727, 34.9671, '京都府京都市伏見区深草薮之内町68', '68 Fukakusa Yabunouchi, Fushimi, Kyoto',
   ARRAY['shrine','torii','hiking','free']::text[]),

  ('temple', '金閣寺（鹿苑寺）', 'Kinkaku-ji (Golden Pavilion)',
   '金箔に覆われた舎利殿が鏡湖池に映える世界遺産。',
   'UNESCO World Heritage site — a golden pavilion reflected in the Mirror Pond.',
   135.7292, 35.0394, '京都府京都市北区金閣寺町1', '1 Kinkakuji-cho, Kita, Kyoto',
   ARRAY['temple','UNESCO','heritage','garden']::text[]),

  ('temple', '嵐山竹林',        'Arashiyama Bamboo Grove',
   '天龍寺北門から続く幻想的な竹林の小径。早朝がおすすめ。',
   'Enchanting bamboo path leading from Tenryu-ji. Best visited at dawn.',
   135.6729, 35.0095, '京都府京都市右京区嵯峨天龍寺芒ノ馬場町', 'Sagatenryuji Susukinobabacho, Ukyo, Kyoto',
   ARRAY['nature','bamboo','heritage','free']::text[]),

  -- ── KYOTO / ECO ──────────────────────────────────────────────────
  ('eco', '京都府立植物園',    'Kyoto Botanical Garden',
   '大正13年開園の日本最古の公立植物園。温室・竹林・梅林など多彩。',
   'Japan''s oldest public botanical garden, opened in 1924, featuring greenhouses and bamboo groves.',
   135.7577, 35.0543, '京都府京都市左京区下鴨半木町', 'Shimogamo Nakagicho, Sakyo, Kyoto',
   ARRAY['garden','nature','education']::text[]),

  -- ── KYOTO / FOOD ─────────────────────────────────────────────────
  ('food', '錦市場',            'Nishiki Market',
   '京の台所。新鮮な京野菜・豆腐・漬物が軒を連ねる400年の歴史を持つ市場。',
   'Kyoto''s Kitchen — a 400-year-old covered market packed with fresh tofu, pickles, and local produce.',
   135.7695, 35.0053, '京都府京都市中京区錦小路通', 'Nishikikoji, Nakagyo, Kyoto',
   ARRAY['market','local food','heritage','covered']::text[]),

  -- ── OSAKA / TEMPLE ───────────────────────────────────────────────
  ('temple', '住吉大社',        'Sumiyoshi Taisha',
   '全国に約2300社ある住吉神社の総本社。独特の住吉造建築が見どころ。',
   'Head shrine of 2,300 Sumiyoshi shrines nationwide, featuring the distinctive Sumiyoshi architectural style.',
   135.4927, 34.6130, '大阪府大阪市住吉区住吉2-9-89', '2-9-89 Sumiyoshi, Sumiyoshi, Osaka',
   ARRAY['shrine','architecture','heritage','free']::text[]),

  ('temple', '四天王寺',        'Shitennoji Temple',
   '593年創建、日本最古の官立寺院のひとつ。中心伽藍は圧巻。',
   'One of Japan''s oldest state-built temples, founded in 593 CE. The central precincts are awe-inspiring.',
   135.5162, 34.6547, '大阪府大阪市天王寺区四天王寺1-11-18', '1-11-18 Shitennoji, Tennoji, Osaka',
   ARRAY['temple','heritage','history']::text[]),

  -- ── OSAKA / ECO ──────────────────────────────────────────────────
  ('eco', '大阪城公園',         'Osaka Castle Park',
   '天守閣を囲む広大な公園。緑地保全と市民の憩いの場が共存。',
   'Vast park surrounding Osaka Castle, blending green conservation with public recreation.',
   135.5260, 34.6873, '大阪府大阪市中央区大阪城1-1', '1-1 Osakajo, Chuo, Osaka',
   ARRAY['park','castle','nature','free']::text[]),

  -- ── OSAKA / FOOD ─────────────────────────────────────────────────
  ('food', '黒門市場',          'Kuromon Ichiba Market',
   '「大阪の台所」。新鮮な海産物・野菜・惣菜が揃う活気ある市場。',
   'Osaka''s Kitchen — a lively covered market famous for fresh seafood, vegetables, and street snacks.',
   135.5060, 34.6655, '大阪府大阪市中央区日本橋2-4-1', '2-4-1 Nipponbashi, Chuo, Osaka',
   ARRAY['market','seafood','local food','covered']::text[]),

  -- ── OSAKA / SHOPPING ─────────────────────────────────────────────
  ('shopping', 'ナチュラルハウス 梅田', 'Natural House Umeda',
   'オーガニック食品・エコ雑貨を扱うナチュラルライフスタイルショップ。',
   'Natural lifestyle shop stocking organic foods and eco-friendly household goods.',
   135.5005, 34.7035, '大阪府大阪市北区角田町8-7', '8-7 Kakudacho, Kita, Osaka',
   ARRAY['organic','eco goods','lifestyle']::text[])

) as v(slug, name_ja, name_en, description_ja, description_en, lng, lat, address_ja, address_en, tags)
join categories c on c.slug = v.slug;
