# MEMORY.md - セッション引き継ぎファイル

**Claude Codeはセッション開始時に必ずこのファイルを読んでください。**
**作業完了・中断時には必ずこのファイルを更新してください。**

---

## 📍 現在の状態

**最終更新:** 2026-05-28
**現在のフェーズ:** 実装中
**作業中ブランチ:** `feature/10-journal`

---

## ✅ 直近の完了タスク

- 2026-05-28: GCPデプロイworkflowの自動トリガー無効化（push → workflow_dispatch のみ）
- 2026-05-17: #10 Journal 実装完了（JournalList / JournalEdit / JournalDetail / TripSummary）
- 2026-05-16: #8 Sustainable Activity Map 実装完了（MapStack / MapScreen / SpotDetailScreen / useSpots）
- 2026-05-15: #6 Shrine Guide / #7 Emergency Guide / #5 Manner Guide / #9 Phrases 実装完了
- 2026-05-12: #11 Supabase セットアップ・#12 Navigation スキャフォールド完了

---

## 🔄 作業中・未完了タスク

| Issue# | 内容 | 状態 | メモ |
|---|---|---|---|
| #10 | **Home 画面充実化（SCR-010）** | **次のタスク** | 設計合意済み。下記レイアウト参照 |
| - | 全 feature ブランチの PR マージ | 未実施 | #9→#5→#7→#6→#8→#10 の順で main へ |
| - | Transport / Shopping フレーズ登録 | 未実施 | DB にカテゴリはあるがフレーズ 0 件 |

---

## 🏠 次のアクション：Home 画面（SCR-010）実装

設計合意済み。以下のレイアウトで実装する。

```
1. ヘッダー         「Japan Compass」ロゴ + サブテキスト
2. Emergency カード  赤背景・大きめ → EmergencyStack へ遷移
3. 今日のマナー Tip  manners テーブルからランダム1件表示（オフライン: キャッシュ）
4. クイックアクセス  Map / Journal の2カラムカード
5. ショートカット    ⛩Shrine / 💬Phrases / ♻️Eco / 🍱Food の横スクロールチップ
6. 最近のジャーナル  journal_entries の最新1件
```

**ナビゲーション注意:** HomeScreen は BottomTab 直下。他タブへの遷移は
`navigation.navigate('Manners')` 等のタブ名を使用（NativeStack ではない）。

---

## ⚠️ 重要な決定事項・注意点

- **uuid**: `gen_random_uuid()` を使用（`uuid_generate_v4()` は Supabase で使用不可）
- **匿名Auth**: 起動時に `signInAnonymously()` で自動ログイン（`src/hooks/useAuth.ts`）
- **オフライン**: Emergency / Shrine Guide は静的バンドル。その他は AsyncStorage 24h キャッシュ
- **ブランチ戦略**: feature ブランチは前の feature から分岐（main は初期状態のまま未マージ）
- **GCPデプロイ**: push トリガー無効化済み。再有効化時は `GCP_SA_KEY`/`GCP_PROJECT_ID` をシークレットに設定しコメント解除
- **返答言語**: ユーザーへの返答は日本語で行う
- **feature-design スキル**: 機能追加時は STEP1〜4 のヒアリングフローを必ず実施

---

## 🏗️ 実装済み画面一覧

| 画面ID | ファイル | 状態 |
|---|---|---|
| SCR-010 | src/screens/home/HomeScreen.tsx | ⬜ プレースホルダー（次のタスク） |
| SCR-020/021 | src/screens/manners/MannersListScreen / MannerDetailScreen | ✅ |
| SCR-022 | src/screens/manners/ShrineGuideScreen | ✅ |
| SCR-023/024 | src/screens/manners/PhraseCategoryListScreen / PhraseDetailScreen | ✅ |
| SCR-030 | src/screens/map/MapScreen | ✅ |
| SCR-031 | src/screens/map/SpotDetailScreen | ✅ |
| SCR-040 | src/screens/journal/JournalListScreen | ✅ |
| SCR-041 | src/screens/journal/JournalEditScreen | ✅ |
| SCR-042 | src/screens/journal/TripSummaryScreen | ✅ |
| SCR-050/051/052 | src/screens/emergency/* | ✅ |

---

## 🐛 既知の問題・負債

| 内容 | 影響度 | 対応予定 |
|---|---|---|
| Transport / Shopping フレーズが 0 件 | 低 | 別 Issue |
| 音声翻訳機能（英⇔日）未実装 | 低 | 将来機能（Could）として仕様書記載済み |
| 全 feature PR が未マージ | 中 | main ブランチが初期状態のまま |

---

## 📝 セッション更新ログ

| 日時 | 作業内容 | 結果 |
|---|---|---|
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
