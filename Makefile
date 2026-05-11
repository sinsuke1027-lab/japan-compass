# ============================================================
# Makefile - 開発用コマンド集
# ============================================================
# このファイルはテンプレートです。
# 各コマンドのコメントアウト行を、使用する技術スタックに合わせて解除してください。
# 例: Node.js なら "# npm install" の # を外す
#     Python なら "# pip install -r requirements.txt" の # を外す
# ============================================================

.PHONY: help setup install dev build test lint clean deploy

# デフォルト: ヘルプ表示
help:
	@echo "利用可能なコマンド:"
	@echo "  make setup     - 開発環境の初期セットアップ"
	@echo "  make install   - 依存パッケージのインストール"
	@echo "  make dev       - 開発サーバー起動"
	@echo "  make build     - プロダクションビルド"
	@echo "  make test      - テスト実行"
	@echo "  make lint      - コード品質チェック"
	@echo "  make clean     - ビルド成果物の削除"
	@echo "  make deploy    - GCPへのデプロイ"

# 開発環境セットアップ
setup:
	@echo "🚀 開発環境をセットアップしています..."
	@bash scripts/setup.sh

# 依存パッケージインストール
install:
	@echo "📦 パッケージをインストールしています..."
	# npm install
	# pip install -r requirements.txt

# 開発サーバー起動
dev:
	@echo "🔧 開発サーバーを起動しています..."
	# npm run dev

# プロダクションビルド
build:
	@echo "🏗 ビルドしています..."
	# npm run build

# テスト実行
test:
	@echo "🧪 テストを実行しています..."
	# npm test
	# pytest

# リント
lint:
	@echo "🔍 コード品質をチェックしています..."
	# npm run lint
	# flake8 .

# クリーン
clean:
	@echo "🧹 ビルド成果物を削除しています..."
	rm -rf dist/ build/ .next/ coverage/

# デプロイ（GCP）
deploy:
	@echo "🚢 GCPへデプロイしています..."
	# gcloud app deploy
	# gcloud run deploy
