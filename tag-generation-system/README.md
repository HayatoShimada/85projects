# 自動タグ生成・印刷システム (F201-F205)

QRコード/バーコード付き商品タグをラベルプリンタで出力するシステム。

## 機能

- **F201**: データ連携と取得（Shopify APIから商品情報取得）
- **F202**: QRコード自動生成（POSスキャン用 + 顧客閲覧用URL）
- **F203**: タグデザイン生成
- **F204**: ラベルプリンタ連携
- **F205**: 印刷プレビュー機能

## セットアップ

```bash
npm install
```

## 開発サーバー起動

```bash
npm run dev
```

http://localhost:3001 でアプリケーションが起動します。

## 環境変数

`.env.local` ファイルを作成し、以下の環境変数を設定してください：

```
SHOPIFY_STORE_URL=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=your-access-token
SHOPIFY_API_VERSION=2024-01
NEXT_PUBLIC_STORE_DOMAIN=your-store.myshopify.com
```

## QRコード仕様

- **POS用**: SKUベースのスキャン情報
- **顧客用**: 商品詳細ページURL

## ラベルプリンタ対応

紐付きタグサイズを想定したテンプレート設計。
