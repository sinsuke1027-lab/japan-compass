# データモデル定義書

| 項目 | 内容 |
|------|------|
| プロジェクト名 | Japan Compass |
| 作成日 | 2026-05-12 |
| 最終更新 | 2026-05-12 |

---

## 1. ER 図

```
┌──────────────┐        ┌──────────────┐
│  categories  │1      *│   manners    │
│──────────────│────────│──────────────│
│ id           │        │ id           │
│ slug         │        │ category_id  │ FK
│ name_en      │        │ type (do/dont│
│ icon         │        │ title_en     │
│ display_order│        │ description_en│
└──────────────┘        │ context_en   │
                        │ display_order│
                        └──────────────┘

┌────────────────────┐  ┌──────────────┐
│  phrase_categories │1 *│   phrases    │
│────────────────────│───│──────────────│
│ id                 │   │ id           │
│ slug               │   │ category_id  │ FK
│ name_en            │   │ japanese     │
│ icon               │   │ romaji       │
│ display_order      │   │ english      │
└────────────────────┘   │ audio_url    │
                         │ display_order│
                         └──────────────┘

┌──────────────────┐
│  shrine_steps    │    ┌───────────────────┐
│──────────────────│    │ sustainable_spots  │
│ id               │    │───────────────────│
│ step_number      │    │ id                │
│ title_en         │    │ name_en           │
│ description_en   │    │ name_ja           │
│ detail_en        │    │ type              │
│ image_url        │    │ description_en    │
└──────────────────┘    │ address_en        │
                        │ latitude          │
                        │ longitude         │
                        │ location (PostGIS)│
                        └────────┬──────────┘
                                 │ 0..1
                        ┌────────▼──────────┐
                        │  journal_entries   │
                        │───────────────────│
                        │ id                │
                        │ user_id (anon)    │
                        │ spot_id           │ FK (nullable)
                        │ spot_name         │ (spot_id null 時に使用)
                        │ activity_type     │
                        │ visited_at        │
                        │ amount_jpy        │ (nullable)
                        │ note              │ (nullable)
                        └───────────────────┘
```

---

## 2. テーブル定義

### `categories` — マナーシーンカテゴリ

| カラム名 | 型 | NOT NULL | デフォルト | 説明 |
|---|---|---|---|---|
| id | UUID | ✓ | gen_random_uuid() | 主キー |
| slug | TEXT | ✓ | — | URL 識別子 (例: "train", "restaurant") |
| name_en | TEXT | ✓ | — | 表示名 (例: "Train") |
| icon | TEXT | ✓ | — | 絵文字またはアイコン名 (例: "🚃") |
| display_order | INTEGER | ✓ | 0 | 一覧表示順 |
| created_at | TIMESTAMPTZ | ✓ | now() | 作成日時 |

**インデックス:**
| インデックス名 | カラム | 種別 |
|---|---|---|
| categories_slug_key | slug | UNIQUE |

---

### `manners` — マナーコンテンツ

| カラム名 | 型 | NOT NULL | デフォルト | 説明 |
|---|---|---|---|---|
| id | UUID | ✓ | gen_random_uuid() | 主キー |
| category_id | UUID | ✓ | — | FK → categories.id |
| type | TEXT | ✓ | — | 'do' または 'dont' |
| title_en | TEXT | ✓ | — | 短いタイトル (例: "Give up your seat") |
| description_en | TEXT | ✓ | — | 詳細説明 |
| context_en | TEXT | — | NULL | 文化的背景の解説（なぜそのマナーがあるか） |
| display_order | INTEGER | ✓ | 0 | カテゴリ内の表示順 |
| created_at | TIMESTAMPTZ | ✓ | now() | 作成日時 |

**制約:**
- `type` は CHECK 制約で `'do'` または `'dont'` のみ許可

**インデックス:**
| インデックス名 | カラム | 種別 |
|---|---|---|
| manners_category_id_idx | category_id | BTREE |

---

### `shrine_steps` — 参拝手順ステップ

| カラム名 | 型 | NOT NULL | デフォルト | 説明 |
|---|---|---|---|---|
| id | UUID | ✓ | gen_random_uuid() | 主キー |
| step_number | INTEGER | ✓ | — | ステップ番号 (1〜5) |
| title_en | TEXT | ✓ | — | ステップ名 (例: "Purify your hands") |
| description_en | TEXT | ✓ | — | 手順の説明 |
| detail_en | TEXT | — | NULL | 文化的背景・補足説明 |
| image_url | TEXT | — | NULL | Supabase Storage の画像 URL |
| created_at | TIMESTAMPTZ | ✓ | now() | 作成日時 |

**制約:**
- `step_number` は UNIQUE（ステップ番号が重複しない）

---

### `phrase_categories` — フレーズシーンカテゴリ

| カラム名 | 型 | NOT NULL | デフォルト | 説明 |
|---|---|---|---|---|
| id | UUID | ✓ | gen_random_uuid() | 主キー |
| slug | TEXT | ✓ | — | 識別子 (例: "emergency", "transport") |
| name_en | TEXT | ✓ | — | 表示名 (例: "Emergency") |
| icon | TEXT | ✓ | — | 絵文字 (例: "🚨") |
| display_order | INTEGER | ✓ | 0 | 表示順 |
| created_at | TIMESTAMPTZ | ✓ | now() | 作成日時 |

**インデックス:**
| インデックス名 | カラム | 種別 |
|---|---|---|
| phrase_categories_slug_key | slug | UNIQUE |

---

### `phrases` — フレーズ集

| カラム名 | 型 | NOT NULL | デフォルト | 説明 |
|---|---|---|---|---|
| id | UUID | ✓ | gen_random_uuid() | 主キー |
| category_id | UUID | ✓ | — | FK → phrase_categories.id |
| japanese | TEXT | ✓ | — | 日本語フレーズ (例: "助けてください") |
| romaji | TEXT | ✓ | — | ローマ字読み (例: "Tasukete kudasai") |
| english | TEXT | ✓ | — | 英訳 (例: "Please help me") |
| audio_url | TEXT | — | NULL | Supabase Storage の音声ファイル URL |
| display_order | INTEGER | ✓ | 0 | カテゴリ内の表示順 |
| created_at | TIMESTAMPTZ | ✓ | now() | 作成日時 |

**インデックス:**
| インデックス名 | カラム | 種別 |
|---|---|---|
| phrases_category_id_idx | category_id | BTREE |

---

### `sustainable_spots` — サステナブルスポット

| カラム名 | 型 | NOT NULL | デフォルト | 説明 |
|---|---|---|---|---|
| id | UUID | ✓ | gen_random_uuid() | 主キー |
| name_en | TEXT | ✓ | — | スポット名（英語） |
| name_ja | TEXT | — | NULL | スポット名（日本語） |
| type | TEXT | ✓ | — | 'shrine' / 'donation' / 'eco' / 'temple' |
| description_en | TEXT | ✓ | — | スポットの説明 |
| address_en | TEXT | — | NULL | 住所（英語表記） |
| latitude | DECIMAL(10,7) | ✓ | — | 緯度 |
| longitude | DECIMAL(10,7) | ✓ | — | 経度 |
| location | GEOGRAPHY(POINT,4326) | ✓ | — | PostGIS 地理座標（距離検索用） |
| website_url | TEXT | — | NULL | 公式サイト URL |
| is_active | BOOLEAN | ✓ | true | 表示フラグ（false で非表示） |
| created_at | TIMESTAMPTZ | ✓ | now() | 作成日時 |

**制約:**
- `type` は CHECK 制約で 'shrine' / 'donation' / 'eco' / 'temple' のみ許可

**インデックス:**
| インデックス名 | カラム | 種別 |
|---|---|---|
| sustainable_spots_location_idx | location | GIST（PostGIS 距離検索） |
| sustainable_spots_type_idx | type | BTREE |

---

### `journal_entries` — ユーザー活動記録

| カラム名 | 型 | NOT NULL | デフォルト | 説明 |
|---|---|---|---|---|
| id | UUID | ✓ | gen_random_uuid() | 主キー |
| user_id | UUID | ✓ | — | Supabase `auth.uid()`（匿名ユーザー ID） |
| spot_id | UUID | — | NULL | FK → sustainable_spots.id（任意） |
| spot_name | TEXT | ✓ | — | スポット名（spot_id が null のときにも使用） |
| activity_type | TEXT | ✓ | — | 'shrine' / 'donation' / 'eco' / 'other' |
| visited_at | DATE | ✓ | CURRENT_DATE | 訪問日 |
| amount_jpy | INTEGER | — | NULL | 寄付・お賽銭金額（円）（任意） |
| note | TEXT | — | NULL | メモ（任意、最大 500 文字） |
| created_at | TIMESTAMPTZ | ✓ | now() | 作成日時 |

**制約:**
- `activity_type` は CHECK 制約で 'shrine' / 'donation' / 'eco' / 'other' のみ許可
- `amount_jpy` は CHECK 制約で `amount_jpy >= 0`
- `note` は CHECK 制約で `char_length(note) <= 500`

**RLS ポリシー（Row Level Security）:**
| ポリシー名 | 操作 | 条件 |
|---|---|---|
| journal_select_own | SELECT | `auth.uid() = user_id` |
| journal_insert_own | INSERT | `auth.uid() = user_id` |
| journal_update_own | UPDATE | `auth.uid() = user_id` |
| journal_delete_own | DELETE | `auth.uid() = user_id` |

**インデックス:**
| インデックス名 | カラム | 種別 |
|---|---|---|
| journal_entries_user_id_idx | user_id | BTREE |
| journal_entries_visited_at_idx | visited_at | BTREE |

---

## 3. 共通ルール

- 主キー: UUID（`gen_random_uuid()`）
- 日時: UTC で保存（`TIMESTAMPTZ`）
- コンテンツ系テーブル（categories / manners / shrine_steps / phrase_categories / phrases / sustainable_spots）は RLS 無効 + public read
- `journal_entries` のみ RLS 有効 + 匿名 UID で所有者判定
- 論理削除: `sustainable_spots.is_active` で制御。他テーブルは物理削除

---

## 4. Supabase 拡張機能

| 拡張 | 用途 |
|---|---|
| `uuid-ossp` | UUID 生成（`gen_random_uuid()` のバックエンド） |
| `postgis` | `sustainable_spots.location` の地理座標検索 |

---

## 5. マスターデータ定義（初期投入データ）

### categories（6件）

| slug | name_en | icon |
|---|---|---|
| train | Train | 🚃 |
| restaurant | Restaurant | 🍜 |
| onsen | Hot Spring (Onsen) | ♨️ |
| shrine | Shrine & Temple | ⛩ |
| public | Public Spaces | 🏙 |
| shopping | Shopping | 🛍 |

### phrase_categories（5件）

| slug | name_en | icon |
|---|---|---|
| emergency | Emergency | 🚨 |
| transport | Transport | 🚇 |
| dining | Dining | 🍱 |
| shopping | Shopping | 🛍 |
| greetings | Greetings | 👋 |

### shrine_steps（5件）

| step_number | title_en |
|---|---|
| 1 | Approach the torii gate |
| 2 | Purify your hands (temizuya) |
| 3 | Approach the main hall |
| 4 | Make an offering (osaisenl) |
| 5 | Bow and pray (ni-rei ni-hakushu ichi-rei) |

---

## 6. 変更履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|---------|
| 2026-05-12 | 1.0 | 初版作成 |
