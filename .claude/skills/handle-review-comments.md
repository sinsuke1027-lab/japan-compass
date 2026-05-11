# スキル: AIレビューコメント対応

## 使い方
```
/handle-review-comments
```

PR番号を指定する場合:
```
/handle-review-comments #42
```

## 概要
GitHub ActionsのAIレビュー（`ai-code-review.yml` / `ai-spec-check.yml` / `ai-security-check.yml`）
が出力したコメントを読み込み、指摘事項を分類・対応・再コミットまで一括で行う。

---

## 処理手順

### STEP 0: AIレビューの完了確認
GitHub Actions の AI レビューワークフローが完了しているか確認する。

GitHub MCPが使える場合:
```
mcp__github__list_workflow_runs: {status: "in_progress", per_page: 5}
```
GitHub MCPが使えない場合:
```bash
gh run list --limit 5 --json status,name,conclusion
```
未完了のワークフローがある場合は完了を待ってから STEP 1 に進む。

### STEP 1: PRのレビューコメントを取得
GitHub MCPを使って対象PRのコメントを取得する。

```
mcp__github__get_pull_request_comments: PR番号
```

GitHub MCPが使えない場合:
```bash
gh pr view {PR番号} --comments
```

### STEP 2: 指摘事項を重要度別に分類
取得したコメントを以下の3段階に分類し、一覧表示する。

| 重要度 | 分類基準 | 対応方針 |
|---|---|---|
| 🔴 ブロッカー | セキュリティ脆弱性・仕様違反・テスト失敗 | **必ず修正してからマージ** |
| 🟡 要対応 | バグ・ロジックエラー・命名問題 | 修正推奨 |
| 🔵 提案 | 可読性・パフォーマンス改善提案 | 任意対応 |

### STEP 3: ユーザーに対応方針を確認
分類結果を提示し、以下を確認する。

```
🔴 ブロッカー: X件（全て修正します）
🟡 要対応: X件（対応しますか？）
🔵 提案: X件（対応しますか？）
```

🔴は自動的に全対応。🟡🔵はユーザーの判断を仰ぐ。

### STEP 4: 指摘事項を修正
対応確定した指摘を上から順に修正する。
各修正後に `post-edit-lint.sh` フックが自動実行される。

修正時の注意:
- 1指摘 = 1コミットを基本とするが、同一ファイル内の関連する複数修正はまとめて1コミットにしてよい
- `docs/commit-convention.md` に従いコミットメッセージを生成する
  - 例: `fix(#42): AIレビュー指摘 - 認証チェックの漏れを修正`
  - 複数まとめる場合: `fix(#42): AIレビュー指摘 - セキュリティ関連3件を修正`

### STEP 5: 修正後のセルフレビュー
`/review-check` を実行し、修正によって新たな問題が生じていないか確認する。

### STEP 6: GitHub レビューコメントを解決済みにする
修正が完了した指摘事項を GitHub 上で「Resolve conversation」する。

GitHub MCPが使える場合:
```
mcp__github__update_pull_request_review_comment: {resolved: true}
```
GitHub MCPが使えない場合:
→ ブラウザで PR を開き、修正済みの各コメントを手動で「Resolve conversation」をクリック

### STEP 6.5: プッシュ・CI確認
```bash
git push origin {現在のブランチ名}
```

プッシュ後、再度GitHub ActionsのAIレビューが実行される。
新たな指摘がなければSTEP 7へ進む。
新たな指摘があれば STEP 2 に戻る。

### STEP 7: 対応完了報告
```
## ✅ レビューコメント対応完了

🔴 ブロッカー: X件 → 全て修正済み
🟡 要対応: X件 → X件修正済み / X件スキップ
🔵 提案: X件 → X件対応済み / X件スキップ

修正コミット:
- {コミットSHA}: {コミットメッセージ}

### 次のステップ
マージの準備ができました。
Superpowers の /finishing-a-development-branch を実行してください。
```

## 注意事項
- 🔴ブロッカーが残っている状態でマージを提案しない
- 修正方針が不明な指摘はユーザーに判断を仰ぐ
- 指摘への対応でスコープ外の変更をしない
- GitHub MCPが使えない場合は `gh` CLIで代替する
