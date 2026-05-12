-- ============================================================
-- Master data seed
-- ============================================================

-- categories
insert into categories (slug, name_ja, name_en, icon, sort_order) values
  ('temple',      '寺社仏閣',   'Shrines & Temples', '⛩',  1),
  ('eco',         'エコ活動',   'Eco Activities',    '♻️', 2),
  ('food',        'フード',     'Food',              '🍱', 3),
  ('transport',   '交通',       'Transport',         '🚃', 4),
  ('shopping',    '買い物',     'Shopping',          '🛍', 5),
  ('emergency',   '緊急',       'Emergency',         '🚨', 6);

-- phrase_categories
insert into phrase_categories (slug, name_ja, name_en, icon, sort_order) values
  ('greeting',    '挨拶',       'Greetings',         '👋', 1),
  ('dining',      '食事',       'Dining',            '🍜', 2),
  ('transport',   '交通',       'Transport',         '🚃', 3),
  ('shopping',    '買い物',     'Shopping',          '🛒', 4),
  ('emergency',   '緊急',       'Emergency',         '🚨', 5);

-- shrine_steps
insert into shrine_steps (step_number, title_ja, title_en, body_ja, body_en) values
  (1, '鳥居をくぐる',       'Enter the Torii Gate',
     '鳥居の前で一礼してからくぐります。中央（正中）はなるべく避けましょう。',
     'Bow once before entering. Avoid walking in the very center of the gate.'),
  (2, '手水舎で手を清める',  'Purify at the Temizuya',
     '右手・左手の順に水をかけ、最後に口をすすぎます。',
     'Rinse right hand, then left hand, then rinse your mouth.'),
  (3, 'お賽銭を入れる',      'Offer a Coin',
     'お賽銭箱に静かにお金を入れます（投げ入れないように）。',
     'Gently place your coin in the offering box — do not throw it.'),
  (4, '鈴を鳴らす',          'Ring the Bell',
     '鈴を振り鳴らして神様にお知らせします。',
     'Shake the bell to announce your presence to the deity.'),
  (5, '二礼二拍手一礼',      'Two Bows, Two Claps, One Bow',
     '深いお辞儀を2回、拍手を2回、最後にもう1回お辞儀をします。',
     'Bow deeply twice, clap twice, then bow once more.');

-- phrases (greeting)
insert into phrases (phrase_category_id, japanese, reading, english, sort_order)
select pc.id, p.japanese, p.reading, p.english, p.sort_order
from phrase_categories pc,
  (values
    ('こんにちは',         'Konnichiwa',   'Hello',               1),
    ('ありがとうございます', 'Arigatou gozaimasu', 'Thank you very much', 2),
    ('すみません',         'Sumimasen',    'Excuse me / Sorry',   3),
    ('はい',               'Hai',          'Yes',                 4),
    ('いいえ',             'Iie',          'No',                  5)
  ) as p(japanese, reading, english, sort_order)
where pc.slug = 'greeting';

-- phrases (dining)
insert into phrases (phrase_category_id, japanese, reading, english, sort_order)
select pc.id, p.japanese, p.reading, p.english, p.sort_order
from phrase_categories pc,
  (values
    ('いただきます',       'Itadakimasu',  'Let''s eat (before meals)', 1),
    ('ごちそうさまでした', 'Gochisousama deshita', 'Thank you for the meal', 2),
    ('おすすめは何ですか', 'Osusume wa nan desu ka', 'What do you recommend?', 3),
    ('アレルギーがあります', 'Arerugii ga arimasu', 'I have an allergy',  4),
    ('お会計をお願いします', 'Okaikei wo onegaishimasu', 'Check, please', 5)
  ) as p(japanese, reading, english, sort_order)
where pc.slug = 'dining';

-- phrases (emergency)
insert into phrases (phrase_category_id, japanese, reading, english, sort_order)
select pc.id, p.japanese, p.reading, p.english, p.sort_order
from phrase_categories pc,
  (values
    ('助けてください',     'Tasukete kudasai',     'Please help me',      1),
    ('救急車を呼んでください', 'Kyuukyuusha wo yonde kudasai', 'Please call an ambulance', 2),
    ('警察を呼んでください', 'Keisatsu wo yonde kudasai', 'Please call the police', 3),
    ('病院はどこですか',   'Byouin wa doko desu ka', 'Where is the hospital?', 4),
    ('日本語が話せません', 'Nihongo ga hanasemasen', 'I cannot speak Japanese', 5)
  ) as p(japanese, reading, english, sort_order)
where pc.slug = 'emergency';
