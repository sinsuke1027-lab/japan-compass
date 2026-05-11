# CLAUDE.md - Claude Code プロジェクトルール

## 📌 このファイルの目的
このプロジェクトにおけるClaude Codeの行動指針・制約・参照先を定義します。
**作業開始前に必ずこのファイル全体を読んでください。**

---

## 🔗 参照すべきドキュメント（優先順位順）

1. `MEMORY.md` - **セッション開始時に最初に読む**（前回の作業状況）
2. `specs/requirements.md` - 要件定義（何を作るか）
3. `specs/basic-design.md` - 基本設計（どう作るか）
4. `specs/detailed-design.md` - 詳細設計
5. `docs/architecture.md` - システム構成
6. `docs/branch-strategy.md` - ブランチ運用ルール
7. `docs/commit-convention.md` - コミットメッセージ規約
8. `docs/glossary.md` - 用語集
9. `docs/file-map.md` - ファイル構成マップ
10. `ai-instructions/persona.md` - AIの役割定義
11. `ai-instructions/constraints.md` - 制約・禁止事項

### 文脈依存ルール（該当ファイル編集時のみ自動適用）
- `.claude/rules/frontend.md` - フロントエンドコード編集時
- `.claude/rules/api.md` - API・ルート編集時
- `.claude/rules/database.md` - DB・マイグレーション編集時

---

## 🧠 基本姿勢

- 仕様書（`specs/`）に記載のない機能は**勝手に実装しない**
- 不明点・判断が必要な場合は**必ず確認してから実装する**
- 実装前に`docs/branch-strategy.md`を確認し、適切なブランチを作成する
- コミット時は`docs/commit-convention.md`の規約に従う
- セキュリティリスクが疑われる実装は**必ず警告を出してから進める**

---

## 📂 プロジェクト構成

```
（プロジェクト開始時にdocs/file-map.mdを参照・更新すること）
```

---

## 🛠 技術スタック

```
プロジェクト名: Japan Compass
フロントエンド: React Native + Expo (TypeScript)
バックエンド: Supabase (Edge Functions)
データベース: Supabase PostgreSQL
認証: Supabase Anonymous Auth
ストレージ: Supabase Storage
地図: react-native-maps / Expo Maps
インフラ: Supabase Cloud
CI/CD: GitHub Actions
リポジトリ: github.com/sinsuke1027-lab/japan-compass
```

---

## ⚠️ 絶対に守るルール

1. `.env`ファイルをコミットしない（`.env.example`のみコミット可）
2. APIキー・シークレットをコードに直接書かない
3. `main`ブランチへの直接プッシュをしない
4. テストが通らない状態でPRを作成しない
5. `docs/api-cost-policy.md`のトークン上限を超える処理を実装する前に確認する

---

## 📋 作業フロー

1. Issueを確認・作成する
2. `/create-branch #Issue番号` でブランチを作成する（`docs/branch-strategy.md`の命名規則を自動適用）
3. `specs/`の関連仕様を確認
4. 実装
5. テスト実行
6. `docs/commit-convention.md`に従いコミット
7. PRを作成（`.github/PULL_REQUEST_TEMPLATE.md`使用）
8. CI/CD（GitHub Actions）が通ることを確認
9. セッション終了時は `/update-memory` で `MEMORY.md` を更新する

---

## 🔄 更新履歴

| 日付 | 変更内容 | 担当 |
|------|---------|------|
| YYYY-MM-DD | 初版作成 | - |
