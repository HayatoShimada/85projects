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

  // TODO: 実際のShopify API呼び出し実装
  // - Point of Saleチャネルを有効化
  // - 画像アップロード処理
  // - バリアント作成（新品の場合）

  return {
    productId: 'mock-product-id',
    sku,
  }
}
