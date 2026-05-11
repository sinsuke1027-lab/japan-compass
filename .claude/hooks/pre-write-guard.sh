#!/bin/bash
# pre-write-guard.sh
# 書き込みを禁止すべきファイルへの操作をブロックするフック
# PreToolUse（Write/Edit）で呼ばれる
# exit 2 でブロック

FILE_PATH="$1"

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# ============================================================
# 🔴 絶対に書き込んではいけないファイル
# ============================================================

BLOCKED_EXACT=(
  ".env"
  ".env.production"
  ".env.staging"
)

FILENAME=$(basename "$FILE_PATH")

for BLOCKED in "${BLOCKED_EXACT[@]}"; do
  if [ "$FILENAME" = "$BLOCKED" ]; then
    echo "🚫 ブロック: $FILE_PATH への書き込みは禁止されています" >&2
    echo "   シークレットを含むファイルは直接編集しないでください" >&2
    echo "   .env.example を編集してください" >&2
    exit 2
  fi
done

# ============================================================
# 🔴 認証情報ファイルのブロック
# ============================================================

BLOCKED_PATTERNS=(
  "credentials/"
  "*.pem"
  "*.key"
  "*service-account*.json"
  "*-credentials.json"
)

for PATTERN in "${BLOCKED_PATTERNS[@]}"; do
  if [[ "$FILE_PATH" == $PATTERN ]]; then
    echo "🚫 ブロック: 認証情報ファイルへの書き込みは禁止されています: $FILE_PATH" >&2
    exit 2
  fi
done

# ============================================================
# 🟡 ハーネス設定ファイルの変更を警告（ブロックはしない）
# ============================================================

HARNESS_FILES=(
  ".claude/settings.json"
  ".claude/hooks/"
  "CLAUDE.md"
)

for HARNESS in "${HARNESS_FILES[@]}"; do
  if [[ "$FILE_PATH" == *"$HARNESS"* ]]; then
    echo "⚠️  警告: ハーネス設定ファイルを変更しようとしています: $FILE_PATH" >&2
    echo "   意図した変更であれば続行します" >&2
    break
  fi
done

exit 0
