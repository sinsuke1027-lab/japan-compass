# スキル: デプロイワークフロー

## 使い方
```
/workflow-deploy
```

## 前提条件
- `main` ブランチへのマージが完了していること
- GitHub Secrets に `GCP_SA_KEY` / `GCP_PROJECT_ID` が登録済みであること

---

## 処理手順

### STEP 1: セキュリティチェックリストの実行
`checklists/security-check.md` の全項目を確認する。
未チェック項目があれば、デプロイを中止してユーザーに報告する。

### STEP 2: デプロイ前チェックリストの実行
`checklists/deploy-check.md` の全項目を確認する。
以下は特に重視する。

- [ ] 全テストがパスしている
- [ ] `.env` がコミットされていない
- [ ] デプロイ先GCPプロジェクトIDが正しい
- [ ] DBマイグレーションの要否を確認した

### STEP 3: テスト実行の確認
```bash
# テスト実行（プロジェクトに合わせて変更）
# npm test
# pytest
```
テストが失敗している場合はデプロイを中止する。

### STEP 4: mainブランチの最新状態を確認
```bash
git checkout main
git pull origin main
git log --oneline -5
```
最新コミットがデプロイ対象であることをユーザーに確認する。

### STEP 5: GitHub Actions デプロイの起動確認
`deploy.yml` が自動起動することを案内する。

```
mainへのプッシュ/マージにより deploy.yml が自動実行されます。
以下のURLでデプロイ状況を確認してください:
https://github.com/{owner}/{repo}/actions
```

手動デプロイが必要な場合:
```bash
# workflow_dispatch でのデプロイ
# GitHub Actions → GCPデプロイ → Run workflow
```

### STEP 5.5: デプロイ完了を待つ
GitHub Actions の完了を確認してから次のステップへ進む。

```bash
# デプロイワークフローの完了を待つ
gh run list --workflow=deploy.yml --limit 1
gh run watch   # インタラクティブに待機（Ctrl+C で抜けてもバックグラウンドで継続）
```

または GitHub Actions ページを手動でリロードして `completed` になるまで待つ。

### STEP 6: スモークテスト結果の確認
`post-deploy-smoke-test.yml` の実行完了を待ち、結果を確認する。

- ✅ 成功: STEP 7へ進む
- ❌ 失敗: Issueが自動起票されているか確認し、ユーザーに報告・中止

### STEP 7: Cloud Loggingでエラーがないか確認
```bash
# .envからGCP_PROJECT_IDを取得してエラーログを確認
GCP_PROJECT=$(grep GCP_PROJECT_ID .env | cut -d= -f2)
gcloud logging read \
  "severity>=ERROR" \
  --project="$GCP_PROJECT" \
  --freshness=5m \
  --limit=20
```
gcloud コマンドが使えない場合: GCP Console → Logging → ログエクスプローラ でエラーを確認する。
エラーが検出された場合はユーザーに報告する。

### STEP 8: MEMORY.md にデプロイ記録を追記
```
直近の完了タスク:
- {今日の日付}: {バージョン/コミットSHA} を本番デプロイ完了
```

### STEP 9: 完了報告
```
## 🚢 デプロイ完了

✅ セキュリティチェック: 問題なし
✅ デプロイ前チェック: 全項目クリア
✅ スモークテスト: 正常
✅ エラーログ: 検出なし
✅ MEMORY.md: 更新済み

デプロイURL: {APP_URL}
```

## ロールバック手順（問題発生時）
```bash
# サービス名とリージョンは CLAUDE.md の技術スタック欄を参照
SERVICE_NAME="api"   # CLAUDE.md のサービス名に合わせて変更
GCP_REGION="asia-northeast1"
GCP_PROJECT=$(grep GCP_PROJECT_ID .env | cut -d= -f2)

# 直前のCloud Runリビジョンに戻す
gcloud run services update-traffic $SERVICE_NAME \
  --to-revisions=PREVIOUS=100 \
  --region=$GCP_REGION \
  --project=$GCP_PROJECT

# または前回の安定タグにデプロイ
# gcloud run deploy $SERVICE_NAME --image {前回のイメージURL} --region=$GCP_REGION
```

## 注意事項
- STEP 1・2でチェック漏れがあればデプロイを中止する
- スモークテスト失敗時は即座にロールバック手順を案内する
- `gcloud` コマンドが使えない場合はGCPコンソールのURLを案内する
