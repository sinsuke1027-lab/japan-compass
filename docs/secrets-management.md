# シークレット・環境変数管理ガイド

---

## ⚠️ 絶対に守るルール

1. `.env`ファイルをGitにコミットしない
2. APIキー・パスワードをソースコードに直接書かない
3. シークレットをPRコメント・Issue・チャットに貼り付けない
4. 不要になったシークレットは即座に無効化する

---

## 1. GitHub Secrets に登録すべき値

CI/CD（GitHub Actions）で使用するシークレットは **GitHub Secretsに登録** します。

### 登録方法
```
GitHubリポジトリ → Settings → Secrets and variables → Actions → New repository secret
```

### 登録すべき値一覧

| シークレット名 | 内容 | 使用ワークフロー |
|---|---|---|
| `ANTHROPIC_API_KEY` | Claude API キー | 全AIレビュー系ワークフロー |
| `GCP_PROJECT_ID` | GCPプロジェクトID | deploy.yml |
| `GCP_SA_KEY` | GCPサービスアカウントキー（JSON） | deploy.yml |
| `SLACK_WEBHOOK_URL` | Slack通知用WebhookURL | notify.yml |

---

## 2. GCP Secret Manager に登録すべき値

**本番アプリケーションが実行時に使用するシークレット** はGCP Secret Managerで管理します。

### 登録方法
```bash
# GCP CLIで登録
echo -n "your-secret-value" | gcloud secrets create SECRET_NAME --data-file=-

# バージョン追加
echo -n "new-value" | gcloud secrets versions add SECRET_NAME --data-file=-
```

### 登録すべき値

| シークレット名 | 内容 |
|---|---|
| `database-url` | データベース接続文字列 |
| `app-secret-key` | アプリケーションシークレットキー |
| `anthropic-api-key` | Claude APIキー（本番用） |

---

## 3. ローカル開発環境

```bash
# .env.exampleをコピーして.envを作成
cp .env.example .env

# .envに実際の値を設定（このファイルはGitに含まれない）
```

---

## 4. 万が一シークレットをコミットした場合の対処

1. **即座に対象シークレットを無効化・再生成する**
2. `git-filter-repo`でコミット履歴から削除（推奨）
   ```bash
   pip install git-filter-repo
   git filter-repo --path <該当ファイル> --invert-paths
   ```
   または `git filter-branch`（非推奨・互換目的のみ）
3. 強制プッシュ（`--force-with-lease`）
4. GitHub Supportに連絡（キャッシュの削除依頼）

---

## 5. Claude Code向け注意事項

- シークレットを含むファイルは**絶対にReadもWriteもしない**
- `.env`ファイルの値を出力・ログに記録しない
- `process.env.SECRET`などの値をコンソール出力するコードを書かない
