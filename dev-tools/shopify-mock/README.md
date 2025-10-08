# Shopify Mock Server

85store開発用のShopify APIモックサーバー。

## 概要

実際のShopify APIを使わずに、ローカルで開発・テストを行うためのモックサーバー。

## 起動

```bash
# Docker Composeで起動（推奨）
cd ../..
docker-compose up shopify-mock

# スタンドアロン起動
npm install
npm run dev
```

起動後: http://localhost:4000

## エンドポイント

### Admin API

#### 商品作成
```http
POST /admin/api/2024-01/products.json
Content-Type: application/json

{
  "product": {
    "title": "商品名",
    "body_html": "説明",
    "variants": [{
      "price": "1000",
      "sku": "TEST-001",
      "inventory_quantity": 1
    }]
  }
}
```

#### 商品取得
```http
GET /admin/api/2024-01/products/:id.json
```

#### 商品一覧
```http
GET /admin/api/2024-01/products.json?limit=50
```

#### 注文作成
```http
POST /admin/api/2024-01/orders.json
Content-Type: application/json

{
  "order": {
    "email": "customer@example.com",
    "total_price": "1000",
    "line_items": [...]
  }
}
```

### Storefront API (GraphQL)

#### Checkout作成
```http
POST /api/2024-01/graphql.json
Content-Type: application/json

{
  "query": "mutation checkoutCreate($input: CheckoutCreateInput!) { ... }",
  "variables": {
    "input": {
      "lineItems": [...]
    }
  }
}
```

### 開発用エンドポイント

#### ヘルスチェック
```http
GET /health
```

レスポンス例：
```json
{
  "status": "ok",
  "message": "Shopify Mock Server is running",
  "stats": {
    "products": 2,
    "orders": 0,
    "checkouts": 0
  }
}
```

#### サンプルデータ投入
```http
POST /dev/seed
```

古着1点、新品1点のサンプル商品を投入します。

#### 全データリセット
```http
POST /dev/reset
```

すべての商品・注文・チェックアウトデータを削除します。

## データストア

In-memoryでデータを保持（サーバー再起動で消去）。

```javascript
const products = new Map()
const orders = new Map()
const checkouts = new Map()
```

本番環境に影響を与えないため、安全にテスト可能。

## カスタマイズ

### サンプルデータ追加

`src/index.js`の`/dev/seed`エンドポイントを編集：

```javascript
app.post('/dev/seed', (req, res) => {
  // 独自のサンプルデータを追加
  const customProduct = {
    id: `gid://shopify/Product/1003`,
    title: 'カスタム商品',
    // ...
  }

  products.set(customProduct.id, customProduct)

  res.json({ message: 'Custom data seeded' })
})
```

### レスポンスカスタマイズ

特定のテストケース用にレスポンスを調整可能：

```javascript
// エラーレスポンスをシミュレート
app.post('/admin/api/2024-01/products.json', (req, res) => {
  if (req.body.product.title === 'ERROR_TEST') {
    return res.status(422).json({
      errors: { title: ['is invalid'] }
    })
  }

  // 通常処理
  // ...
})
```

## ログ

全APIリクエストをコンソールにログ出力：

```
[2024-01-15T10:30:00.000Z] POST /admin/api/2024-01/products.json
✅ Created product: ヴィンテージデニムジャケット (SKU: VTG-1001-ABC)
```

## 制限事項

- In-memoryストレージ（永続化なし）
- Shopify APIの全機能は未実装
- 必要最小限のエンドポイントのみ提供

必要に応じてエンドポイントを追加してください。

## 本番環境への切り替え

環境変数でShopify APIエンドポイントを切り替え：

```bash
# Mock使用（デフォルト）
SHOPIFY_API_ENDPOINT=http://shopify-mock:4000

# 本番Shopify API使用
SHOPIFY_API_ENDPOINT=https://your-store.myshopify.com
```
