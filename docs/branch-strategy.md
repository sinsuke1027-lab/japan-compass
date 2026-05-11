# ブランチ戦略

## 基本方針
GitHub Flow をベースとしたシンプルなブランチ戦略を採用します。

---

## ブランチ種別

| ブランチ | 役割 | 直接プッシュ |
|---|---|---|
| `main` | 本番環境（常にデプロイ可能な状態） | ❌ 禁止 |
| `develop` | 開発統合ブランチ（任意） | ❌ 禁止 |
| `feature/*` | 機能開発 | ✅ 可 |
| `fix/*` | バグ修正 | ✅ 可 |
| `hotfix/*` | 緊急バグ修正 | ✅ 可 |
| `docs/*` | ドキュメント修正 | ✅ 可 |
| `refactor/*` | リファクタリング | ✅ 可 |

---

## ブランチ命名規則

```
{種別}/#{Issue番号}-{内容の簡潔な説明}

例:
feature/#12-user-authentication
fix/#34-login-error-handling
hotfix/#56-payment-null-pointer
docs/#78-update-api-spec
refactor/#90-simplify-auth-module
```

**ルール:**
- 英小文字とハイフンのみ使用
- Issue番号を必ず含める
- 説明は動詞から始める（add-, fix-, update-, remove-）
- `{種別}/#{Issue番号}-` を除いた**説明部分を20文字以内**を目安に（ブランチ名全体は30文字程度まで）

---

## 作業フロー

```
1. Issueを確認・作成する
2. mainから新しいブランチを作成
   git checkout main
   git pull origin main
   git checkout -b feature/#12-user-authentication

3. 開発・コミット（commit-convention.md参照）

4. PRを作成
   - ベースブランチ: main（またはdevelop）
   - レビュワー: GitHub Actions（AI自動レビュー）

5. CI/CDが通ることを確認

6. マージ後、ブランチを削除
```

---

## マージ戦略

- 通常: **Squash and merge**（コミット履歴をクリーンに保つ）
- hotfix: **Merge commit**（追跡しやすくするため）

---

## Claude Code向け注意事項

- 作業開始前に必ず`git status`でブランチを確認すること
- `main`ブランチで直接作業しないこと
- Issue番号がない場合は、先にIssueを作成すること
