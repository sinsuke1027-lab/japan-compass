# /brainstorming 出力 → specs/ ファイル変換ガイド

## 目的

Superpowers の `/brainstorming` スキルが生成する設計書
（`docs/superpowers/specs/YYYY-MM-DD-topic-design.md`）を
このテンプレートの `specs/` ファイル群に転記するときの対応ルールを定義する。

フェーズ2で実装予定の `/project-setup` スキルはこのガイドをもとに自動化する。

---

## セクション対応表

| /brainstorming 設計書のセクション | 転記先ファイル | 転記先セクション |
|---|---|---|
| 背景・課題・目的 | `specs/requirements.md` | 1. 背景・目的 |
| ターゲットユーザー・ペルソナ | `specs/requirements.md` | 2. 対象ユーザー |
| 主要機能・Must要件 | `specs/requirements.md` | 3.1 必須機能（Must） |
| 付加機能・Should/Could要件 | `specs/requirements.md` | 3.2〜3.3 重要機能・あると良い機能 |
| スコープ外・やらないこと | `specs/requirements.md` | 6. スコープ外 |
| アーキテクチャ・システム構成 | `specs/basic-design.md` | 1. システム構成図 |
| 技術スタック・技術選定理由 | `specs/basic-design.md` | 2. 技術スタック |
| 画面設計・UI概要 | `specs/basic-design.md` | 3. 画面設計 |
| API設計・エンドポイント概要 | `specs/basic-design.md` | 4. API設計 |
| データモデル・ER図 | `specs/data-model.md` | 全体 |
| 用語定義・ドメイン用語 | `docs/glossary.md` | 追記 |

---

## 転記手順（手動の場合）

1. `/brainstorming` 実行後、設計書のパスを確認する
   （例: `docs/superpowers/specs/2026-05-06-task-manager-design.md`）

2. 設計書を開き、上の対応表に沿って各セクションを `specs/` ファイルに転記する

3. 転記後に `CLAUDE.md` の技術スタック欄を埋める

4. `/workflow-new-project` の STEP 2〜4 を実行して残りの設定を完了する

---

## 技術スタック自動判定ロジック（/project-setup 実装時の参考）

設計書内の記述から技術スタックを推定するキーワード:

| キーワード | 推定スタック | 有効化するプリセット |
|---|---|---|
| React / Next.js / TypeScript | フロントエンド: Next.js | `.claude/presets/nextjs.md` |
| FastAPI / Python / uvicorn | バックエンド: FastAPI | `.claude/presets/fastapi.md` |
| Go / Gin / Echo | バックエンド: Go | `.claude/presets/go.md` |
| PostgreSQL / Supabase | DB: PostgreSQL | DATABASE_URL の形式を postgres:// に |
| Firestore / Firebase | DB: Firestore | DATABASE_URL を削除、Firestore SDK を追加 |
| Cloud Run | インフラ確定 | deploy.yml の Cloud Run セクションを有効化 |

---

## 注意事項

- 設計書の内容をそのままコピーせず、テンプレートのフォーマットに合わせて整形する
- 「未定」「TBD」のままの項目は空欄のままにしておく（後で埋める）
- `/brainstorming` が生成しない項目（非機能要件・認証設計等）は別途検討が必要
