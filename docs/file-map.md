# ファイル構成マップ

Claude Codeはこのファイルを参照して「どこに何があるか」を把握してください。
**ファイルを追加・削除した際は必ずこのファイルを更新してください。**

---

## プロジェクト全体構成

```
project-root/
├── CLAUDE.md                  # Claude Codeへの基本ルール（最初に読む）
├── MEMORY.md                  # セッション引き継ぎ記憶
├── lefthook.yml               # プリコミットフック
├── README.md                  # プロジェクト概要
├── .env.example               # 環境変数サンプル
├── .gitignore                 # Git除外設定
├── Makefile                   # 開発用コマンド集
├── .mcp.json                  # MCPサーバー設定
│
├── .claude/
│   ├── settings.json          # Claude Code挙動設定（Hooks含む）
│   ├── hooks/                 # ハーネスフックスクリプト
│   │   ├── post-edit-lint.sh  # ファイル編集後の自動lint
│   │   ├── pre-bash-guard.sh  # 危険コマンドブロック
│   │   └── pre-write-guard.sh # 書き込み禁止ファイル保護
│   ├── rules/                 # 文脈依存ルール
│   │   ├── frontend.md        # フロントエンド編集時に注入
│   │   ├── api.md             # API編集時に注入
│   │   └── database.md        # DB操作時に注入
│   └── skills/                # 再利用可能スキル
│       ├── spec-to-tasks.md        # 仕様→Issue一括起票
│       ├── review-check.md         # PR前セルフレビュー
│       ├── handle-review-comments.md # AIレビューコメント対応ループ
│       ├── workflow-new-project.md # 新プロジェクト初期セットアップ
│       ├── workflow-deploy.md      # デプロイワークフロー
│       ├── create-branch.md        # Issueからブランチを作成
│       ├── session-start.md        # セッション開始時のサマリー表示
│       └── update-memory.md        # セッション終了時のMEMORY.md更新
│
├── specs/                     # 仕様書（何を作るか）
│   ├── requirements.md        # 要件定義
│   ├── basic-design.md        # 基本設計
│   ├── detailed-design.md     # 詳細設計
│   ├── data-model.md          # データモデル
│   ├── api-spec.yaml          # API仕様（OpenAPI）
│   └── screen-flow.md         # 画面遷移
│
├── docs/                      # 開発ルール・規約
│   ├── architecture.md        # システム構成
│   ├── glossary.md            # 用語集
│   ├── branch-strategy.md     # ブランチ戦略
│   ├── commit-convention.md   # コミット規約
│   ├── test-strategy.md       # テスト戦略
│   ├── secrets-management.md  # シークレット管理
│   ├── api-cost-policy.md     # Claude APIコスト管理
│   ├── file-map.md            # このファイル
│   ├── decision-log.md        # 意思決定ログ
│   ├── mcp-setup.md           # MCP設定手順
│   ├── ci-setup.md            # GitHub Actions CIセットアップ
│   └── brainstorming-to-specs.md # /brainstorming出力→specs/変換ガイド
│
├── checklists/                # 各フェーズのチェックリスト
│   ├── requirements-check.md  # 要件定義完了チェック
│   ├── design-check.md        # 設計完了チェック
│   ├── deploy-check.md        # デプロイ前チェック
│   └── security-check.md      # セキュリティチェック
│
├── ai-instructions/           # AIへの追加指示
│   ├── persona.md             # AIの役割・姿勢
│   └── constraints.md         # 制約・禁止事項
│
├── scripts/
│   └── setup.sh               # 環境構築スクリプト
│
├── src/                       # アプリケーションコード（プロジェクトで追加）
│
└── .github/
    ├── PULL_REQUEST_TEMPLATE.md
    ├── dependabot.yml
    ├── ISSUE_TEMPLATE/
    │   ├── feature.md
    │   ├── bug.md
    │   └── spec-task.md
    └── workflows/
        ├── ai-code-review.yml
        ├── ai-test-gen.yml
        ├── ai-spec-check.yml
        ├── ai-security-check.yml
        ├── issue-auto-create.yml
        ├── deploy.yml
        ├── post-deploy-smoke-test.yml
        ├── release-notes.yml
        ├── test-failure-issue.yml
        ├── error-to-issue.yml
        └── notify.yml
```
