# システムアーキテクチャ

---

## 1. 全体構成図

```
（構成図を記載）

例:
┌─────────────────────────────────────────┐
│                  GCP                    │
│                                         │
│  ┌──────────┐    ┌──────────────────┐  │
│  │Cloud Run │    │   Cloud SQL      │  │
│  │(Backend) │───▶│   (PostgreSQL)   │  │
│  └──────────┘    └──────────────────┘  │
│       ▲                                 │
│       │          ┌──────────────────┐  │
│  ┌──────────┐    │  Cloud Storage   │  │
│  │  Cloud   │    │  (Static Files)  │  │
│  │  Run     │    └──────────────────┘  │
│  │(Frontend)│                          │
│  └──────────┘    ┌──────────────────┐  │
│                  │  Secret Manager  │  │
│                  │  (API Keys etc.) │  │
│                  └──────────────────┘  │
└─────────────────────────────────────────┘
         ▲
         │ HTTPS
    [ユーザー]
```

---

## 2. GCPサービス構成

| サービス | 用途 | 設定 |
|---|---|---|
| Cloud Run | アプリケーションホスティング | リージョン: asia-northeast1 |
| Cloud SQL | RDBMSデータベース | |
| Cloud Firestore | NoSQLデータベース（必要に応じて） | |
| Cloud Storage | ファイル・静的アセット保存 | |
| Cloud Logging | ログ集約・検索 | |
| Cloud Monitoring | メトリクス監視・アラート | |
| Secret Manager | APIキー・認証情報管理 | |
| Artifact Registry | Dockerイメージ管理 | |

---

## 3. CI/CDパイプライン

```
[開発者] → [feature branch]
              ↓ PR作成
         [GitHub Actions]
           ├─ AIコードレビュー
           ├─ 仕様整合性チェック
           ├─ セキュリティチェック
           ├─ テスト自動実行
           └─ テスト失敗→Issue自動起票
              ↓ mainマージ
         [GitHub Actions]
           ├─ ビルド
           ├─ GCPデプロイ
           ├─ スモークテスト
           └─ リリースノート生成
```

---

## 4. セキュリティ設計

- 通信: HTTPS（TLS 1.2以上）
- 認証: （JWT / OAuth2 / Identity Platform）
- シークレット管理: GCP Secret Manager
- ネットワーク: VPC設定（必要に応じて）

---

## 5. 変更履歴

| 日付 | 変更内容 |
|------|---------|
| YYYY-MM-DD | 初版 |
