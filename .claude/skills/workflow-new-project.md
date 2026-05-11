# スキル: 新プロジェクト初期セットアップ

## 使い方
```
/workflow-new-project
```

## 処理手順

### STEP 1: プロジェクト基本情報の収集
以下を確認してから進める。未記入の場合は質問する。

- プロジェクト名・目的
- 技術スタック（フロントエンド・バックエンド・DB）
- GCPプロジェクトID
- GitHubリポジトリURL
- Slack通知を使うか

### STEP 2: CLAUDE.md の技術スタック欄を埋める
収集した情報で `CLAUDE.md` の以下の箇所を更新する。

```
## 🛠 技術スタック
フロントエンド: {入力値}
バックエンド: {入力値}
データベース: {入力値}
インフラ: GCP（プロジェクトID: {入力値}）
```

### STEP 3: .claude/rules/ を技術スタックに合わせて調整
技術スタックに対応しないルールファイルの先頭に以下を追記してスキップを明示する。

```markdown
<!-- このファイルは使用しない技術スタックのため無効化しています -->
```

具体例:
- Pythonのみのバックエンドプロジェクト → `frontend.md` の paths を空配列に変更
- フルスタックJS/TSのプロジェクト → `database.md` の `prisma/**` を使用するORMに合わせて調整
- バックエンドのみ → `frontend.md` を無効化

### STEP 4: docs/glossary.md の初期用語を定義
ユーザーに「このプロジェクト固有の用語はありますか？」と確認し、
あれば `docs/glossary.md` に追記する。

### STEP 5: specs/requirements.md の記入をガイド
`specs/requirements.md` を開き、以下の項目を順番に質問・入力支援する。

1. プロジェクト概要・背景・目的
2. 対象ユーザー
3. 必須機能（Must）の洗い出し
4. スコープ外の明示

### STEP 5.5: GitHub Labels を作成
Issue起票・ワークフロー自動化に必要なラベルを一括作成する。
これを省略すると、自動起票された Issue にラベルが付かなくなるため必ず実行する。

GitHub MCPが使える場合:
```
# 優先度・種別ラベル（/spec-to-tasks 用）
mcp__github__create_label: { name: "must",        color: "d73a4a", description: "必須機能" }
mcp__github__create_label: { name: "should",      color: "e4e669", description: "重要機能" }
mcp__github__create_label: { name: "could",       color: "0075ca", description: "あると良い機能" }

# Issue 種別ラベル（Issue テンプレート用）
mcp__github__create_label: { name: "enhancement", color: "a2eeef", description: "機能追加・改善" }
mcp__github__create_label: { name: "bug",         color: "d73a4a", description: "バグ・不具合" }
mcp__github__create_label: { name: "task",        color: "fbca04", description: "仕様書タスク" }

# 自動化・運用ラベル（GitHub Actions 用）
mcp__github__create_label: { name: "automated",   color: "6f42c1", description: "自動起票" }
mcp__github__create_label: { name: "production",  color: "b60205", description: "本番環境の問題" }
mcp__github__create_label: { name: "deployment",  color: "e4e669", description: "デプロイ関連" }
mcp__github__create_label: { name: "urgent",      color: "b60205", description: "緊急対応が必要" }
mcp__github__create_label: { name: "wip",          color: "cccccc", description: "作業中 (AIレビューをスキップ)" }
mcp__github__create_label: { name: "test-failure", color: "e4e669", description: "テスト失敗" }
```
GitHub MCPが使えない場合:
```
GitHub リポジトリ → Issues → Labels → New label で上記12件を手動作成
```

### STEP 6: /spec-to-tasks で Issue を一括起票
`specs/requirements.md` の記入が完了したら `/spec-to-tasks` を実行し、
GitHub Issue を一括起票する。

### STEP 6.5: docs/file-map.md を更新
プロジェクトの実際のディレクトリ構成を `docs/file-map.md` に反映する。
技術スタックが確定した時点でファイル構成の想定を記載しておくと、
Claude Code がファイルの配置を迷わなくなる。

### STEP 7: MEMORY.md を初期化
以下の内容で `MEMORY.md` を更新する。

```
現在のフェーズ: 要件定義完了・基本設計フェーズ開始
最終更新: {今日の日付}
直近の完了タスク:
- プロジェクト初期セットアップ完了
- specs/requirements.md 作成完了
- GitHub Issue 一括起票完了
```

### STEP 8: 環境セットアップコマンドの案内
以下を順番に実行するよう案内する。

**Mac / Linux の場合:**
```bash
# 1. 環境変数の設定
cp .env.example .env
# → .envをテキストエディタで開いてANTHROPIC_API_KEY等を設定

# 2. Lefthookインストール（プリコミットフック有効化）
npx lefthook install

# 3. MCPのセットアップ確認
# → docs/mcp-setup.md を参照

# 4. GitHub Secretsの登録確認
# → docs/secrets-management.md を参照
```

**Windows（PowerShell）の場合:**
```powershell
# 1. 環境変数の設定
Copy-Item .env.example .env
# → .envをメモ帳等で開いてANTHROPIC_API_KEY等を設定

# 2. Lefthookインストール（プリコミットフック有効化）
npx lefthook install

# 3. MCPのセットアップ確認
# → docs/mcp-setup.md を参照

# 4. GitHub Secretsの登録確認
# → docs/secrets-management.md を参照
```

注意: `.claude/hooks/` 内のシェルスクリプト（.sh）は Windows では Git Bash または WSL で実行されます。
Claude Code は内部的に bash を使うため、Git for Windows の Git Bash が入っていれば動作します。

### STEP 9: 完了報告
以下の形式で報告する。

```
## 🚀 プロジェクトセットアップ完了

✅ CLAUDE.md 技術スタック記入済み
✅ specs/requirements.md 作成済み
✅ GitHub Issue 起票済み
✅ MEMORY.md 初期化済み

### 次のステップ
1. .env に値を設定する
2. npx lefthook install を実行する
3. docs/mcp-setup.md を見てMCPを設定する
4. 基本設計（specs/basic-design.md）の記入に進む
```

## 注意事項
- 各STEPで確認が必要な場合は必ず止まって確認する
- GitHub MCPが未設定の場合はSTEP 6をスキップし、手動起票を案内する
- 一気に進めず、STEPごとにユーザーの確認を取る
