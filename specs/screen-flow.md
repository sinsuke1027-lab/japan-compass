# 画面遷移図

| 項目 | 内容 |
|------|------|
| プロジェクト名 | Japan Compass |
| 作成日 | 2026-05-12 |
| 最終更新 | 2026-05-12 |

---

## 1. 全体遷移図

```
┌──────────────────────────────────────────────────────────────────┐
│                        アプリ起動                                  │
└──────────────────────────┬───────────────────────────────────────┘
                           │
              ┌────────────▼────────────┐
              │   初回起動？             │
              └────────────┬────────────┘
                  YES │         │ NO
                      ▼         ▼
         ┌──────────────┐    ┌──────────────────────────────────────────┐
         │ SCR-001      │    │           Main Tab Navigator              │
         │ Welcome      │    │  🏠Home  📖Manners  🗺️Map  📔Journal  🚨Emergency │
         └──────┬───────┘    └──────────────────────────────────────────┘
                │                                 ▲
         ┌──────▼───────┐                         │
         │ SCR-002      │─────────────────────────┘
         │ Location     │   （許可 or スキップ後）
         │ Permission   │
         └──────────────┘
```

---

## 2. タブ別遷移図

### 🏠 Home タブ

```
SCR-010: Home
│
├──[Manner Tips カード]──────────→ SCR-020: Manner Category List
├──[Shrine Guide カード]─────────→ SCR-022: Shrine Guide
├──[Sustainable Map カード]──────→ SCR-030: Sustainable Activity Map
├──[My Journal カード]───────────→ SCR-040: Journal List
└──[Emergency ボタン（赤）]──────→ SCR-050: Emergency Guide
```

### 📖 Manners タブ

```
SCR-020: Manner Category List
│  カテゴリ: 電車 / レストラン / 温泉 / 神社 / 公共場所 / 買い物
│
├──[カテゴリを選択]──────────────→ SCR-021: Manner Scene Detail
│                                        │
│                                        └──[ブックマーク] → 保存（AsyncStorage）
│
├──[⛩ Shrine Guide]────────────→ SCR-022: Shrine Guide
│                                        │  ステップ 1〜5 のページャー形式
│                                        └──[Record this visit]
│                                                 │
│                                                 └──→ SCR-041: Add Journal Entry
│
└──[💬 Phrases]─────────────────→ SCR-023: Phrase Category List
                                        │  カテゴリ: 緊急 / 交通 / 食事 / 買い物 / 挨拶
                                        │
                                        └──[カテゴリを選択]──→ SCR-024: Phrase Detail
                                                                      │  ▶ 音声再生
                                                                      └──[ブックマーク] → 保存
```

### 🗺️ Map タブ

```
SCR-030: Sustainable Activity Map
│  マップ上にスポットピンを表示
│  フィルター: 神社・お賽銭 / 寄付・募金 / エコ活動 / 全て
│
├──[スポットピンをタップ]─────→ SCR-031: Spot Detail
│                                        │  名称・種別・説明・アクセス
│                                        └──[+ Add to Journal]──→ SCR-041: Add Journal Entry
│
└──[現在地ボタン]（位置情報許可済みの場合のみ有効）
```

### 📔 Journal タブ

```
SCR-040: Journal List
│  ヘッダー: 訪問スポット数 / 合計寄付額
│  エントリー一覧（日付・場所・活動種別）
│
├──[+ ボタン]────────────────→ SCR-041: Add Journal Entry
│                                        │  入力: 場所・活動種別・日付・メモ・金額（任意）
│                                        └──[Save]──→ SCR-040: Journal List（更新）
│
└──[Trip Summary]────────────→ SCR-042: Trip Summary
                                        │  訪問数・寄付合計・活動種別の内訳
                                        └──（閉じる）→ SCR-040
```

### 🚨 Emergency タブ

```
SCR-050: Emergency Guide
│  カード: 🚓 警察 / 🚑 救急 / 🏛 大使館 / ⛑ 災害
│  ※ 全データをオフラインバンドル済み
│
├──[警察カード]──────────────→ SCR-051: Emergency Detail（警察）
│                                        └──[📞 Call 110]──→ 電話アプリ起動
│
├──[救急カード]──────────────→ SCR-051: Emergency Detail（救急）
│                                        └──[📞 Call 119]──→ 電話アプリ起動
│
├──[大使館カード]────────────→ SCR-051: Emergency Detail（大使館）
│                                        │  国選択 → 大使館連絡先
│
└──[近くの病院・大使館を探す]─→ SCR-052: Nearby Services
                                        │  地図 + リスト表示
                                        └──オフライン時: 静的リストにフォールバック
```

---

## 3. 画面一覧

| 画面ID | 画面名 | タブ | 認証 | 説明 |
|---|---|---|---|---|
| SCR-001 | Welcome | — | 不要 | 初回起動のみ表示 |
| SCR-002 | Location Permission | — | 不要 | 初回起動のみ。許可・スキップ可 |
| SCR-010 | Home | 🏠 | 不要 | クイックアクセスダッシュボード |
| SCR-020 | Manner Category List | 📖 | 不要 | シーン別カテゴリ一覧 |
| SCR-021 | Manner Scene Detail | 📖 | 不要 | Do/Don't 形式のマナー解説 |
| SCR-022 | Shrine Guide | 📖 | 不要 | 参拝手順ステップ（1〜5） |
| SCR-023 | Phrase Category List | 📖 | 不要 | フレーズシーン選択 |
| SCR-024 | Phrase Detail | 📖 | 不要 | フレーズ一覧 + 音声再生 |
| SCR-030 | Sustainable Activity Map | 🗺️ | 不要 | 周辺スポットのマップ表示 |
| SCR-031 | Spot Detail | 🗺️ | 不要 | スポット詳細 + Journal 追加 |
| SCR-040 | Journal List | 📔 | 匿名認証 | 活動記録一覧 + サマリー |
| SCR-041 | Add Journal Entry | 📔 | 匿名認証 | 活動記録の新規追加 |
| SCR-042 | Trip Summary | 📔 | 匿名認証 | 旅全体の貢献まとめ |
| SCR-050 | Emergency Guide | 🚨 | 不要 | 緊急種別カード（オフライン完全対応） |
| SCR-051 | Emergency Detail | 🚨 | 不要 | 種別ごとの手順・連絡先 |
| SCR-052 | Nearby Services | 🚨 | 不要 | 近くの病院・大使館検索 |

---

## 4. 画面間データフロー

| 遷移元 | 遷移先 | 渡すデータ |
|---|---|---|
| SCR-020 カテゴリ選択 | SCR-021 | `categoryId`, `categoryName` |
| SCR-022 Shrine Guide | SCR-041 Add Entry | `spotName: "Shrine Visit"`, `activityType: "shrine"` |
| SCR-031 Spot Detail | SCR-041 Add Entry | `spotId`, `spotName`, `activityType` |
| SCR-023 カテゴリ選択 | SCR-024 Phrase Detail | `phraseCategory` |

---

## 5. オフライン動作の対応表

| 画面 | オフライン時の動作 |
|---|---|
| SCR-020〜021 Manner Guide | キャッシュデータを表示（初回オンライン取得後） |
| SCR-022 Shrine Guide | キャッシュ表示 |
| SCR-023〜024 Phrases | キャッシュ表示。音声再生は不可（トースト表示） |
| SCR-030 Map | 地図タイルなし。スポット一覧はキャッシュ表示 |
| SCR-040〜041 Journal | 読み取りのみ可。書き込みはオンライン復帰後 |
| SCR-050〜051 Emergency | 完全オフライン動作（静的バンドルデータ） |
| SCR-052 Nearby Services | 静的リストにフォールバック |

---

## 6. 共通 UI 要素

| 要素 | 仕様 |
|---|---|
| ボトムタブバー | 5タブ固定。Emergency は赤バッジなし（常時アクセス） |
| ヘッダー | Stack 画面では戻るボタン + 画面タイトル |
| エラー表示 | トースト（下部） or インラインバナー（ネットワークエラー） |
| ローディング | ActivityIndicator（中央表示） |
| オフラインバナー | 画面上部に黄色バナー「You're offline. Showing cached content.」 |
