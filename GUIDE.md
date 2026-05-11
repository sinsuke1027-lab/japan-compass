# AI駆動開発テンプレート 使い方ガイド

> このテンプレートを使って「何をどの順番でやるか」を、場面ごとに説明します。
> コーディング経験がなくても、Claude Codeに指示を出すだけで開発が進められる設計になっています。

---

## 目次

1. [全体の流れを把握する](#1-全体の流れを把握する)
2. [最初の1回だけやること（環境準備）](#2-最初の1回だけやること環境準備)
3. [シナリオ①：新プロジェクトを始める](#3-シナリオ①新プロジェクトを始める)
4. [シナリオ②：新しい機能を作る](#4-シナリオ②新しい機能を作る)
5. [シナリオ③：バグを修正する](#5-シナリオ③バグを修正する)
6. [シナリオ④：本番環境にデプロイする](#6-シナリオ④本番環境にデプロイする)
7. [シナリオ⑤：AIレビューの指摘に対応する](#7-シナリオ⑤aiレビューの指摘に対応する)
8. [シナリオ⑥：前回の続きから作業を再開する](#8-シナリオ⑥前回の続きから作業を再開する)
9. [自動で動くもの一覧（触らなくていいもの）](#9-自動で動くもの一覧触らなくていいもの)
10. [コマンド早見表](#10-コマンド早見表)
11. [ファイル役割早見表](#11-ファイル役割早見表)
12. [困ったときのQ&A](#12-困ったときのqa)

---

## 1. 全体の流れを把握する

このテンプレートは「誰が何をするか」が明確に分かれています。

```
あなたがやること         Claude Codeがやること        GitHubが自動でやること
─────────────────────────────────────────────────────────────────────
要件・仕様を決める  →  仕様書を読んで実装する  →  コードレビュー（AI）
承認・判断をする    →  テストを書く            →  セキュリティチェック
最終確認をする      →  コミット・PRを作る       →  デプロイ
                        MEMORY.mdを更新する      →  Issue自動起票
                                                 →  リリースノート生成
```

### 使うツールの関係図

```
【あなたの指示】
      ↓
【Claude Code】← CLAUDE.md（ルール）
      ↓            ← MEMORY.md（記憶）
      ↓            ← .claude/rules/（状況別ルール・自動）
      ↓            ← .claude/skills/（使えるコマンド）
      ↓
【GitHub】← .github/workflows/（PR時・マージ時に自動実行）
      ↓
【GCP】← deploy.yml（mainマージ時に自動デプロイ）
```

---

## 2. 最初の1回だけやること（環境準備）

**新しいリポジトリを作ったら、最初に一度だけ実施します。**

### Step 1：テンプレートを配置する

```bash
# ZIPを展開してリポジトリに配置
unzip project-template.zip
cp -r project-template/. ./
```

### Step 2：環境変数を設定する

```bash
cp .env.example .env
# .envをテキストエディタで開いて値を入力する
```

最低限これだけ設定する：
| 項目 | どこで取得するか |
|---|---|
| `ANTHROPIC_API_KEY` | https://console.anthropic.com |
| `GCP_PROJECT_ID` | GCPコンソール |
| `GITHUB_PERSONAL_ACCESS_TOKEN` | GitHub → Settings → Developer settings |

### Step 3：プリコミットフックを有効化する

```bash
npx lefthook install
```

これで `git commit` のたびに自動でlint・シークレット漏洩チェックが走ります。

> **Windows ユーザーの方へ**: フックは内部で Bash スクリプトを実行します。
> [Git for Windows](https://git-scm.com/download/win)（Git Bash 付き）がインストール済みであることを確認してください。
> Git Bash がない場合、`npx lefthook install` は成功してもコミット時にフックが動きません。

### Step 4：GitHub Secretsに登録する

GitHubリポジトリ → Settings → Secrets and variables → Actions で以下を登録：

| シークレット名 | 内容 |
|---|---|
| `ANTHROPIC_API_KEY` | Claude APIキー |
| `GCP_PROJECT_ID` | GCPプロジェクトID |
| `GCP_SA_KEY` | GCPサービスアカウントキー（JSON全体） |
| `SLACK_WEBHOOK_URL` | Slack通知URL（任意） |

### Step 5：MCPを設定する

`docs/mcp-setup.md` を開いて手順に従う。
特に **GitHub MCP** は Issue操作に必須です。

### Step 6：Superpowersをインストールする

Claude Codeで以下を実行：
```
/install-github-app
```

> **注意**: インストール手順はバージョンによって異なる場合があります。
> 最新の手順は [Superpowers 公式ドキュメント](https://github.com/anthropics/anthropic-quickstarts) を確認してください。

---

## 3. シナリオ①：新プロジェクトを始める

**使う場面：** 新しいサービス・アプリの開発をゼロから始めるとき

### Claude Codeへの指示

```
/workflow-new-project
```

### 何が起きるか

Claude Codeが以下の順番でガイドしてくれます。

| 順番 | Claude Codeがすること | あなたがすること |
|---|---|---|
| 1 | 技術スタックを質問する | 回答する |
| 2 | `CLAUDE.md` の技術スタック欄を埋める | 確認・承認する |
| 3 | `specs/requirements.md` の記入を一緒に進める | 要件を答える |
| 4 | GitHubにIssueを一括起票する | 確認する |
| 5 | `MEMORY.md` を初期化する | 確認する |
| 6 | 次にやることを案内する | — |

### 完了後に手動でやること

- `specs/basic-design.md` の記入（Claude Codeに「基本設計書を一緒に作って」と指示可）
- `docs/glossary.md` にプロジェクト固有の用語を追加

---

## 4. シナリオ②：新しい機能を作る

**使う場面：** GitHubのIssueに書かれた機能を実装するとき

### 全体の流れ

```
①ブランチ作成 → ②要件整理 → ③計画作成 → ④実装 → ⑤テスト → ⑥PR作成 → ⑦AIチェック → ⑧マージ
```

### ① ブランチを作成する

```
/create-branch #12
```

Issue番号を指定するだけで、命名規則に従ったブランチを自動作成します。

### ②〜③ 要件整理・計画作成（Superpowers）

```
/brainstorming Issue #12を実装したい。要件を整理して計画を立ててほしい。
```

Claude Codeが質問しながら要件を固め、実装計画書を作成します。
計画書の内容を確認して「OK」と言えば次へ進みます。

> `/brainstorming` が生成した設計書を `specs/` に転記するときは
> `docs/brainstorming-to-specs.md` のセクション対応表を参照してください。

### ③ 実装（Superpowers）

```
/execute-plan
```

計画書に基づいてサブエージェントが並列で実装します。
あなたは基本的に待つだけです。

### ④ テスト（Superpowers）

テストは実装中に自動で進みます。
テストが通らない場合はClaude Codeが自動で修正を試みます。

### ⑤ PR作成前のセルフレビュー

```
/review-check
```

仕様・セキュリティ・テストを自己チェックします。
問題なければPR作成に進みます。

### ⑥ PR作成・AIチェック（Superpowers + 自動）

```
/finishing-a-development-branch
```

PRが作成されると、GitHub Actionsが自動で以下を実行します：

| チェック | ワークフロー | 所要時間 |
|---|---|---|
| AIコードレビュー | `ai-code-review.yml` | 約1〜2分 |
| 仕様整合性チェック | `ai-spec-check.yml` | 約1〜2分 |
| セキュリティチェック | `ai-security-check.yml` | 約1〜2分 |
| テストコード候補生成 | `ai-test-gen.yml` | 約2〜3分 |

### ⑦ AIレビューの指摘に対応する

→ **シナリオ⑤** へ

### ⑧ マージ

AIレビューが全て通ったらマージします。
マージ後は以下が自動実行されます：
- GCPへの自動デプロイ（`deploy.yml`）
- リリースノート生成（`release-notes.yml`）
- Slack通知（`notify.yml`）

---

## 5. シナリオ③：バグを修正する

**使う場面：** バグのIssueが来たとき・エラーが発生したとき

### Claude Codeへの指示

```
Issue #34のバグを修正して。/brainstormingで原因を整理してから進めてほしい。
```

または、Superpowersのデバッグスキルを使う：

```
/systematic-debugging
このエラーが発生している: {エラーメッセージを貼り付け}
```

### Superpowersが行う4段階のデバッグ

1. **現象の整理** — エラーの再現条件を特定
2. **根本原因の調査** — 表面的な修正ではなく原因を特定
3. **修正方針の決定** — 修正範囲・影響範囲を確認してから実施
4. **再発防止** — テストを追加して同じバグが起きないようにする

### 本番エラーの場合

`error-to-issue.yml` が毎時自動でCloud Loggingを確認し、
エラーを検出するとGitHub Issueを自動起票します。

起票されたIssueを確認して上記の手順で対応してください。

---

## 6. シナリオ④：本番環境にデプロイする

**使う場面：** 機能が完成してmainブランチにマージした後

### 通常のデプロイ（mainマージで自動）

mainブランチへのマージ時に `deploy.yml` が自動実行されます。
特別な操作は不要です。

デプロイ状況の確認：
```
GitHub → Actions → GCPデプロイ
```

### デプロイ前チェックを手動で実施したい場合

```
/workflow-deploy
```

Claude Codeが以下の順番でガイドします：

| 順番 | 内容 |
|---|---|
| 1 | セキュリティチェックリスト確認 |
| 2 | デプロイ前チェックリスト確認 |
| 3 | テスト全件パス確認 |
| 4 | デプロイ実行 |
| 5 | スモークテスト結果確認 |
| 6 | Cloud Loggingエラー確認 |
| 7 | MEMORY.mdにデプロイ記録追記 |

### デプロイ後に問題が発生した場合

スモークテスト失敗時は `post-deploy-smoke-test.yml` が自動でIssueを起票します。
起票されたIssueを確認して `/workflow-deploy` のロールバック手順を実行してください。

---

## 7. シナリオ⑤：AIレビューの指摘に対応する

**使う場面：** PRを作成したあと、AIレビューコメントが付いたとき

### Claude Codeへの指示

```
/handle-review-comments #42
```

（#42はPR番号）

### 何が起きるか

| 順番 | Claude Codeがすること | あなたがすること |
|---|---|---|
| 1 | PRのコメントを全件取得する | — |
| 2 | 重要度を3段階に分類して一覧表示 | 🟡🔵の対応要否を判断する |
| 3 | 🔴ブロッカーを全て自動修正 | — |
| 4 | 🟡🔵を判断に従って修正 | 確認する |
| 5 | `/review-check` でセルフチェック | — |
| 6 | プッシュして再AIレビューを待つ | — |
| 7 | 完了報告・次のステップを案内 | マージ判断をする |

### 重要度の基準

| 重要度 | 例 | 対応 |
|---|---|---|
| 🔴 ブロッカー | シークレットのハードコード・仕様違反・テスト未作成 | **必ず修正** |
| 🟡 要対応 | バグ・命名の不一致・エラーハンドリング漏れ | 修正推奨 |
| 🔵 提案 | 可読性の改善・パフォーマンス最適化 | 任意 |

---

## 8. シナリオ⑥：前回の続きから作業を再開する

**使う場面：** 時間を空けてから開発を再開するとき

### Claude Codeへの指示

```
/session-start
```

`/session-start` スキルが `MEMORY.md` を読み込み、前回の完了タスク・未完了タスク・
今日の着手候補を自動でサマリーして提示します。

> 毎回「MEMORY.mdを読んで」と入力する代わりに `/session-start` を使うと、
> 整形されたサマリーと次のアクション提案が得られます。

### セッション終了時にやること

```
/update-memory
```

Claude Code が今日の作業内容を自動でまとめて `MEMORY.md` を更新します。
これを習慣にすることで次回のスムーズな再開が保証されます。

---

## 9. 自動で動くもの一覧（触らなくていいもの）

以下は設定済みで、条件が揃うと自動実行されます。

| 何が起きると | 自動で実行されること |
|---|---|
| PRを作成・更新する | AIコードレビュー・仕様チェック・セキュリティチェック |
| PRを作成する（初回） | テストコード候補の生成 |
| テストが失敗する（mainブランチ） | IssueをGitHubに自動起票 |
| mainブランチにマージする | GCPデプロイ・リリースノート生成・Slack通知 |
| デプロイが完了する | スモークテスト自動実行 |
| ファイルを編集する | lint・フォーマット自動実行（hooks） |
| `git commit` を実行する | lint・型チェック・シークレット漏洩チェック（lefthook） |
| 毎時0分 | Cloud Loggingのエラーチェック → Issue自動起票 |
| 毎週月曜日 | 依存パッケージの更新PR自動作成（dependabot） |

---

## 10. コマンド早見表

| コマンド | いつ使うか | 自動/手動 |
|---|---|---|
| `/workflow-new-project` | プロジェクト開始時（1回だけ） | 手動 |
| `/workflow-deploy` | デプロイ前チェックをしたいとき | 手動 |
| `/handle-review-comments #番号` | AIレビューコメントへの対応 | 手動 |
| `/spec-to-tasks` | 仕様書からIssueを一括起票したいとき | 手動 |
| `/review-check` | PRを作る前のセルフチェック | 手動 |
| `/create-branch #番号` | Issueからブランチを作成するとき | 手動 |
| `/session-start` | セッション開始時に前回の続きを確認するとき | 手動 |
| `/update-memory` | セッション終了時にMEMORY.mdを更新するとき | 手動 |
| `/brainstorming` | 要件を整理したいとき（Superpowers） | 手動 |
| `/execute-plan` | 計画に基づいて実装するとき（Superpowers） | 手動 |
| `/systematic-debugging` | バグの原因調査（Superpowers） | 手動 |
| `/finishing-a-development-branch` | PR作成・マージ（Superpowers） | 手動 |
| `/tdd` | テスト駆動開発を強制したいとき（Superpowers） | 手動 |

> **Superpowers スキル（`/brainstorming`, `/execute-plan`, `/systematic-debugging`, `/finishing-a-development-branch`, `/tdd`）は外部プラグインです。**
> Step 6（Superpowers インストール）を完了していないと「スキルが見つかりません」となります。

---

## 11. ファイル役割早見表

### 「どこに何を書くか」

| 書きたいこと | ファイル |
|---|---|
| 何を作るか（要件） | `specs/requirements.md` |
| どう作るか（設計） | `specs/basic-design.md` |
| APIの仕様 | `specs/api-spec.yaml` |
| データの構造 | `specs/data-model.md` |
| 画面の遷移 | `specs/screen-flow.md` |
| 用語の定義 | `docs/glossary.md` |
| 技術選定の理由 | `docs/decision-log.md` |
| 前回の作業状況 | `MEMORY.md` |

### 「どのファイルが何を制御しているか」

| ファイル | 何を制御するか |
|---|---|
| `CLAUDE.md` | Claude Codeの基本行動ルール全体 |
| `.claude/settings.json` | 許可・禁止操作・Hooks |
| `.claude/hooks/pre-bash-guard.sh` | 危険なコマンドの物理ブロック |
| `.claude/hooks/post-edit-lint.sh` | 編集後の自動lint |
| `.claude/rules/frontend.md` | フロントエンドコード編集時のルール |
| `.claude/rules/api.md` | API編集時のルール |
| `.claude/rules/database.md` | DB操作時のルール |
| `lefthook.yml` | コミット前の自動チェック |
| `docs/branch-strategy.md` | ブランチ命名ルール |
| `docs/commit-convention.md` | コミットメッセージのルール |

### Issue テンプレートの使い分け

`.github/ISSUE_TEMPLATE/` に3種類のテンプレートがあります。

| テンプレート | 誰が作るか | いつ使うか |
|---|---|---|
| `feature.md` | 開発者（手動） | 新しい機能のアイデアや要望を起票するとき |
| `bug.md` | 開発者・自動 | バグ・不具合を報告するとき（本番エラー自動起票にも使用） |
| `spec-task.md` | `/spec-to-tasks` が自動生成 | `specs/requirements.md` の各機能をタスク分解するとき |

**`feature` と `spec-task` の違い:**
- `feature` は「こんな機能が欲しい」という**要望レベル**の起票。仕様書未記載でもOK。
- `spec-task` は仕様書に記載済みの機能を**実装タスクに分解**したもの。`/spec-to-tasks` が自動生成する。

> 通常の開発フローでは `spec-task` を使います。仕様外のアイデアを素早く記録したい場合は `feature` を使ってください。

---

## 12. 困ったときのQ&A

**Q: Claude Codeが仕様と違うものを作ってしまった**
→ `specs/requirements.md` に要件が書かれているか確認してください。
書かれていない場合は追記して「仕様書を読み直して修正して」と指示します。

**Q: GitHub Actionsが失敗した**
→ GitHub → Actions でエラー内容を確認します。
Claude Codeに「GitHub Actionsのエラーを修正して」とエラーログを貼り付けて指示します。

**Q: AIレビューのコメントが大量についてしまった**
→ `/handle-review-comments #PR番号` を実行してください。
自動で分類・対応してくれます。

**Q: 前回の作業内容を忘れた**
→ `MEMORY.md` を確認するか、Claude Codeに「MEMORY.mdを読んで状況を教えて」と聞きます。

**Q: デプロイ後にエラーが出た**
→ `/workflow-deploy` を実行すると、ロールバック手順を案内してくれます。

**Q: APIのコストが心配**
→ `docs/api-cost-policy.md` を確認してください。
ワークフローごとのトークン上限と月間コスト目安が書かれています。

**Q: MCP（GitHub連携など）がうまく動かない**
→ `docs/mcp-setup.md` のトラブルシューティングを確認してください。
Claude Codeで `/mcp` と入力すると接続状況が確認できます。

**Q: 新しい技術スタックに変えたい**
→ `CLAUDE.md` の技術スタック欄と `.claude/rules/` の該当ファイルを更新します。
Claude Codeに「技術スタックを〇〇に変更して、関連ファイルを更新して」と指示できます。

---

## 付録：シナリオ別 使用ファイル・コマンド対応表

| シナリオ | 使うコマンド | 自動実行されるもの | 参照ファイル |
|---|---|---|---|
| 新プロジェクト開始 | `/workflow-new-project` | — | `CLAUDE.md`, `specs/requirements.md` |
| 新機能開発 | `/create-branch #番号` → `/brainstorming` → `/execute-plan` → `/finishing-a-development-branch` | AIレビュー3種・デプロイ・通知 | `specs/`, `docs/branch-strategy.md` |
| バグ修正 | `/create-branch #番号` → `/systematic-debugging` | AIレビュー3種 | `checklists/security-check.md` |
| デプロイ | `/workflow-deploy` | スモークテスト・通知 | `checklists/deploy-check.md` |
| レビュー対応 | `/handle-review-comments #番号` | 再AIレビュー | `.github/workflows/ai-*.yml` |
| 作業再開 | `/session-start` | — | `MEMORY.md` |
| セッション終了 | `/update-memory` | — | `MEMORY.md` |
