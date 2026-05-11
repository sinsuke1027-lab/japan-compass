# Claude API コスト管理ポリシー

---

## 1. 基本方針

GitHub ActionsでClaude APIを呼び出す際、**コストが予想外に膨らまないよう**以下のルールを設けます。

---

## 2. ワークフロー別トークン上限

| ワークフロー | max_tokens | 呼び出しモデル | 発動条件 |
|---|---|---|---|
| ai-code-review.yml | 2,000 | claude-sonnet-4-6 | PR作成・更新時 |
| ai-spec-check.yml | 1,500 | claude-sonnet-4-6 | PR作成時 |
| ai-security-check.yml | 1,500 | claude-sonnet-4-6 | PR作成時 |
| ai-test-gen.yml | 3,000 | claude-sonnet-4-6 | PR作成時（手動トリガー可） |
| release-notes.yml | 1,000 | claude-sonnet-4-6 | mainマージ時 |
| issue-auto-create.yml | 800 | claude-sonnet-4-6 | CI失敗時 |

---

## 3. コスト削減のための設計ルール

### 不要な呼び出しを避ける
- ドキュメントのみの変更（`docs/**`, `*.md`）ではAIレビューをスキップ
- 同一PRへの連続プッシュは最新のみ処理（`concurrency`設定で制御）
- WIPラベルのついたPRはAIレビューをスキップ

### プロンプトを最適化する
- 差分（diff）のみを渡し、ファイル全体を送らない
- 仕様書は関連部分のみ抽出して渡す
- コンテキストは必要最小限にする

---

## 4. 月間コスト目安

```
想定: 1日5PR × 20営業日 = 月100PR

AIレビュー系（100PR × 約3回呼び出し × 平均2,000tokens）
= 約600,000 output tokens/月

claude-sonnet-4-6の場合: 約$9/月（参考値・変動あり）
```

※ 実際のコストはAnthropic料金ページで確認してください。

---

## 5. コスト監視

- GitHub Actionsのログで各ワークフローの実行回数を確認
- Anthropicダッシュボードで月次使用量を確認
- 想定を大幅に超える場合はワークフローの`on:`トリガーを見直す

---

## 6. 緊急時の対応

コストが想定の2倍を超えた場合:
1. 全AIワークフローを一時停止（ワークフローを`workflow_dispatch`のみに変更）
2. 原因を調査（ループ・無限トリガー等）
3. 修正後に再有効化
