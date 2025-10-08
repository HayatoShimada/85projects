/**
 * Shopify API連携ライブラリ
 * F104: Point of Saleチャネル自動設定
 * F102: SKU自動生成ロジック
 */

export interface ProductData {
  title: string
  price: string
  category?: string
  description?: string
  measurements?: Record<string, string> // 採寸データ（古着用）
  material?: string
  origin?: string
  isVintage: boolean // 一点物判定
  images?: string[]
}

/**
 * F102: ユニークSKU生成
 * タイムスタンプとランダム文字列で衝突を回避
 */
export function generateUniqueSKU(isVintage: boolean): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 7).toUpperCase()
  const prefix = isVintage ? 'VTG' : 'NEW'

  return `${prefix}-${timestamp}-${random}`
}

/**
 * F104: Shopify商品作成（Point of Saleチャネル有効化）
 */
export async function createShopifyProduct(data: ProductData) {
  const sku = generateUniqueSKU(data.isVintage)

  // Mock APIまたは本番Shopify APIへの接続
  const apiEndpoint = process.env.SHOPIFY_API_ENDPOINT || 'http://shopify-mock:4000'
  const useMock = apiEndpoint.includes('shopify-mock')

  if (useMock) {
    // Mock実装
    console.log('Using Mock Shopify API')
    console.log('Product data:', data)
    console.log('Generated SKU:', sku)

    // Mockレスポンス
    return {
      productId: `mock-${Date.now()}`,
      sku,
    }
  }

  // 実際のShopify Admin API実装
  try {
    const shopifyUrl = process.env.SHOPIFY_STORE_URL
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN

    if (!shopifyUrl || !accessToken) {
      throw new Error('Shopify credentials not configured')
    }

    // 商品オブジェクト構築
    const product = {
      title: data.title,
      body_html: data.description || '',
      vendor: '85store',
      product_type: data.category || '',
      tags: data.isVintage ? 'vintage,used' : 'new',
      variants: [
        {
          price: data.price,
          sku: sku,
          inventory_quantity: data.isVintage ? 1 : 0,
          inventory_management: 'shopify',
        },
      ],
      // F104: Point of Saleチャネル自動有効化
      published_scope: 'global',
      published: true,
    }

    // Shopify Admin API呼び出し
    const response = await fetch(`${shopifyUrl}/admin/api/2024-01/products.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
      body: JSON.stringify({ product }),
    })

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status}`)
    }

    const result = await response.json()

    // メタフィールド設定（古着の場合）
    if (data.isVintage && data.measurements) {
      const productId = result.product.id
      await setProductMetafields(productId, {
        measurements: JSON.stringify(data.measurements),
        material: data.material,
        origin: data.origin,
      })
    }

    return {
      productId: result.product.id.toString(),
      sku,
    }
  } catch (error) {
    console.error('Shopify API error:', error)
    throw error
  }
}

/**
 * メタフィールド設定（採寸データなど）
 */
async function setProductMetafields(
  productId: string,
  metafields: Record<string, string | undefined>
) {
  const shopifyUrl = process.env.SHOPIFY_STORE_URL
  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN

  if (!shopifyUrl || !accessToken) return

  for (const [key, value] of Object.entries(metafields)) {
    if (!value) continue

    await fetch(`${shopifyUrl}/admin/api/2024-01/products/${productId}/metafields.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
      body: JSON.stringify({
        metafield: {
          namespace: 'custom',
          key,
          value,
          type: 'single_line_text_field',
        },
      }),
    })
  }
}
