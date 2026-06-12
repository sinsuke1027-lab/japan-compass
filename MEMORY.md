# MEMORY.md - セッション引き継ぎファイル

**Claude Codeはセッション開始時に必ずこのファイルを読んでください。**
**作業完了・中断時には必ずこのファイルを更新してください。**

---

## 📍 現在の状態

**最終更新:** 2026-06-13
**現在のフェーズ:** 実装中
**作業中ブランチ:** `main`

---

## ✅ 直近の完了タスク

- 2026-06-13: #31 見せるカード（Show Card）実装・PR #32 マージ（4カテゴリ19枚・アレルゲン選択・フルスクリーン）
- 2026-06-12: error-to-issue.yml スケジュールトリガー無効化（GCP 未設定エラー修正）
- 2026-06-11: #29 Home 画面（SCR-010）実装完了・PR #30 で MVP 全機能を main へマージ
- 2026-06-06: TEMPLATE_FEEDBACK.md・/sync-template スキル整備（テンプレートフィードバック仕組み化）
- 2026-05-28: GCPデプロイworkflowの自動トリガー無効化（push → workflow_dispatch のみ）
- 2026-05-17: #10 Journal 実装完了（JournalList / JournalEdit / JournalDetail / TripSummary）
- 2026-05-16: #8 Sustainable Activity Map 実装完了（MapStack / MapScreen / SpotDetailScreen / useSpots）

---

## 🔄 作業中・未完了タスク

| Issue# | 内容 | 状態 | メモ |
|---|---|---|---|
| - | Transport / Shopping フレーズ登録 | 未実施 | DB にカテゴリはあるがフレーズ 0 件 |
| #13 | ブックマーク機能（F-101） | 未着手 | Should 優先度 |
| - | 支払い・交通カードガイド充実 | 検討中 | Show Card の延長として検討 |
| - | Web ブックマーク集約（計画系） | 後回し | 通常サイトの URL をアプリに保存・一覧から開く |
| - | ルート計画（計画系） | 後回し | スポットをピン留めして訪問順序を決める |
| - | 旅の写真アルバム（記録系） | 後回し | 旅行写真をアルバム化 |
| - | 費用トラッキング（記録系） | 後回し | 支出をカテゴリ別記録・集計（Journal 拡張） |

---

## ⚠️ 重要な決定事項・注意点

- **uuid**: `gen_random_uuid()` を使用（`uuid_generate_v4()` は Supabase で使用不可）
- **匿名Auth**: 起動時に `signInAnonymously()` で自動ログイン（`src/hooks/useAuth.ts`）
- **オフライン**: Emergency / Shrine Guide は静的バンドル。その他は AsyncStorage 24h キャッシュ
- **ブランチ戦略**: 今後は main から直接 feature ブランチを分岐（MVP マージ済みのため）
- **GCPデプロイ**: push トリガー無効化済み。再有効化時は `GCP_SA_KEY`/`GCP_PROJECT_ID` をシークレットに設定しコメント解除
- **返答言語**: ユーザーへの返答は日本語で行う
- **feature-design スキル**: 機能追加時は STEP1〜4 のヒアリングフローを必ず実施

---

## 🏗️ 実装済み画面一覧

| 画面ID | ファイル | 状態 |
|---|---|---|
| SCR-010 | src/screens/home/HomeScreen.tsx | ✅ |
| SCR-020/021 | src/screens/manners/MannersListScreen / MannerDetailScreen | ✅ |
| SCR-022 | src/screens/manners/ShrineGuideScreen | ✅ |
| SCR-023/024 | src/screens/manners/PhraseCategoryListScreen / PhraseDetailScreen | ✅ |
| SCR-030 | src/screens/map/MapScreen | ✅ |
| SCR-031 | src/screens/map/SpotDetailScreen | ✅ |
| SCR-040 | src/screens/journal/JournalListScreen | ✅ |
| SCR-041 | src/screens/journal/JournalEditScreen | ✅ |
| SCR-042 | src/screens/journal/TripSummaryScreen | ✅ |
| SCR-050/051/052 | src/screens/emergency/* | ✅ |
| Show Card | src/screens/show/* | ✅ |

---

## 🐛 既知の問題・負債

| 内容 | 影響度 | 対応予定 |
|---|---|---|
| Transport / Shopping フレーズが 0 件 | 低 | 別 Issue で対応 |
| 音声翻訳機能（英⇔日）未実装 | 低 | 将来機能（Could）として仕様書記載済み |

---

## 📝 セッション更新ログ

| 日時 | 作業内容 | 結果 |
|---|---|---|
| 2026-06-13 | #31 Show Card 実装・PR #32 マージ・error-to-issue 修正・MEMORY.md 更新 | 完了 |
| 2026-06-11 | #29 Home 画面実装・PR #30 MVP 全機能マージ・旧 feature PR クローズ | 完了 |
| 2026-05-28 | GCP deploy workflow 自動トリガー無効化・MEMORY.md 更新 | 完了 |
| 2026-05-17 | #10 Journal 実装 | 完了 |
| 2026-05-16 | #8 Sustainable Map 実装 | 完了 |
| 2026-05-15 | #5/#6/#7/#9 実装、feature-design スキル整備 | 完了 |
| 2026-05-12 | #11/#12 Supabase・Navigation セットアップ | 完了 |

---

## 🔗 よく参照するファイル

- 仕様書: `specs/requirements.md` / `specs/basic-design.md`
- ルール: `CLAUDE.md`
- ナビゲーション型定義: `src/types/navigation.ts`
- Supabase クライアント: `src/lib/supabase.ts`
- feature-design スキル: `.claude/skills/feature-design.md`
