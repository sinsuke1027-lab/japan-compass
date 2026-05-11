# スキル: Issue からブランチを作成

## 使い方
```
/create-branch #12
```

Issue番号を省略した場合は確認してから進める:
```
/create-branch
```

## 概要
`docs/branch-strategy.md` の命名規則に従い、GitHub Issue の内容から
適切なブランチ名を生成して自動作成する。
ヒューマンエラー（命名ミス・mainからの分岐忘れ等）を防ぐ。

---

## 処理手順

### STEP 1: Issue番号と種別を確認する
Issue番号が未指定の場合は以下を質問する:
- 対応するIssue番号は何か
- ブランチ種別はどれか

```
種別一覧:
  feature  - 新機能の実装
  fix      - バグ修正
  hotfix   - 緊急バグ修正（本番障害）
  docs     - ドキュメント修正
  refactor - リファクタリング
```

### STEP 2: Issueのタイトルを取得する
GitHub MCPを使って対象IssueのタイトルをAPIから取得する。

```
mcp__github__get_issue: {issue_number: {Issue番号}}
```

GitHub MCPが使えない場合:
```bash
gh issue view {Issue番号} --json title --jq '.title'
```

### STEP 3: ブランチ名を生成する
以下のルールでブランチ名を生成する（`docs/branch-strategy.md` 準拠）:

```
形式: {種別}/#{Issue番号}-{英語の短い説明}

変換ルール:
- 日本語タイトルは英語に意訳する（直訳不要・意味が通ればよい）
- 英小文字とハイフンのみ使用（スペース → ハイフン）
- 動詞から始める: add-, fix-, update-, remove-
- 全体で20文字以内を目安

例:
  Issue #12「ユーザー認証機能の追加」
  → feature/#12-add-user-authentication

  Issue #34「ログイン時のnullエラー」
  → fix/#34-fix-login-null-error
```

生成したブランチ名をユーザーに確認してから次のステップへ進む。

### STEP 4: mainから最新の状態でブランチを作成する

```bash
# 現在のブランチを確認
git status

# mainを最新にする
git checkout main
git pull origin main

# ブランチを作成して移動
git checkout -b {生成したブランチ名}

# 作成確認
git branch
```

### STEP 5: MEMORY.md の「作業中ブランチ」を更新する
```
作業中ブランチ: {生成したブランチ名}
```

`/update-memory` を呼ぶか、MEMORY.md の該当箇所を直接更新する。

### STEP 6: 完了報告
```
## ✅ ブランチ作成完了

ブランチ名: {ブランチ名}
対応Issue: #{Issue番号}
ベース: main（最新）

### 次のステップ
実装を開始してください。
完了後は `/review-check` → `/finishing-a-development-branch` の順で進めます。
```

---

## 注意事項
- `main` ブランチ上での作業中はブランチ作成前に `git stash` を提案する
- hotfix の場合はベースを `main` ではなく本番タグにする場合もある（ユーザーに確認する）
- ブランチ名に日本語・スペース・大文字を含めない
