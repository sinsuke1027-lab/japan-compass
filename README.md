> **このファイルはテンプレートです。**
> Claude Code で以下を実行してプロジェクト情報を入力してください:
> ```
> /workflow-new-project
> ```
> スキルが各ファイルのプレースホルダーを実際の値に書き換えます。

---

# プロジェクト名

## 概要
<!-- プロジェクトの目的・背景を記載 -->

## 技術スタック
- フロントエンド:
- バックエンド:
- データベース:
- インフラ: GCP
- CI/CD: GitHub Actions

## 開発環境セットアップ

```bash
# 1. リポジトリのクローン
git clone <repository-url>
cd <project-name>

# 2. 環境変数の設定
cp .env.example .env
# .envを編集して必要な値を設定

# 3. セットアップスクリプトの実行
make setup
```

## ドキュメント

| ドキュメント | 説明 |
|---|---|
| [要件定義](specs/requirements.md) | プロジェクトの要件 |
| [基本設計](specs/basic-design.md) | システム設計 |
| [アーキテクチャ](docs/architecture.md) | システム構成図 |
| [API仕様](specs/api-spec.yaml) | API仕様書 |
| [MCP設定](docs/mcp-setup.md) | Claude Code MCP設定方法 |

## 開発フロー

1. Issueを確認・作成
2. フィーチャーブランチを作成（`docs/branch-strategy.md`参照）
3. 実装・テスト
4. PRを作成
5. CI/CD・AIレビューを確認
6. マージ

## ライセンス
