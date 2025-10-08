# 高速オンラインカート生成ツール (F301-F305)

外部決済端末が使えない制約に対応するため、店頭カード決済をShopify Paymentsのオンライン決済へ誘導する特殊フローツール。

## 機能

- **F301**: POSカート情報取得（リアルタイム連携）
- **F302**: チェックアウトURL生成（Shopify Payments決済用）
- **F303**: QRコード表示（レジ端末に即時表示）
- **F304**: オンライン注文完了通知（リアルタイム通知）
- **F305**: POS決済記録ガイド（スタッフ向けガイダンス）

## 処理フロー

1. スタッフがShopify POSで商品をスキャン
2. 本ツールがカート情報を取得 (F301)
3. Shopify Checkout URLを生成 (F302)
4. QRコードをレジ端末に表示 (F303)
5. 顧客がスマホでQRスキャン → カード決済完了
6. スタッフ端末に完了通知 (F304)
7. スタッフがPOSで「オンラインカード決済(店頭注文)」を手動記録 (F305)

## セットアップ

```bash
npm install
```

## 開発サーバー起動

```bash
npm run dev
```

http://localhost:3002 でアプリケーションが起動します。

## 環境変数

`.env.local` ファイルを作成し、以下の環境変数を設定してください：

```
SHOPIFY_STORE_URL=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=your-access-token
SHOPIFY_API_VERSION=2024-01
SHOPIFY_STOREFRONT_TOKEN=your-storefront-token
```

## 注意事項

このツールは、外部決済サービスの与信制約という特殊要件に対応するための代替フローです。Shopify POSとの連携にはリアルタイム性が重要です。
