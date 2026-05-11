# スキル: 仕様書からタスクIssueを一括起票

## 使い方
```
/spec-to-tasks
```

## 処理手順

0. `specs/requirements.md` を読み込み、プロジェクト概要・機能要件が記入済みであることを確認する
   - 空テンプレートのままの場合（プロジェクト名・機能要件が未記入）は処理を中止し、
     ユーザーに「先に requirements.md を記入してください」と伝える
1. `specs/requirements.md` と `specs/basic-design.md` を読み込む
   - `basic-design.md` が記入済みの場合: 機能の実装方針・依存関係を把握するために参照する
   - `basic-design.md` が空の場合: requirements.md のみを参照して続行する
2. 未対応の機能要件（F-XXX）を洗い出す
3. GitHub Labels が存在するか確認し、なければ作成する
   ```
   mcp__github__create_label: { name: "must", color: "d73a4a" }
   mcp__github__create_label: { name: "should", color: "e4e669" }
   mcp__github__create_label: { name: "could", color: "0075ca" }
   ```
4. 既存のGitHub Issueと照合し、未起票のものを特定する
5. 各機能要件に対して以下の形式でIssueを起票する

## Issueの形式

タイトル: `[task] {機能名}の実装`

本文テンプレート:
```markdown
## 対応仕様
- ファイル: specs/requirements.md
- 機能ID: F-XXX

## タスク概要
{機能の説明}

## 受け入れ条件
- [ ] 仕様書に記載された機能が動作する
- [ ] テストが作成されている
- [ ] 関連ドキュメントが更新されている

## 依存関係
Depends on: （あれば記載）
```

## 注意事項

- 既にIssueが存在する機能は重複して起票しない
- Must / Should / Could の順で起票する
- 1機能 = 1Issueを原則とする（大きい場合は分割）
- GitHub MCPが使えない場合は`.github/ISSUE_TEMPLATE/spec-task.md`を参照して手動作成

## 使用ツール
- `mcp__github__create_issue`（GitHub MCP）
- Read: `specs/requirements.md`
- Read: `specs/basic-design.md`（関連する設計情報の参照）
