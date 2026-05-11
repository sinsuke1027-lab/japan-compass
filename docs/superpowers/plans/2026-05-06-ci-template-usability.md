# CI テンプレート使いやすさ改善 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** テンプレートを初めて使う人が迷わずCIを設定でき、PRでテスト結果を確認できるようにする。

**Architecture:** `ci.yml` にセットアップバナー・視覚的マーカー・PRコメントステップを追加し、`docs/ci-setup.md` を新設してセットアップ手順の入り口とする。既存のワークフロー構造（`concurrency`・`on:` トリガー）は変更しない。

**Tech Stack:** GitHub Actions（`actions/github-script@v7`）、YAML、Markdown

---

## ファイル構成

| 操作 | ファイル |
|------|---------|
| 修正 | `.github/workflows/ci.yml` |
| 新規作成 | `docs/ci-setup.md` |

---

### Task 1: `ci.yml` にセットアップバナーと視覚的マーカーを追加

**Files:**
- Modify: `.github/workflows/ci.yml`

- [ ] **Step 1: `ci.yml` の `name:` 行の直後にセットアップバナーを追加する**

`.github/workflows/ci.yml` を開き、`name: CI テスト実行` の直後（`on:` の前）に以下を追加する:

```yaml
name: CI テスト実行

# ============================================================
# 🚀 セットアップ手順（プロジェクト開始時に一度だけ設定）
#   STEP 1: 使用するスタックを下の「選択スタック」に記入する
#   STEP 2: 対応するブロックのコメントを解除する（▼〜▲ の範囲）
#   STEP 3: PRを作成してCIが動くことを確認する
#
# 選択スタック: （例: Node.js / Python / Go）
# ============================================================

on:
```

- [ ] **Step 2: 各スタックブロックに視覚的マーカーを追加する**

`checkout` ステップの後にある3つのスタックブロックを以下のように置き換える:

```yaml
      # ▼ Node.js を使う場合はここからコメント解除 ▼
      # - uses: actions/setup-node@v4
      #   with:
      #     node-version: '20'
      #     cache: 'npm'
      # - name: 依存パッケージのインストール
      #   run: npm ci
      # - id: run-tests
      #   name: テスト実行
      #   run: npm test
      # - name: 型チェック（TypeScript の場合）
      #   run: npx tsc --noEmit
      # ▲ Node.js ここまで ▲

      # ▼ Python を使う場合はここからコメント解除 ▼
      # - uses: actions/setup-python@v5
      #   with:
      #     python-version: '3.12'
      # - name: 依存パッケージのインストール
      #   run: pip install -r requirements.txt
      # - id: run-tests
      #   name: テスト実行
      #   run: pytest --tb=short
      # ▲ Python ここまで ▲

      # ▼ Go を使う場合はここからコメント解除 ▼
      # - uses: actions/setup-go@v5
      #   with:
      #     go-version: '1.22'
      # - id: run-tests
      #   name: テスト実行
      #   run: go test ./...
      # ▲ Go ここまで ▲
```

- [ ] **Step 3: YAMLシンタックスを確認する**

```bash
python -c "import yaml, sys; yaml.safe_load(open('.github/workflows/ci.yml'))" 2>&1 && echo "OK"
```

Python がない場合は代わりに:
```bash
node -e "require('js-yaml').load(require('fs').readFileSync('.github/workflows/ci.yml','utf8')); console.log('OK')"
```

期待出力: `OK`

- [ ] **Step 4: コミットする**

```bash
git add .github/workflows/ci.yml
git commit -m "chore: add setup banner and visual markers to ci.yml"
```

---

### Task 2: `ci.yml` に PR コメントステップを追加

**Files:**
- Modify: `.github/workflows/ci.yml`

- [ ] **Step 1: `permissions` に `pull-requests: write` を追加する**

現在の `permissions` ブロックを以下に変更する:

```yaml
permissions:
  contents: read
  pull-requests: write
```

- [ ] **Step 2: `jobs.test.steps` の末尾にコメントステップを追加する**

全スタックブロックの後（ファイルの最後）に以下を追加する:

```yaml
      - name: PR にテスト結果をコメント
        if: always() && github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const status = '${{ job.status }}' === 'success' ? '✅ テスト通過' : '❌ テスト失敗';
            const sha = '${{ github.sha }}'.substring(0, 7);
            const body = [
              '<!-- ci-result -->',
              `## ${status}`,
              '',
              '| 項目 | 内容 |',
              '|------|------|',
              `| ブランチ | \`${{ github.head_ref }}\` → \`${{ github.base_ref }}\` |`,
              `| コミット | \`${sha}\` |`,
              `| 実行ログ | [GitHub Actions](https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }}) |`,
            ].join('\n');

            const { data: comments } = await github.rest.issues.listComments({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
            });

            const existing = comments.find(c =>
              c.user.type === 'Bot' && c.body.includes('<!-- ci-result -->')
            );

            if (existing) {
              await github.rest.issues.updateComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                comment_id: existing.id,
                body,
              });
            } else {
              await github.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.issue.number,
                body,
              });
            }
```

- [ ] **Step 3: YAMLシンタックスを確認する**

```bash
python -c "import yaml, sys; yaml.safe_load(open('.github/workflows/ci.yml'))" 2>&1 && echo "OK"
```

期待出力: `OK`

- [ ] **Step 4: 完成後の `ci.yml` 全体を確認する**

ファイルの構造が以下の順序になっていることを確認する:

1. `name:` + セットアップバナー
2. `on:` + `concurrency:` + `permissions:`（`pull-requests: write` 追加済み）
3. `jobs.test.steps:`
   - `actions/checkout@v4`
   - Node.js ブロック（▼▲マーカー付き、コメントアウト状態）
   - Python ブロック（▼▲マーカー付き、コメントアウト状態）
   - Go ブロック（▼▲マーカー付き、コメントアウト状態）
   - PRコメントステップ

- [ ] **Step 5: コミットする**

```bash
git add .github/workflows/ci.yml
git commit -m "feat: add PR comment step for test results to ci.yml"
```

---

### Task 3: `docs/ci-setup.md` を新設する

**Files:**
- Create: `docs/ci-setup.md`

- [ ] **Step 1: `docs/ci-setup.md` を以下の内容で作成する**

```markdown
# CI セットアップガイド

このプロジェクトテンプレートの CI（`.github/workflows/ci.yml`）を
使えるようにするための 3 ステップ手順です。

---

## セットアップチェックリスト

- [ ] **STEP 1**: `ci.yml` を開き、冒頭の「選択スタック」にプロジェクトで使う技術を記入する
- [ ] **STEP 2**: 対応するスタックブロック（▼〜▲ の範囲）のコメントを解除する
- [ ] **STEP 3**: PR を作成し、Actions タブで CI が実行されることを確認する

---

## スタック別 設定例

### Node.js / TypeScript

`ci.yml` の `▼ Node.js` ブロックをコメント解除すると以下が有効になります:

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'
- name: 依存パッケージのインストール
  run: npm ci
- id: run-tests
  name: テスト実行
  run: npm test
- name: 型チェック（TypeScript の場合）
  run: npx tsc --noEmit
```

**前提:** `package.json` に `"test"` スクリプトが定義されていること。

---

### Python

`ci.yml` の `▼ Python` ブロックをコメント解除すると以下が有効になります:

```yaml
- uses: actions/setup-python@v5
  with:
    python-version: '3.12'
- name: 依存パッケージのインストール
  run: pip install -r requirements.txt
- id: run-tests
  name: テスト実行
  run: pytest --tb=short
```

**前提:** `requirements.txt` が存在し、`pytest` が含まれていること。

---

### Go

`ci.yml` の `▼ Go` ブロックをコメント解除すると以下が有効になります:

```yaml
- uses: actions/setup-go@v5
  with:
    go-version: '1.22'
- id: run-tests
  name: テスト実行
  run: go test ./...
```

**前提:** `go.mod` が存在すること。

---

## よくある問題と対処

**Q1. テストコマンドが見つからない（`npm test` が失敗する）**
`package.json` の `scripts` に `"test"` が定義されているか確認してください。
定義がない場合は `"test": "jest"` などを追加してください。

---

**Q2. 依存パッケージのインストールに失敗する**
Node.js の場合: `package-lock.json` がコミットされているか確認してください（`npm ci` には必須）。
Python の場合: `requirements.txt` が存在し、`pytest` が含まれているか確認してください。

---

**Q3. PR にコメントが投稿されない**
`ci.yml` の `permissions` に `pull-requests: write` が含まれているか確認してください。
リポジトリの Settings → Actions → General → Workflow permissions で
「Read and write permissions」が有効になっているか確認してください。

---

**Q4. CI が動かない（Actions タブに何も表示されない）**
`ci.yml` の `on:` トリガーが `pull_request` になっていることを確認してください。
`push` ブランチへの直接プッシュでは動作しません。必ず PR を作成してください。
```

- [ ] **Step 2: ファイルが正しく作成されたことを確認する**

```bash
head -5 docs/ci-setup.md
```

期待出力:
```
# CI セットアップガイド
```

- [ ] **Step 3: コミットする**

```bash
git add docs/ci-setup.md
git commit -m "docs: add ci-setup.md for template onboarding"
```
