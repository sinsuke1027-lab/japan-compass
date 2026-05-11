---
paths:
  - "src/components/**"
  - "src/pages/**"
  - "src/app/**"
  - "src/views/**"
---

# フロントエンド開発ルール

このファイルはフロントエンドのコードを編集するときのみ有効です。

## コンポーネント設計

- 1ファイル1コンポーネント原則
- コンポーネントは`src/components/`に配置
- ページコンポーネントは`src/pages/`または`src/app/`に配置
- 共通UIパーツと機能コンポーネントを分離する

## 命名規則

- コンポーネント名: PascalCase（例: `UserCard.tsx`）
- フック名: camelCase、`use`プレフィックス（例: `useAuth.ts`）
- 型定義: PascalCase、`Props`サフィックス（例: `UserCardProps`）

## 禁止事項

- コンポーネント内での直接API呼び出し（カスタムフックに切り出す）
- インラインスタイルの多用（CSSモジュールまたはTailwindを使用）
- `any`型の使用

## アクセシビリティ

- インタラクティブ要素には`aria-label`を付与
- 画像には`alt`属性を必ず設定
- キーボード操作が可能な実装にする

## パフォーマンス

- 不要な再レンダリングを避けるため`useMemo`/`useCallback`を適切に使用
- 大きなリストには仮想化（react-virtual等）を検討
- 画像は遅延読み込みを基本とする
