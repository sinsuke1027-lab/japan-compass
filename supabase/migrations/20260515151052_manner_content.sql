-- ============================================================
-- New categories for manners
-- ============================================================
insert into categories (slug, name_ja, name_en, icon, sort_order) values
  ('onsen',  '温泉',     'Onsen',         '♨️', 7),
  ('public', '公共場所', 'Public Spaces', '🏙', 8)
on conflict (slug) do nothing;

-- ============================================================
-- Manners — Transport (交通)
-- ============================================================
insert into manners (category_id, title_en, title_ja, body_en, body_ja, severity, sort_order)
select c.id, m.title_en, m.title_ja, m.body_en, m.body_ja, m.severity, m.sort_order
from categories c,
  (values
    ('Keep your phone on silent',
     '電話はマナーモードに',
     'Set your phone to silent or vibrate mode at all times on trains and buses.',
     '電車・バスでは常にマナーモードまたは振動設定にしてください。',
     'must', 1),
    ('Don''t make phone calls on trains',
     '電車内での通話禁止',
     'Making phone calls on local trains is considered very rude. Step off the train if you need to call.',
     'ローカル電車内での通話は非常に失礼にあたります。電話をする場合は電車を降りてください。',
     'must', 2),
    ('Offer priority seats to those in need',
     '優先席を譲る',
     'Priority seats (marked with stickers near the doors) are for elderly, pregnant women, people with disabilities, and passengers with young children.',
     '優先席（ドア付近のステッカーで表示）は高齢者・妊婦・障がい者・乳幼児連れの方のためのものです。',
     'must', 3),
    ('Keep your backpack in front during rush hours',
     'ラッシュ時はリュックを前に',
     'During crowded trains, wear your backpack on your front to avoid accidentally hitting other passengers.',
     '混雑した電車では、リュックを前に抱えることで他の乗客に当たらないようにしましょう。',
     'should', 4),
    ('Don''t eat or drink on local trains',
     'ローカル電車での飲食禁止',
     'Eating and drinking on local city trains is generally frowned upon. Shinkansen (bullet trains) are an exception.',
     'ローカル電車での飲食は一般的に好まれません。新幹線は例外です。',
     'should', 5),
    ('Stand on the left side of escalators in Tokyo',
     '東京ではエスカレーター左側に立つ',
     'In Tokyo, stand on the left and leave the right side open for those who want to walk. Note: Osaka is the opposite.',
     '東京ではエスカレーターの左側に立ち、右側は急ぐ人のために空けましょう。大阪は逆です。',
     'nice', 6),
    ('Validate your ticket before boarding',
     '乗車前に切符・ICカードを通す',
     'Always tap your IC card (Suica/Pasmo) or insert your paper ticket at the gate before boarding.',
     '乗車前は必ずICカード（Suica/Pasmo）をタッチするか、紙の切符を改札に通してください。',
     'must', 7)
  ) as m(title_en, title_ja, body_en, body_ja, severity, sort_order)
where c.slug = 'transport';

-- ============================================================
-- Manners — Food (食事)
-- ============================================================
insert into manners (category_id, title_en, title_ja, body_en, body_ja, severity, sort_order)
select c.id, m.title_en, m.title_ja, m.body_en, m.body_ja, m.severity, m.sort_order
from categories c,
  (values
    ('Don''t tip — it can be considered rude',
     'チップは渡さない',
     'Japan has no tipping culture. Leaving money on the table or pressing tips into staff''s hands can be confusing or even offensive.',
     '日本にはチップの文化がありません。テーブルにお金を置いたりスタッフに渡したりすることは、混乱や失礼にあたる場合があります。',
     'must', 1),
    ('Don''t stick chopsticks upright in rice',
     'ご飯に箸を立てない',
     'Sticking chopsticks upright into rice resembles a funeral offering and is considered very bad manners.',
     'ご飯に箸を立てることは葬儀の供え物を連想させ、非常に失礼とされています。',
     'must', 2),
    ('Don''t pass food chopstick-to-chopstick',
     '箸から箸に食べ物を渡さない',
     'This gesture is performed at funerals in Japan. Always place food on a plate before another person takes it.',
     'この所作は日本では葬儀で行われます。食べ物は必ず皿に置いてから別の人に取ってもらいましょう。',
     'must', 3),
    ('Say "Itadakimasu" before eating',
     '食事の前に「いただきます」',
     'This phrase expresses gratitude to everyone involved in preparing the meal — farmers, cooks, and the ingredients themselves.',
     'この言葉は農家・料理人・食材すべてに感謝を表す表現です。',
     'nice', 4),
    ('Say "Gochisousama deshita" after eating',
     '食後に「ごちそうさまでした」',
     'Saying this after your meal is a sign of appreciation and respect for the food and the people who made it.',
     '食後にこの言葉を言うことは、料理と作ってくれた人への感謝と敬意の表れです。',
     'nice', 5),
    ('Slurping noodles is perfectly acceptable',
     '麺をすすっても良い',
     'Unlike Western culture, slurping ramen, soba, and udon is not rude in Japan — it''s seen as a sign of enjoyment.',
     '欧米文化とは異なり、日本ではラーメン・そば・うどんをすすることは失礼ではなく、むしろ美味しいというサインです。',
     'nice', 6),
    ('Return trays and sort garbage at fast food restaurants',
     'ファストフードではトレーを片付ける',
     'At most fast food restaurants in Japan, customers are expected to return their trays and sort their garbage into the correct bins.',
     '日本のほとんどのファストフード店では、お客様自身がトレーを返却し、ゴミを正しく分別することが期待されています。',
     'should', 7)
  ) as m(title_en, title_ja, body_en, body_ja, severity, sort_order)
where c.slug = 'food';

-- ============================================================
-- Manners — Temple/Shrine (寺社仏閣)
-- ============================================================
insert into manners (category_id, title_en, title_ja, body_en, body_ja, severity, sort_order)
select c.id, m.title_en, m.title_ja, m.body_en, m.body_ja, m.severity, m.sort_order
from categories c,
  (values
    ('Purify your hands at the temizuya',
     '手水舎で手を清める',
     'Before entering the main hall, rinse both hands and your mouth at the stone water basin (temizuya) as a ritual purification.',
     '本殿に入る前に、手水舎（石の水盤）で両手と口をすすぎ、儀式的な清めを行います。',
     'should', 1),
    ('Bow before passing through the torii gate',
     '鳥居をくぐる前に一礼',
     'Bowing once before entering the torii gate shows respect for the sacred space you are about to enter.',
     '鳥居をくぐる前に一礼することで、これから入る神聖な空間への敬意を示します。',
     'nice', 2),
    ('Walk on the side of the approach path',
     '参道の端を歩く',
     'The center of the main approach path (sando) is traditionally reserved for the deity. Walk on the left or right side.',
     '参道の中央は神様のための道とされています。左右どちらかの端を歩きましょう。',
     'should', 3),
    ('Don''t touch sacred objects or shimenawa ropes',
     'しめ縄や神聖なものに触れない',
     'Sacred objects, shimenawa (twisted straw ropes), and shrine structures should not be touched by visitors.',
     'しめ縄などの神聖なものや社殿の構造物には触れないようにしましょう。',
     'must', 4),
    ('Keep voices low on shrine and temple grounds',
     '境内では静かに',
     'Maintain a quiet and respectful atmosphere inside shrine and temple grounds. Avoid loud conversations.',
     '神社・寺院の境内では、静かで敬虔な雰囲気を保ちましょう。大声での会話は避けてください。',
     'should', 5),
    ('Turn off flash when taking photos indoors',
     '屋内撮影はフラッシュ禁止',
     'Flash photography can damage art and sacred objects. Many temples prohibit photography inside entirely — look for signs.',
     'フラッシュは美術品や神聖なものを損傷させる可能性があります。寺院内では写真撮影自体が禁止の場合も多いです。サインを確認してください。',
     'must', 6)
  ) as m(title_en, title_ja, body_en, body_ja, severity, sort_order)
where c.slug = 'temple';

-- ============================================================
-- Manners — Onsen (温泉)
-- ============================================================
insert into manners (category_id, title_en, title_ja, body_en, body_ja, severity, sort_order)
select c.id, m.title_en, m.title_ja, m.body_en, m.body_ja, m.severity, m.sort_order
from categories c,
  (values
    ('Wash your body thoroughly before entering',
     '入浴前に体をよく洗う',
     'Always shower and wash your entire body at the shower stations before getting into the communal bath. This is mandatory.',
     '共同浴槽に入る前に、必ずシャワーで全身をよく洗ってください。これは必須のルールです。',
     'must', 1),
    ('Don''t wear swimwear unless the onsen specifies',
     '水着の着用禁止（指定がない限り）',
     'Traditional Japanese onsens require bathers to be fully nude. Swimwear is not allowed unless the facility explicitly permits it.',
     '日本の伝統的な温泉は全裸での入浴が必要です。施設が明示的に許可していない限り、水着は着用できません。',
     'must', 2),
    ('Keep your small towel out of the water',
     'タオルをお湯に入れない',
     'The small modesty towel can be placed on your head or set aside, but never in the bath water.',
     '小さなタオルは頭の上に置くか脇に置きましょう。絶対にお湯の中に入れないでください。',
     'must', 3),
    ('Don''t dunk your head or hair in the water',
     '頭や髪を湯船に入れない',
     'For hygiene reasons, keep your head and hair out of the bath water. Tie long hair up before entering.',
     '衛生上の理由から、頭や髪を湯船に入れないでください。長い髪は入浴前に束ねてください。',
     'must', 4),
    ('Check the tattoo policy before visiting',
     '入浴前に刺青ポリシーを確認',
     'Many traditional onsens prohibit visible tattoos. Check the facility''s policy in advance or look for tattoo-friendly onsens.',
     '多くの伝統的な温泉では刺青の見える方の入浴を断っています。事前に施設のポリシーを確認するか、刺青OKの温泉を探しましょう。',
     'should', 5),
    ('Don''t splash or swim in the onsen',
     '温泉で泳いだり水しぶきを立てない',
     'Onsens are places for quiet relaxation. Splashing, swimming, or loud behavior disturbs other bathers.',
     '温泉は静かにリラックスする場所です。水しぶきを立てたり泳いだり騒いだりすることは他の入浴者の迷惑になります。',
     'must', 6),
    ('Stay hydrated — drink water before and after',
     '水分補給を忘れずに',
     'Onsen water is hot and you will sweat. Drink water before and after bathing to stay hydrated.',
     '温泉は熱く、汗をかきます。入浴前後に水分をしっかり補給してください。',
     'should', 7)
  ) as m(title_en, title_ja, body_en, body_ja, severity, sort_order)
where c.slug = 'onsen';

-- ============================================================
-- Manners — Public Spaces (公共場所)
-- ============================================================
insert into manners (category_id, title_en, title_ja, body_en, body_ja, severity, sort_order)
select c.id, m.title_en, m.title_ja, m.body_en, m.body_ja, m.severity, m.sort_order
from categories c,
  (values
    ('Don''t litter — carry trash until you find a bin',
     'ゴミのポイ捨て禁止',
     'Japan has very few public trash bins. It''s normal to carry your garbage with you until you find a convenience store or designated bin.',
     '日本には公共のゴミ箱がほとんどありません。コンビニや指定のゴミ箱が見つかるまでゴミを持ち歩くのが普通です。',
     'must', 1),
    ('Sort your garbage correctly',
     'ゴミの分別を守る',
     'Japan has a strict garbage sorting system: burnable, non-burnable, plastic, glass, cans, cardboard. Always follow local rules.',
     '日本には厳格なゴミ分別制度があります：可燃・不燃・プラスチック・ガラス・缶・段ボール。必ず地域のルールに従ってください。',
     'must', 2),
    ('Don''t smoke outside designated areas',
     '指定喫煙所以外での喫煙禁止',
     'Smoking in public areas outside designated smoking zones is prohibited in most cities and can result in heavy fines.',
     'ほとんどの都市では、指定喫煙所以外での公共エリアでの喫煙は禁止されており、多額の罰金が科せられる場合があります。',
     'must', 3),
    ('Queue patiently and respect the line',
     '列は整然と並ぶ',
     'Japanese people queue very orderly. Never cut in line — it is considered extremely rude and disrespectful.',
     '日本人は非常に整然と列を作ります。割り込みは極めて失礼で無礼な行為とみなされます。絶対にしないでください。',
     'must', 4),
    ('Keep your voice down in public',
     '公共の場では静かに',
     'Loud conversations, music played without headphones, and boisterous behavior are frowned upon in most public spaces.',
     '大きな声での会話、ヘッドフォンなしでの音楽再生、騒がしい行動は、ほとんどの公共の場で好まれません。',
     'should', 5),
    ('Don''t eat while walking on the street',
     '歩きながら食べない',
     'Eating while walking is generally considered bad manners in Japan. Find a bench or designated eating area. Festival food stalls are an exception.',
     '日本では歩きながら食べることは一般的にマナー違反とされています。ベンチや指定の飲食エリアを探しましょう。屋台は例外です。',
     'should', 6)
  ) as m(title_en, title_ja, body_en, body_ja, severity, sort_order)
where c.slug = 'public';

-- ============================================================
-- Manners — Shopping (買い物)
-- ============================================================
insert into manners (category_id, title_en, title_ja, body_en, body_ja, severity, sort_order)
select c.id, m.title_en, m.title_ja, m.body_en, m.body_ja, m.severity, m.sort_order
from categories c,
  (values
    ('Don''t eat or drink before paying',
     '支払い前に食べない・飲まない',
     'Never consume products before paying at the register. This applies to supermarkets, convenience stores, and other shops.',
     'レジで支払いをする前に商品を食べたり飲んだりしないでください。スーパー、コンビニ、その他の店舗すべてに適用されます。',
     'must', 1),
    ('Don''t haggle at regular stores',
     '一般店舗での値引き交渉はしない',
     'Price negotiation is not a practice in Japanese retail stores. It is acceptable only at flea markets and some second-hand shops.',
     '日本の小売店では価格交渉は一般的ではありません。フリーマーケットや一部の中古品店でのみ許容されます。',
     'must', 2),
    ('Receive items with two hands',
     '両手でものを受け取る',
     'When receiving a product, business card, or change from a cashier, using both hands shows respect and appreciation.',
     '商品・名刺・お釣りをレジ係から受け取る際は、両手で受け取ることで敬意と感謝を示します。',
     'nice', 3),
    ('Bring your own eco bag',
     'エコバッグを持参する',
     'Since 2020, plastic shopping bags cost extra at most Japanese stores. Bringing your own bag is both eco-friendly and saves money.',
     '2020年以降、ほとんどの日本の店舗でレジ袋は有料です。自分でバッグを持参することはエコにも節約にもなります。',
     'should', 4),
    ('IC cards work at convenience stores',
     'コンビニでICカードが使える',
     'Suica, Pasmo, and other IC transit cards can be used for payment at most convenience stores and many restaurants.',
     'Suica・Pasmo等のICカードは、ほとんどのコンビニや多くのレストランで支払いに使えます。',
     'nice', 5),
    ('"Mite iru dake" means "just looking"',
     '「見ているだけです」と言える',
     'If a shop staff approaches you and you don''t need help, say "Mite iru dake desu" (見ているだけです) — "I''m just looking, thank you."',
     'スタッフが近づいてきてサポートが必要ない場合は「見ているだけです」と言えば丁寧に断ることができます。',
     'nice', 6)
  ) as m(title_en, title_ja, body_en, body_ja, severity, sort_order)
where c.slug = 'shopping';
