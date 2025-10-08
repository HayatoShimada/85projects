/**
 * F202: QRコード自動生成
 * - POSスキャン用: SKUベースの商品識別情報
 * - 顧客閲覧用: オンライン商品詳細ページURL
 */

import QRCode from 'qrcode'

export interface QRCodeData {
  sku: string
  productId: string
  storeDomain: string
}

/**
 * POS用QRコード生成
 * Shopify POSがスキャンできる形式でSKUを埋め込む
 */
export async function generatePOSQRCode(sku: string): Promise<string> {
  // TODO: Shopify POS仕様に合わせたフォーマット調整
  return await QRCode.toDataURL(sku, {
    errorCorrectionLevel: 'M',
    type: 'image/png',
    width: 200,
  })
}

/**
 * 顧客閲覧用QRコード生成
 * オンラインストアの商品詳細ページURL
 */
export async function generateCustomerQRCode(
  data: QRCodeData
): Promise<string> {
  const productUrl = `https://${data.storeDomain}/products/${data.productId}`

  return await QRCode.toDataURL(productUrl, {
    errorCorrectionLevel: 'M',
    type: 'image/png',
    width: 200,
  })
}

/**
 * F203: タグデザインデータ生成
 */
export interface TagDesign {
  productName: string
  price: string
  sku: string
  posQRCode: string
  customerQRCode: string
}

export async function generateTagDesign(
  productData: {
    name: string
    price: string
    sku: string
    productId: string
  }
): Promise<TagDesign> {
  const storeDomain = process.env.NEXT_PUBLIC_STORE_DOMAIN || ''

  const posQR = await generatePOSQRCode(productData.sku)
  const customerQR = await generateCustomerQRCode({
    sku: productData.sku,
    productId: productData.productId,
    storeDomain,
  })

  return {
    productName: productData.name,
    price: productData.price,
    sku: productData.sku,
    posQRCode: posQR,
    customerQRCode: customerQR,
  }
}
