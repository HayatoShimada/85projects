# 商品登録/編集ツール (F101-F106)

Shopify API経由で商品データを登録・更新する簡易Webアプリケーション。

## 機能

- **F101**: 商品情報入力フォーム（商品名、価格、採寸データ等）
- **F102**: 在庫タイプ判定とSKU自動生成
- **F103**: 画像パス入力/アップロード
- **F104**: 販売チャネル自動設定（Point of Sale有効化）
- **F105**: 登録・更新実行
- **F106**: タグ生成システムへの自動遷移

## セットアップ

```bash
npm install
```

## 開発サーバー起動

```bash
npm run dev
```

http://localhost:3000 でアプリケーションが起動します。

## 環境変数

`.env.local` ファイルを作成し、以下の環境変数を設定してください：

```
SHOPIFY_STORE_URL=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=your-access-token
SHOPIFY_API_VERSION=2024-01
```

## ビルド

```bash
npm run build
npm start
```

## デプロイ

Vercelへのデプロイを想定しています。
