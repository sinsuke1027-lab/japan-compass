# GitHub Actions CI セットアップガイド

このドキュメントでは、プロジェクトの GitHub Actions CI を初期設定するための手順を説明します。

---

## セクション 1: セットアップチェックリスト

プロジェクト開始時に、以下の 4 ステップで CI を有効化してください。

### STEP 1: `.github/workflows/ci.yml` を開く

`.github/workflows/ci.yml` ファイルを開き、冒頭の「選択スタック」セクション（9行目付近）を確認します：

```yaml
# 選択スタック: ここに記入 → （例: Node.js / Python / Go）
```

### STEP 2: プロジェクトで使う技術をコメント欄に記入

上の「選択スタック」欄に、プロジェクトで使用する技術スタックを記入します。例：

```yaml
# 選択スタック: ここに記入 → Node.js + npm
```

### STEP 3: 対応するスタックブロックのコメントを解除

`ci.yml` には 3 つのスタック（Node.js / Python / Go）がマーク付きで含まれています。

使用するスタックに対応するブロック（`▼` と `▲` で囲まれた部分）のコメント（`#`）を解除します。

**その後、以下のフォールバックステップを削除します：**

```yaml
# ▼ スタック設定後にこのstepを削除してください ▼
- name: ⚠️ スタック未設定（このstepを削除してください）
  run: |
    echo "::error::ci.yml のスタックブロックがすべてコメントアウトされています。"
    echo "::error::docs/ci-setup.md を参照してSTEP 1-2を実行し、このstepを削除してください。"
    exit 1
# ▲ スタック設定後にこのstepを削除してください ▲
```

このフォールバックステップは、スタック設定完了後に **必ず削除** してください。

### STEP 4: PR を作成して CI の実行を確認

上記の変更をコミットして PR を作成します。GitHub リポジトリの **Actions** タブで CI が実行されることを確認してください。

- 緑色のチェックマーク：CI が成功しています
- 赤色の X マーク：テストが失敗しているか、設定エラーが発生しています

---

## セクション 2: スタック別 設定例

各スタックの設定内容を以下に示します。

### Node.js の場合

以下のブロック（行 40-52）をコメント解除すると、Node.js でのテスト実行が有効になります。

**前提条件:**
- プロジェクトルートに `package.json` が存在すること
- `npm test` コマンドでテストが実行できること（またはカスタムテストコマンド）
- TypeScript を使用する場合、`tsconfig.json` が設定されていること

**コメント解除後のコード:**

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

**セットアップ例:**

```json
{
  "scripts": {
    "test": "jest",
    "type-check": "tsc --noEmit"
  }
}
```

### Python の場合

以下のブロック（行 54-63）をコメント解除すると、Python でのテスト実行が有効になります。

**前提条件:**
- プロジェクトルートに `requirements.txt` が存在すること
- `pytest` がインストールされていること（またはテストフレームワーク）

**コメント解除後のコード:**

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

**セットアップ例:**

```plaintext
# requirements.txt
pytest==7.4.0
pytest-cov==4.1.0
```

```bash
# テストコマンド実行例
pytest tests/ --tb=short
```

### Go の場合

以下のブロック（行 65-72）をコメント解除すると、Go でのテスト実行が有効になります。

**前提条件:**
- Go のテストファイルが `*_test.go` の形式で存在すること
- `go.mod` ファイルが存在すること

**コメント解除後のコード:**

```yaml
- uses: actions/setup-go@v5
  with:
    go-version: '1.22'
- id: run-tests
  name: テスト実行
  run: go test ./...
```

**セットアップ例:**

```bash
# テストコマンド実行例
go test ./... -v
go test ./... -cover
```

---

## セクション 3: よくある問題と対処

### Q1: テストコマンドが見つからない

**症状:** `npm test` または `pytest` を実行時に "command not found" エラーが発生する

**原因:**
- テストコマンドが `package.json` または `setup.py` に定義されていない
- テストツール自体がインストールされていない

**対処方法:**

**Node.js の場合:**

`package.json` の `scripts` に `"test"` を追加してください（`jest` の他に `vitest` や `mocha` も使用できます）:

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

```bash
# 依存パッケージに追加
npm install --save-dev jest
```

**Python の場合:**
```bash
# requirements.txt に pytest を追加
pytest>=7.0.0

# または pip install を実行
pip install pytest
```

### Q2: 依存パッケージのインストールに失敗する

**症状:** CI ログに "pip install failed" や "npm ci failed" が表示される

**原因:**
- `requirements.txt` または `package-lock.json` が古い
- パッケージバージョンの互換性問題
- ネットワークの一時的な問題

**対処方法:**

**Node.js の場合:**
```bash
# package-lock.json を削除して再生成
rm package-lock.json
npm install
git add package-lock.json
git commit -m "Update package-lock.json"
```

**Python の場合:**
```bash
# requirements.txt のバージョン指定を確認・更新
pip install --upgrade pip setuptools
pip install -r requirements.txt
```

### Q3: PR にコメントが投稿されない

**症状:** テスト結果がコメントとして PR に投稿されない

**原因:**
- GitHub の権限設定が不足している
- リポジトリの `permissions` が正しく設定されていない

**対処方法:**

`ci.yml` の `permissions` セクションが以下の設定になっているか確認してください：

```yaml
permissions:
  contents: read
  pull-requests: write  # ← この行が必須
```

この設定がない場合、PR へのコメント投稿が失敗します。

### Q4: CI が動かない（on トリガーの設定ミス）

**症状:** PR を作成しても Actions タブに CI が表示されない

**原因:**
- `on:` セクションが正しく設定されていない
- ブランチ保護ルールの設定により実行されていない

**対処方法:**

`ci.yml` の `on:` セクションが以下のように設定されているか確認してください：

```yaml
on:
  pull_request:
    types: [opened, synchronize]
```

このトリガーにより、PR が作成または更新されると自動的に CI が実行されます。

---

## 追加設定（オプション）

### キャッシュの有効化

各スタックの依存パッケージ取得を高速化するため、キャッシュ機能が `ci.yml` に組み込まれています。

**Node.js:**
```yaml
cache: 'npm'
```

**Python:**
```yaml
cache: 'pip'
```

**Go:**
```yaml
go-version: '1.22'  # Go モジュールキャッシュは自動有効
```

### カスタムテストコマンド

デフォルトのテストコマンドを変更する場合は、`ci.yml` の該当ステップを編集してください。

```yaml
- name: テスト実行
  run: npm run test:ci  # カスタムコマンド
```

---

## 参考リンク

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [setup-node](https://github.com/actions/setup-node)
- [setup-python](https://github.com/actions/setup-python)
- [setup-go](https://github.com/actions/setup-go)
- [github-script](https://github.com/actions/github-script)
