/**
 * Shopify API Mock Server
 * 開発環境用のShopify Admin API & Storefront APIモック
 */

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { v4: uuidv4 } = require('uuid')

const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(cors())
app.use(bodyParser.json())

// In-memory data store
const products = new Map()
const orders = new Map()
const checkouts = new Map()

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

// ===== Admin API Mock =====

// 商品作成 (F101-F105)
app.post('/admin/api/2024-01/products.json', (req, res) => {
  const { product } = req.body

  const productId = `gid://shopify/Product/${Date.now()}`
  const variantId = `gid://shopify/ProductVariant/${Date.now()}`

  const newProduct = {
    id: productId,
    title: product.title,
    body_html: product.body_html || '',
    vendor: product.vendor || '85store',
    product_type: product.product_type || '',
    created_at: new Date().toISOString(),
    handle: product.title.toLowerCase().replace(/\s+/g, '-'),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
    status: 'active',
    published_scope: 'web',
    tags: product.tags || '',
    variants: [
      {
        id: variantId,
        product_id: productId,
        title: product.variants?.[0]?.title || 'Default Title',
        price: product.variants?.[0]?.price || '0.00',
        sku: product.variants?.[0]?.sku || '',
        position: 1,
        inventory_management: 'shopify',
        inventory_policy: 'deny',
        compare_at_price: null,
        fulfillment_service: 'manual',
        inventory_quantity: product.variants?.[0]?.inventory_quantity || 1,
        weight: 0,
        weight_unit: 'kg',
        requires_shipping: true,
        barcode: product.variants?.[0]?.barcode || '',
      }
    ],
    options: [
      {
        id: Date.now(),
        product_id: productId,
        name: 'Title',
        position: 1,
        values: ['Default Title']
      }
    ],
    images: product.images || [],
    image: product.images?.[0] || null,
    metafields: product.metafields || []
  }

  products.set(productId, newProduct)

  console.log(`✅ Created product: ${newProduct.title} (SKU: ${newProduct.variants[0].sku})`)

  res.status(201).json({ product: newProduct })
})

// 商品取得 (F201)
app.get('/admin/api/2024-01/products/:id.json', (req, res) => {
  const productId = `gid://shopify/Product/${req.params.id}`
  const product = products.get(productId)

  if (!product) {
    return res.status(404).json({ errors: 'Product not found' })
  }

  res.json({ product })
})

// SKUで商品検索
app.get('/admin/api/2024-01/products.json', (req, res) => {
  const { fields, limit } = req.query

  const productList = Array.from(products.values()).slice(0, limit || 50)

  res.json({ products: productList })
})

// 注文作成 (Webhook用)
app.post('/admin/api/2024-01/orders.json', (req, res) => {
  const { order } = req.body

  const orderId = Date.now()
  const orderNumber = 1000 + orders.size

  const newOrder = {
    id: orderId,
    email: order.email || 'customer@example.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    number: orderNumber,
    order_number: orderNumber,
    total_price: order.total_price || '0.00',
    subtotal_price: order.subtotal_price || '0.00',
    total_tax: '0.00',
    currency: 'JPY',
    financial_status: 'paid',
    confirmed: true,
    line_items: order.line_items || [],
    shipping_address: order.shipping_address || null,
    billing_address: order.billing_address || null,
    note_attributes: order.note_attributes || []
  }

  orders.set(orderId, newOrder)

  console.log(`✅ Created order #${orderNumber}`)

  res.status(201).json({ order: newOrder })
})

// ===== Storefront API Mock (GraphQL) =====

// Checkout作成 (F302)
app.post('/api/2024-01/graphql.json', (req, res) => {
  const { query, variables } = req.body

  // checkoutCreate mutation
  if (query.includes('checkoutCreate')) {
    const checkoutId = uuidv4()
    const webUrl = `https://mock-store.myshopify.com/checkouts/${checkoutId}`

    const checkout = {
      id: `gid://shopify/Checkout/${checkoutId}`,
      webUrl,
      lineItems: variables?.input?.lineItems || [],
      createdAt: new Date().toISOString()
    }

    checkouts.set(checkoutId, checkout)

    console.log(`✅ Created checkout: ${webUrl}`)

    return res.json({
      data: {
        checkoutCreate: {
          checkout,
          checkoutUserErrors: []
        }
      }
    })
  }

  // その他のクエリ
  res.json({
    data: null,
    errors: [{ message: 'Query not implemented in mock server' }]
  })
})

// ===== Health Check =====
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Shopify Mock Server is running',
    stats: {
      products: products.size,
      orders: orders.size,
      checkouts: checkouts.size
    }
  })
})

// ===== Data Management Endpoints (開発用) =====

// 全データリセット
app.post('/dev/reset', (req, res) => {
  products.clear()
  orders.clear()
  checkouts.clear()

  console.log('🔄 All data reset')

  res.json({ message: 'All data reset successfully' })
})

// サンプルデータ投入
app.post('/dev/seed', (req, res) => {
  // サンプル商品1: 古着（一点物）
  const vintageProduct = {
    id: `gid://shopify/Product/1001`,
    title: 'ヴィンテージデニムジャケット',
    body_html: '80年代のヴィンテージデニムジャケット。状態良好。',
    variants: [{
      id: `gid://shopify/ProductVariant/2001`,
      sku: 'VTG-1001-ABC',
      price: '8900',
      inventory_quantity: 1
    }],
    tags: 'ヴィンテージ,デニム,アウター'
  }

  products.set(vintageProduct.id, vintageProduct)

  // サンプル商品2: 新品（複数在庫）
  const newProduct = {
    id: `gid://shopify/Product/1002`,
    title: 'ベーシックTシャツ（ホワイト）',
    body_html: '定番のベーシックTシャツ。',
    variants: [{
      id: `gid://shopify/ProductVariant/2002`,
      sku: 'NEW-TS-WHT-M',
      price: '2900',
      inventory_quantity: 10
    }],
    tags: '新品,Tシャツ,定番'
  }

  products.set(newProduct.id, newProduct)

  console.log('🌱 Sample data seeded')

  res.json({
    message: 'Sample data seeded successfully',
    products: [vintageProduct, newProduct]
  })
})

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║  🏪 Shopify Mock Server                              ║
║  📡 http://localhost:${PORT}                            ║
║                                                       ║
║  Endpoints:                                           ║
║    POST /admin/api/2024-01/products.json             ║
║    GET  /admin/api/2024-01/products/:id.json         ║
║    POST /api/2024-01/graphql.json                    ║
║    GET  /health                                       ║
║    POST /dev/reset (開発用)                           ║
║    POST /dev/seed (開発用)                            ║
╚═══════════════════════════════════════════════════════╝
  `)
})
