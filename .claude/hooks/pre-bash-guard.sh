#!/bin/bash
# pre-bash-guard.sh
# 危険なBashコマンドを事前にブロックするフック
# PreToolUse（Bash）で呼ばれる
# exit 2 でブロック（Claude Codeに実行拒否を伝える）

CMD="$1"

# ============================================================
# 🔴 即時ブロックするパターン
# ============================================================

BLOCKED_PATTERNS=(
  "rm -rf /"
  "rm -rf \*"
  ":(){ :|:& };:"     # フォークボム
  "dd if=/dev/zero"
  "mkfs\."
  "> /dev/sda"
  "chmod -R 777 /"
  "curl .* | bash"
  "curl .* | sh"
  "wget .* | bash"
  "wget .* | sh"
)

for PATTERN in "${BLOCKED_PATTERNS[@]}"; do
  if echo "$CMD" | grep -qE "$PATTERN"; then
    echo "🚫 ブロック: 危険なコマンドを検出しました: $CMD" >&2
    echo "   パターン: $PATTERN" >&2
    exit 2
  fi
done

# ============================================================
# 🟡 .envファイルへの操作を警告してブロック
# ============================================================

if echo "$CMD" | grep -qE "(cat|echo|printf|tee|>).*\.env[^.]"; then
  echo "🚫 ブロック: .envファイルの直接操作は禁止されています" >&2
  echo "   コマンド: $CMD" >&2
  exit 2
fi

# ============================================================
# 🔴 mainブランチへの直接プッシュをブロック（通常・強制どちらも禁止）
# ============================================================

if echo "$CMD" | grep -qE "git push.*origin main|git push.*origin master"; then
  echo "🚫 ブロック: mainブランチへの直接プッシュは禁止されています" >&2
  echo "   PRを作成してマージしてください（docs/branch-strategy.md 参照）" >&2
  exit 2
fi

exit 0
