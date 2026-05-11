#!/bin/bash
# post-edit-lint.sh
# ファイル編集後にlint/formatを自動実行するフック
# PostToolUse（Edit/Write/Create）で呼ばれる

FILE_PATH="$1"

# ファイルが存在しない場合はスキップ
if [ -z "$FILE_PATH" ] || [ ! -f "$FILE_PATH" ]; then
  exit 0
fi

EXT="${FILE_PATH##*.}"

case "$EXT" in
  # JavaScript / TypeScript
  js|jsx|ts|tsx)
    # ESLint（設定ファイルがあれば実行）
    if [ -f ".eslintrc*" ] || [ -f "eslint.config*" ]; then
      npx eslint --fix "$FILE_PATH" 2>/dev/null && \
        echo "✅ ESLint: $FILE_PATH"
    fi
    # Prettier（設定ファイルがあれば実行）
    if [ -f ".prettierrc*" ] || [ -f "prettier.config*" ]; then
      npx prettier --write "$FILE_PATH" 2>/dev/null && \
        echo "✅ Prettier: $FILE_PATH"
    fi
    ;;

  # Python
  py)
    if command -v ruff &> /dev/null; then
      ruff check --fix "$FILE_PATH" 2>/dev/null && \
        echo "✅ Ruff: $FILE_PATH"
      ruff format "$FILE_PATH" 2>/dev/null
    elif command -v flake8 &> /dev/null; then
      flake8 "$FILE_PATH" 2>/dev/null
    fi
    ;;

  # Go
  go)
    if command -v gofmt &> /dev/null; then
      gofmt -w "$FILE_PATH" 2>/dev/null && \
        echo "✅ gofmt: $FILE_PATH"
    fi
    ;;
esac

exit 0
