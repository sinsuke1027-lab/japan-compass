# MEMORY.md - セッション引き継ぎファイル

**Claude Codeはセッション開始時に必ずこのファイルを読んでください。**
**作業完了・中断時には必ずこのファイルを更新してください。**

---

## 📍 現在の状態

**最終更新:** 2026-06-14
**現在のフェーズ:** 実装中
**作業中ブランチ:** `main`

---

## ✅ 直近の完了タスク

- 2026-06-14: #35/#36/#37 並列エージェントで5機能同時実装・PR #38/#39/#40 マージ（Trip Planner・Season Calendar・Memory・Stats & Badges・Journal気づきメモ）
- 2026-06-14: specs v1.2 更新（requirements.md / basic-design.md）
- 2026-06-13: #33 Show Card Transport 路線選択（都市→駅→路線）実装・PR #34 マージ
- 2026-06-13: #31 見せるカード（Show Card）実装・PR #32 マージ
- 2026-06-12: error-to-issue.yml スケジュールトリガー無効化（GCP 未設定エラー修正）
- 2026-06-11: #29 Home 画面（SCR-010）実装完了・PR #30 で MVP 全機能を main へマージ

---

## 🔄 作業中・未完了タスク

| Issue# | 内容 | 状態 | メモ |
|---|---|---|---|
| - | Transport / Shopping フレーズ登録 | 未実施 | DB にカテゴリはあるがフレーズ 0 件 |
| - | Supabase DB migration 適用 | 未実施 | insights・activity_type カラム追加が必要（ダッシュボードから実行） |
| - | Supabase Edge Function デプロイ | 未実施 | `supabase/functions/fetch-url-title` を `supabase functions deploy` で反映 |
| - | ユーザーレビュー（共有系・F-401） | 後回し | 設計未着手 |
| #13 | ブックマーク機能（F-101） | 未着手 | Should 優先度 |

---

## ⚠️ 重要な決定事項・注意点

- **uuid**: `gen_random_uuid()` を使用（`uuid_generate_v4()` は Supabase で使用不可）
- **匿名Auth**: 起動時に `signInAnonymously()` で自動ログイン（`src/hooks/useAuth.ts`）
- **オフライン**: Emergency / Shrine / Show Card / Season Calendar は静的バンドル。その他は AsyncStorage 24h キャッシュ
- **ブランチ戦略**: main から直接 feature ブランチを分岐
- **GCPデプロイ**: push トリガー無効化済み。再有効化時は `GCP_SA_KEY`/`GCP_PROJECT_ID` をシークレットに設定しコメント解除
- **並列エージェント**: feature-design 完了 → specs 更新 → Issue 作成 → グルーピング → parallel-build の順で実施
- **並列エージェント競合対策**: 同じファイル（JournalStack・navigation.ts 等）を触るエージェントは同じグループにまとめる。マージ順序は独立度の高いものから

---

## 🏗️ 実装済み画面一覧

| 画面ID | ファイル | 状態 |
|---|---|---|
| SCR-010 | src/screens/home/HomeScreen.tsx | ✅ |
| SCR-020/021 | src/screens/manners/* | ✅ |
| SCR-022 | src/screens/manners/ShrineGuideScreen | ✅ |
| SCR-023/024 | src/screens/manners/Phrase* | ✅ |
| SCR-030/031 | src/screens/map/* | ✅ |
| SCR-040〜042 | src/screens/journal/JournalList・Edit・TripSummary | ✅ |
| SCR-043 | src/screens/journal/MemoryListScreen / MemoryAddScreen | ✅ |
| SCR-044 | src/screens/journal/StatsBadgesScreen | ✅ |
| SCR-050〜052 | src/screens/emergency/* | ✅ |
| SCR-060〜062 | src/screens/show/* | ✅ |
| SCR-070〜072 | src/screens/plan/* | ✅ |

---

## 🐛 既知の問題・負債

| 内容 | 影響度 | 対応予定 |
|---|---|---|
| Transport / Shopping フレーズが 0 件 | 低 | 別 Issue で対応 |
| insights・activity_type カラムが DB に未反映 | 中 | Supabase ダッシュボードで migration 実行 |
| fetch-url-title Edge Function 未デプロイ | 中 | `supabase functions deploy fetch-url-title` |
| 音声翻訳機能（英⇔日）未実装 | 低 | 将来機能（Could） |

---

## 📝 セッション更新ログ

| 日時 | 作業内容 | 結果 |
|---|---|---|
| 2026-06-14 | 並列エージェント3体で5機能実装・PR #38〜#40 マージ・MEMORY.md 更新 | 完了 |
| 2026-06-13 | Show Card 路線選択・MEMORY.md 更新 | 完了 |
| 2026-06-13 | #31 Show Card 実装・error-to-issue 修正 | 完了 |
| 2026-06-11 | #29 Home 画面実装・MVP 全機能マージ | 完了 |
| 2026-05-28 | GCP deploy workflow 自動トリガー無効化 | 完了 |

---

## 🔗 よく参照するファイル

- 仕様書: `specs/requirements.md` / `specs/basic-design.md`
- ルール: `CLAUDE.md`
- ナビゲーション型定義: `src/types/navigation.ts`
- Supabase クライアント: `src/lib/supabase.ts`
- feature-design スキル: `.claude/skills/feature-design.md`
- 並列ビルドスキル: `.claude/skills/parallel-build.md`
