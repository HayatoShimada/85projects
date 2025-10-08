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
  condition?: string // 状態ランク (S/A/B/C/D) - 古着専用
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
        condition: data.condition,
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
 * F107: 商品一覧取得
 */
export async function getProducts() {
  const apiEndpoint = process.env.SHOPIFY_API_ENDPOINT || 'http://shopify-mock:4000'
  const useMock = apiEndpoint.includes('shopify-mock')

  if (useMock) {
    // Mock実装
    console.log('Using Mock Shopify API - Getting products list')

    // Mockデータ（実際にはDBやファイルから取得）
    return {
      products: [
        {
          id: 'mock-1',
          title: 'ヴィンテージデニムジャケット',
          price: '8900',
          sku: 'VTG-lm3k4p-AB12C',
          condition: 'A',
          category: 'アウター',
          isVintage: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'mock-2',
          title: '新品Tシャツ',
          price: '3500',
          sku: 'NEW-lm3k5q-CD34E',
          category: 'トップス',
          isVintage: false,
          stock: 10,
          createdAt: new Date().toISOString(),
        },
      ],
    }
  }

  // 実際のShopify Admin API実装
  try {
    const shopifyUrl = process.env.SHOPIFY_STORE_URL
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN

    if (!shopifyUrl || !accessToken) {
      throw new Error('Shopify credentials not configured')
    }

    const response = await fetch(`${shopifyUrl}/admin/api/2024-01/products.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
    })

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status}`)
    }

    const result = await response.json()

    // 商品データを整形
    const products = result.products.map((product: any) => ({
      id: product.id.toString(),
      title: product.title,
      price: product.variants[0]?.price || '0',
      sku: product.variants[0]?.sku || '',
      category: product.product_type,
      isVintage: product.tags.includes('vintage'),
      condition: product.metafields?.find((m: any) => m.key === 'condition')?.value,
      stock: product.variants[0]?.inventory_quantity || 0,
      createdAt: product.created_at,
    }))

    return { products }
  } catch (error) {
    console.error('Shopify API error:', error)
    throw error
  }
}

/**
 * F108: 商品情報取得（編集用）
 */
export async function getProduct(productId: string) {
  const apiEndpoint = process.env.SHOPIFY_API_ENDPOINT || 'http://shopify-mock:4000'
  const useMock = apiEndpoint.includes('shopify-mock')

  if (useMock) {
    // Mock実装
    console.log('Using Mock Shopify API - Getting product:', productId)

    return {
      id: productId,
      title: 'ヴィンテージデニムジャケット',
      price: '8900',
      sku: 'VTG-lm3k4p-AB12C',
      condition: 'A',
      category: 'アウター',
      description: 'レア物のヴィンテージデニムジャケット',
      isVintage: true,
      measurements: {
        shoulder: '45',
        chest: '50',
        sleeve: '60',
        length: '65',
      },
      material: 'コットン100%',
      origin: 'USA',
    }
  }

  // 実際のShopify Admin API実装
  try {
    const shopifyUrl = process.env.SHOPIFY_STORE_URL
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN

    if (!shopifyUrl || !accessToken) {
      throw new Error('Shopify credentials not configured')
    }

    const response = await fetch(`${shopifyUrl}/admin/api/2024-01/products/${productId}.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
    })

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status}`)
    }

    const result = await response.json()
    const product = result.product

    return {
      id: product.id.toString(),
      title: product.title,
      price: product.variants[0]?.price || '0',
      sku: product.variants[0]?.sku || '',
      category: product.product_type,
      description: product.body_html,
      isVintage: product.tags.includes('vintage'),
      condition: product.metafields?.find((m: any) => m.key === 'condition')?.value,
      measurements: JSON.parse(product.metafields?.find((m: any) => m.key === 'measurements')?.value || '{}'),
      material: product.metafields?.find((m: any) => m.key === 'material')?.value,
      origin: product.metafields?.find((m: any) => m.key === 'origin')?.value,
    }
  } catch (error) {
    console.error('Shopify API error:', error)
    throw error
  }
}

/**
 * F108: 商品更新
 */
export async function updateShopifyProduct(productId: string, data: Partial<ProductData>) {
  const apiEndpoint = process.env.SHOPIFY_API_ENDPOINT || 'http://shopify-mock:4000'
  const useMock = apiEndpoint.includes('shopify-mock')

  if (useMock) {
    // Mock実装
    console.log('Using Mock Shopify API - Updating product:', productId)
    console.log('Update data:', data)

    return {
      success: true,
      productId,
    }
  }

  // 実際のShopify Admin API実装
  try {
    const shopifyUrl = process.env.SHOPIFY_STORE_URL
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN

    if (!shopifyUrl || !accessToken) {
      throw new Error('Shopify credentials not configured')
    }

    const product: any = {
      title: data.title,
      body_html: data.description || '',
      product_type: data.category || '',
    }

    if (data.price) {
      // バリアント価格更新は別API
      const variantResponse = await fetch(`${shopifyUrl}/admin/api/2024-01/products/${productId}.json`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': accessToken,
        },
      })

      const variantResult = await variantResponse.json()
      const variantId = variantResult.product.variants[0].id

      await fetch(`${shopifyUrl}/admin/api/2024-01/variants/${variantId}.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': accessToken,
        },
        body: JSON.stringify({
          variant: {
            price: data.price,
          },
        }),
      })
    }

    const response = await fetch(`${shopifyUrl}/admin/api/2024-01/products/${productId}.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
      body: JSON.stringify({ product }),
    })

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status}`)
    }

    // メタフィールド更新
    if (data.measurements || data.material || data.origin || data.condition) {
      await setProductMetafields(productId, {
        condition: data.condition,
        measurements: data.measurements ? JSON.stringify(data.measurements) : undefined,
        material: data.material,
        origin: data.origin,
      })
    }

    return {
      success: true,
      productId,
    }
  } catch (error) {
    console.error('Shopify API error:', error)
    throw error
  }
}

/**
 * F109: 商品削除
 */
export async function deleteShopifyProduct(productId: string) {
  const apiEndpoint = process.env.SHOPIFY_API_ENDPOINT || 'http://shopify-mock:4000'
  const useMock = apiEndpoint.includes('shopify-mock')

  if (useMock) {
    // Mock実装
    console.log('Using Mock Shopify API - Deleting product:', productId)

    return {
      success: true,
    }
  }

  // 実際のShopify Admin API実装
  try {
    const shopifyUrl = process.env.SHOPIFY_STORE_URL
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN

    if (!shopifyUrl || !accessToken) {
      throw new Error('Shopify credentials not configured')
    }

    const response = await fetch(`${shopifyUrl}/admin/api/2024-01/products/${productId}.json`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
    })

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status}`)
    }

    return {
      success: true,
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
