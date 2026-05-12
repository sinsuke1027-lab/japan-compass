# 基本設計書

| 項目 | 内容 |
|------|------|
| プロジェクト名 | Japan Compass |
| 作成日 | 2026-05-12 |
| 最終更新 | 2026-05-12 |

---

## 1. システム構成図

```
┌─────────────────────────────────────────────────────┐
│                 Expo App (iOS / Android)             │
│                                                     │
│  ┌───────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │React Nav  │  │ Expo Maps    │  │ Expo AV     │  │
│  │(Tab + Stack│  │(Google/Apple │  │(音声再生)    │  │
│  │Navigation)│  │ Maps SDK)    │  │             │  │
│  └───────────┘  └──────────────┘  └─────────────┘  │
│            │                                        │
│  ┌─────────────────────────────────────────────┐   │
│  │           Supabase JS Client SDK             │   │
│  └───────────────────┬─────────────────────────┘   │
└──────────────────────│─────────────────────────────┘
                       │ HTTPS
         ┌─────────────▼──────────────┐
         │       Supabase Cloud        │
         │                            │
         │  ┌──────────┐ ┌─────────┐  │
         │  │PostgreSQL│ │  Auth   │  │
         │  │(PostgREST)│ │(Anon.) │  │
         │  └──────────┘ └─────────┘  │
         │  ┌──────────┐ ┌─────────┐  │
         │  │ Storage  │ │  RLS    │  │
         │  │(音声/画像)│ │ Policy │  │
         │  └──────────┘ └─────────┘  │
         └────────────────────────────┘
```

---

## 2. 技術スタック

| レイヤー | 技術 | 選定理由 |
|---|---|---|
| フロントエンド | React Native + Expo SDK 54 (TypeScript) | iOS/Android 同時開発・型安全・AI ツールとの相性 |
| ナビゲーション | React Navigation v7 (Tab + Stack) | Expo 標準・実績豊富 |
| 地図 | react-native-maps | Expo Maps API の実態。Google/Apple Maps 切り替え可 |
| 音声 | expo-av | フレーズ音声再生。Expo 標準で設定不要 |
| バックエンド / DB | Supabase (PostgreSQL + PostgREST) | Auth・DB・Storage 一体型。無料枠で MVP 完結 |
| 認証 | Supabase Anonymous Auth | サインアップ不要でユーザーデータを保持可能 |
| ストレージ | Supabase Storage | 音声ファイル・アイコン画像の配信 |
| CI/CD | GitHub Actions | テンプレート検証のため既存ワークフローを活用 |

---

## 3. 画面設計

### 3.1 ナビゲーション構造

```
App
├── Onboarding Stack（初回起動のみ）
│   ├── SCR-001: Welcome
│   └── SCR-002: Location Permission
│
└── Main Tab Navigator（常時表示）
    ├── 🏠 Home
    │   └── SCR-010: Home
    │
    ├── 📖 Manners Stack
    │   ├── SCR-020: Manner Category List
    │   ├── SCR-021: Manner Scene Detail
    │   ├── SCR-022: Shrine Guide
    │   ├── SCR-023: Phrase Category List
    │   └── SCR-024: Phrase Detail
    │
    ├── 🗺️ Map Stack
    │   ├── SCR-030: Sustainable Activity Map
    │   └── SCR-031: Spot Detail
    │
    ├── 📔 Journal Stack
    │   ├── SCR-040: Journal List
    │   ├── SCR-041: Add Journal Entry
    │   └── SCR-042: Trip Summary
    │
    └── 🚨 Emergency Stack
        ├── SCR-050: Emergency Guide
        ├── SCR-051: Emergency Category Detail
        └── SCR-052: Nearby Services
```

### 3.2 画面一覧

#### オンボーディング（初回のみ）

| 画面ID | 画面名 | 概要 |
|---|---|---|
| SCR-001 | Welcome | アプリのコンセプト紹介。「Japan Compass へようこそ」+ 主要機能の紹介。1画面のみ |
| SCR-002 | Location Permission | 位置情報の利用許可リクエスト。マップ機能の説明付き。許可・スキップ選択可 |

#### 🏠 Home タブ

| 画面ID | 画面名 | 概要 |
|---|---|---|
| SCR-010 | Home | クイックアクセスカード（今日のマナー Tips・緊急ボタン・最近の Journal）。各機能への入口 |

#### 📖 Manners タブ

| 画面ID | 画面名 | 概要 |
|---|---|---|
| SCR-020 | Manner Category List | 電車・レストラン・温泉・神社など、シーン別カテゴリ一覧。アイコン＋カテゴリ名 |
| SCR-021 | Manner Scene Detail | 選択シーンのマナー一覧。「やること / やってはいけないこと」を Do/Don't 形式で表示 |
| SCR-022 | Shrine Guide | 参拝手順をステップ形式（手水→鈴→お辞儀→お賽銭→二拝二拍手一拝）で解説。各ステップに解説文 |
| SCR-023 | Phrase Category List | 緊急・交通・食事・買い物などシーン別フレーズカテゴリ一覧 |
| SCR-024 | Phrase Detail | フレーズ一覧。日本語 + ローマ字 + 英語訳。タップで音声再生 |

#### 🗺️ Map タブ

| 画面ID | 画面名 | 概要 |
|---|---|---|
| SCR-030 | Sustainable Activity Map | 現在地周辺のサステナブルスポットをマップ表示。フィルター（神社・寄付・エコ活動） |
| SCR-031 | Spot Detail | スポット詳細。名称・種別・説明・アクセス・Journal 追加ボタン |

#### 📔 Journal タブ

| 画面ID | 画面名 | 概要 |
|---|---|---|
| SCR-040 | Journal List | 活動記録の一覧（日付・場所・活動種別）。旅全体の貢献サマリーをヘッダーに表示 |
| SCR-041 | Add Journal Entry | 活動記録の新規追加。場所・活動種別・日付・メモ・金額（任意）を入力 |
| SCR-042 | Trip Summary | 旅のまとめ。訪問スポット数・合計寄付額・活動種別の内訳。帰国後の振り返り用 |

#### 🚨 Emergency タブ

| 画面ID | 画面名 | 概要 |
|---|---|---|
| SCR-050 | Emergency Guide | 緊急種別カード（警察・救急・大使館・災害）をグリッド表示。オフライン必須 |
| SCR-051 | Emergency Category Detail | 種別ごとの連絡先・対応手順・英語での話し方。例: 警察 → 110 の手順 |
| SCR-052 | Nearby Services | 現在地から近い病院・大使館を地図表示。オフライン時は静的リストにフォールバック |

### 3.3 画面遷移図

`specs/screen-flow.md` 参照

---

## 4. データアクセス設計

### 4.1 方針

Supabase の PostgREST を Supabase JS Client 経由で直接呼び出す（カスタム API サーバー不要）。
Edge Functions は MVP では使用しない。音声ファイルは Supabase Storage から URL 配信。

### 4.2 主なデータアクセスパターン

| 操作 | アクセス方法 | 認証 |
|---|---|---|
| マナーコンテンツ取得 | `supabase.from('manners').select()` | 不要（public） |
| 参拝ステップ取得 | `supabase.from('shrine_steps').select()` | 不要（public） |
| フレーズ取得 | `supabase.from('phrases').select()` | 不要（public） |
| サステナブルスポット取得 | PostGIS `st_dwithin` で現在地から距離フィルタ | 不要（public） |
| Journal 作成・取得 | `supabase.from('journal_entries')` | 必要（匿名 user_id で RLS） |

---

## 5. データベース設計（`specs/data-model.md` 参照）

### 5.1 テーブル一覧

| テーブル名 | 説明 | アクセス |
|---|---|---|
| `categories` | マナーシーンのカテゴリ（電車・レストランなど） | public read |
| `manners` | シーン別マナーコンテンツ | public read |
| `shrine_steps` | 参拝手順ステップ | public read |
| `phrase_categories` | フレーズのシーンカテゴリ | public read |
| `phrases` | フレーズ（日本語・ローマ字・英語・音声URL） | public read |
| `sustainable_spots` | サステナブルスポット（位置情報付き） | public read |
| `journal_entries` | ユーザーの活動記録 | owner only（RLS） |

---

## 6. 認証・認可設計

| 項目 | 内容 |
|---|---|
| 認証方式 | Supabase Anonymous Auth（サインアップ不要） |
| セッション管理 | Supabase が自動管理。AsyncStorage にトークンを永続化 |
| 権限設計 | コンテンツ系テーブル: 全員読み取り可（RLS off or public policy）。Journal: 作成者のみ（`auth.uid() = user_id`） |
| 個人情報 | 位置情報: マップ機能使用時のみ取得。ユーザー識別は anonymous UID のみ（メール・氏名なし） |

---

## 7. インフラ設計（Supabase Cloud）

| サービス | 用途 | プラン |
|---|---|---|
| Supabase Database | コンテンツ・Journal データ。PostGIS 拡張でスポット位置検索 | Free（500MB DB） |
| Supabase Auth | Anonymous 認証 | Free |
| Supabase Storage | 音声ファイル（phrases/）・アイコン画像 | Free（1GB） |
| Supabase Edge Functions | MVP では不使用。将来の AI 機能拡張用に予約 | — |
| Expo Application Services (EAS) | ビルド・OTA アップデート（MVP では EAS Build のみ） | Free tier |

> GCP は本プロジェクトでは使用しない（Supabase Cloud に集約）。
> テンプレートの GCP 向け CI/CD ワークフローは無効化済み。

---

## 8. 非機能設計

### 8.1 オフライン対応

- コンテンツ系データ（manners / shrine_steps / phrases / emergency）はアプリ初回起動時に SQLite or AsyncStorage にキャッシュ
- Emergency タブは完全オフライン動作必須（静的データをバンドルに含める）
- Journal はオンライン時のみ書き込み（オフライン時は書き込み不可の旨をトースト表示）

### 8.2 エラーハンドリング方針

- ネットワークエラー: キャッシュデータを表示 + 「オフラインモード」バナー
- Supabase エラー: ユーザー向けメッセージ表示（技術的な詳細は非表示）
- 位置情報未許可: マップ機能でフォールバック表示（東京中心）

### 8.3 パフォーマンス

- 画面初期表示: 2秒以内
- コンテンツは初回取得後にキャッシュ（再起動後もキャッシュを優先利用）
- 画像・音声は Supabase Storage CDN から配信

### 8.4 ログ・監視

- MVP はクライアントサイドエラーのみ console.error で出力
- 将来的に Sentry（React Native SDK）を導入予定

---

## 9. 変更履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|---------|
| 2026-05-12 | 1.0 | 初版作成 |
