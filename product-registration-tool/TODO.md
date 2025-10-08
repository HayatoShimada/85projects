# 商品登録ツール - 開発TODO

## 進捗: 15%

---

## 🔴 Phase 1: 必須機能

### ✅ Task 1: 商品情報入力フォームUI (F101)
**優先度**: 🔴 最高
**見積**: 8時間
**ファイル**: `src/app/page.tsx`, `src/components/ProductForm.tsx`

#### チェックリスト
- [ ] フォームコンポーネント作成
  - [ ] 基本項目フィールド
    - [ ] 商品名 (title)
    - [ ] 価格 (price)
    - [ ] カテゴリー (category) - select
    - [ ] 詳細説明 (description) - textarea
  - [ ] 商品タイプトグル
    - [ ] 古着/新品切り替えスイッチ
    - [ ] isVintage state管理

- [ ] 古着専用フィールド（条件表示）
  - [ ] 採寸データ入力グループ
    - [ ] 肩幅 (shoulder)
    - [ ] 胸囲 (chest)
    - [ ] 袖丈 (sleeve)
    - [ ] 着丈 (length)
    - [ ] 単位表示（cm）
  - [ ] 素材 (material)
  - [ ] 原産国 (origin)

- [ ] 新品専用フィールド（条件表示）
  - [ ] サイズ選択 (size) - S/M/L/XL
  - [ ] カラー選択 (color)
  - [ ] 在庫数 (stock) - number

- [ ] SKU自動生成
  - [ ] リアルタイムプレビュー表示
  - [ ] 読み取り専用フィールド
  - [ ] 古着: VTG-{timestamp}-{random}
  - [ ] 新品: NEW-{timestamp}-{random}

- [ ] バリデーション
  - [ ] クライアント側
    - [ ] 必須項目チェック（title, price）
    - [ ] 価格の数値検証（正の数）
    - [ ] 在庫数の数値検証（新品時必須）
    - [ ] リアルタイムエラー表示
  - [ ] サーバー側
    - [ ] Zodスキーマ定義
    - [ ] APIでの再検証

- [ ] UI/UX
  - [ ] レスポンシブデザイン
  - [ ] ローディング状態表示
  - [ ] エラーメッセージ表示
  - [ ] 送信ボタン無効化制御

---

### ✅ Task 2: Shopify Admin API連携 (F104-F105)
**優先度**: 🔴 最高
**見積**: 6時間
**ファイル**: `src/lib/shopify.ts`, `src/app/api/products/route.ts`

#### チェックリスト
- [ ] SDK設定
  - [ ] `@shopify/shopify-api` インストール
  - [ ] 初期化コード作成
  - [ ] 環境変数設定
    - [ ] SHOPIFY_STORE_URL
    - [ ] SHOPIFY_ACCESS_TOKEN
    - [ ] SHOPIFY_API_VERSION
    - [ ] SHOPIFY_API_ENDPOINT (Mock切り替え用)

- [ ] `createShopifyProduct()` 実装
  - [ ] 商品オブジェクト構築
    - [ ] title, body_html, vendor
    - [ ] product_type (category)
    - [ ] tags
  - [ ] バリアント作成
    - [ ] price, sku設定
    - [ ] inventory_quantity
    - [ ] 新品の場合: サイズ・カラーバリアント
  - [ ] Point of Saleチャネル有効化
    - [ ] published_scope設定
    - [ ] salesChannel設定
  - [ ] メタフィールド設定（古着の場合）
    - [ ] measurements (採寸データ)
    - [ ] material
    - [ ] origin

- [ ] Next.js APIルート
  - [ ] `POST /api/products`
  - [ ] リクエストボディ検証
  - [ ] Shopify API呼び出し
  - [ ] レスポンス整形
  - [ ] エラーハンドリング
    - [ ] Shopify APIエラー
    - [ ] ネットワークエラー
    - [ ] バリデーションエラー

- [ ] Mock/本番切り替え
  - [ ] SHOPIFY_API_ENDPOINT による分岐
  - [ ] Mock: `http://shopify-mock:4000`
  - [ ] 本番: Shopify URL

---

### ✅ Task 3: 画像アップロード機能 (F103)
**優先度**: 🟡 高
**見積**: 5時間
**ファイル**: `src/components/ImageUpload.tsx`, `src/app/api/upload/route.ts`

#### チェックリスト
- [ ] ImageUploadコンポーネント
  - [ ] ドラッグ&ドロップエリア
  - [ ] ファイル選択ボタン
  - [ ] プレビュー表示（サムネイル）
  - [ ] 複数画像対応（最大5枚）
  - [ ] 画像削除ボタン
  - [ ] 並び替え機能（ドラッグ）

- [ ] クライアント側処理
  - [ ] 画像圧縮・リサイズ
    - [ ] Browser Image Compression使用
    - [ ] 最大幅: 1200px
    - [ ] 最大サイズ: 5MB
  - [ ] ファイル形式チェック
    - [ ] JPEG, PNG, WebP
  - [ ] プレビュー生成

- [ ] アップロードAPI
  - [ ] `POST /api/upload`
  - [ ] Shopifyへのアップロード
    - [ ] Staged Upload API使用
    - [ ] 画像URL取得
  - [ ] または一時ストレージ保存
    - [ ] Vercel Blob Storage
    - [ ] S3互換ストレージ

- [ ] 商品登録フォームとの統合
  - [ ] images配列に画像URL格納
  - [ ] Shopify商品に紐づけ

---

### ✅ Task 4: タグ生成システムへの遷移 (F106)
**優先度**: 🟡 高
**見積**: 2時間
**ファイル**: `src/components/SuccessMessage.tsx`

#### チェックリスト
- [ ] 成功メッセージコンポーネント
  - [ ] 商品登録成功メッセージ
  - [ ] 作成された商品情報表示
    - [ ] 商品名
    - [ ] SKU
    - [ ] 商品ID
  - [ ] アクションボタングループ

- [ ] タグ生成システムへのリンク
  - [ ] URLパラメータ付きリンク
    - [ ] `http://localhost:3001?sku={sku}`
  - [ ] 新しいタブで開く（target="_blank"）
  - [ ] または同一タブ遷移オプション

- [ ] 連続登録機能
  - [ ] 「続けて登録」ボタン
  - [ ] フォームリセット
  - [ ] SKU再生成

---

## 📊 進捗トラッキング

- [ ] Task 1: フォームUI (8h) - 0%
- [ ] Task 2: API連携 (6h) - 0%
- [ ] Task 3: 画像アップロード (5h) - 0%
- [ ] Task 4: 遷移ボタン (2h) - 0%

**合計**: 21時間 / 0時間完了

---

## 🎯 完成定義

Phase 1完了時、以下が可能になる：

1. ✅ 古着商品をフォームで登録
   - 採寸データ入力
   - SKU自動生成
   - Shopifyに保存

2. ✅ 新品商品をフォームで登録
   - サイズ・カラー選択
   - 複数在庫設定
   - Shopifyに保存

3. ✅ 商品画像アップロード
   - 複数枚対応
   - Shopifyに紐づけ

4. ✅ 登録後、タグ生成画面に遷移
   - SKUパラメータ渡し
   - ワンクリック遷移

---

## 🚀 開発開始コマンド

```bash
cd product-registration-tool
npm install
npm run dev
# → http://localhost:3000
```

まずはTask 1（フォームUI）から着手してください。
