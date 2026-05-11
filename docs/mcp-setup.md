# MCP（Model Context Protocol）セットアップガイド

Claude CodeでMCPサーバーを使えるようにする手順です。

---

## 前提条件

- Node.js 18以上がインストールされていること
- Claude Codeがインストールされていること

---

## 1. GitHub MCP（Issue・PR操作）

### セットアップ手順

1. GitHubでPersonal Access Tokenを作成

   **Fine-grained tokens（推奨）:**
   ```
   GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
   → Generate new token

   必要な権限:
   ✅ Contents: Read and write
   ✅ Issues: Read and write
   ✅ Pull requests: Read and write
   ✅ Metadata: Read-only（自動付与）
   ```

   **Classic tokens（互換目的）:**
   ```
   GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   → Generate new token

   必要なスコープ:
   ✅ repo（全て）
   ✅ read:org
   ```

2. `.env`に追加
   ```
   GITHUB_PERSONAL_ACCESS_TOKEN=ghp_xxxxxxxxxxxx
   ```

3. `.mcp.json`はすでに設定済みです。Claude Codeを再起動するだけで有効になります。

### 使い方の例
```
「Issue #12の内容を実装して」
「このエラーをIssueとして起票して」
「feature/#12ブランチにPRを作成して」
```

---

## 2. Memory MCP（セッション記憶）

### セットアップ手順

```bash
# インストール（初回のみ）
npm install -g claude-mem
```

Claude Codeを再起動すると自動的に有効になります。

### 使い方の例
```
「今日決めたことを記憶して」
「前回のセッションで何を決めたか教えて」
```

---

## 3. Filesystem MCP（ファイルアクセス）

追加インストール不要です。`.mcp.json`の設定で有効になります。

---

## 4. MCPの動作確認

Claude Codeで以下のコマンドを実行:
```
/mcp
```

接続済みのMCPサーバー一覧が表示されれば成功です。

---

## 5. トラブルシューティング

**MCPが認識されない場合:**
1. Claude Codeを完全に終了して再起動
2. `.mcp.json`のJSONフォーマットを確認（構文エラーがないか）
3. 環境変数が正しく設定されているか確認

**GitHub MCPでエラーが出る場合:**
- Personal Access Tokenの有効期限を確認
- 必要なスコープが付与されているか確認

---

## 6. 参考リンク

- [Claude Code MCP公式ドキュメント](https://docs.anthropic.com/en/docs/claude-code/mcp)
- [MCP公式サイト](https://modelcontextprotocol.io)
