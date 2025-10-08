/**
 * F302: Shopify Checkout URL生成
 * F303: QRコード表示用データ生成
 */

import QRCode from 'qrcode'

export interface CartItem {
  sku: string
  variantId: string
  quantity: number
}

export interface CheckoutData {
  items: CartItem[]
  checkoutUrl: string
  qrCode: string
  sessionId: string
}

/**
 * F301: POSカート情報取得
 * TODO: Shopify POS APIまたはローカル連携実装
 */
export async function fetchPOSCart(): Promise<CartItem[]> {
  // TODO: 実際のPOS連携実装
  // - Shopify POS API経由
  // - またはローカルネットワーク経由でのデータ取得

  return []
}

/**
 * F302: Shopify Checkout URL生成
 * Shopify Storefront APIを使用してチェックアウトセッションを作成
 */
export async function createCheckoutURL(
  items: CartItem[]
): Promise<string> {
  // TODO: Shopify Storefront API実装
  // - checkoutCreate mutation
  // - line items追加
  // - checkout URLを返す

  const mockCheckoutUrl = `https://your-store.myshopify.com/checkout/abc123`
  return mockCheckoutUrl
}

/**
 * F303: QRコード生成（チェックアウトURL埋め込み）
 */
export async function generateCheckoutQRCode(
  checkoutUrl: string
): Promise<string> {
  return await QRCode.toDataURL(checkoutUrl, {
    errorCorrectionLevel: 'M',
    type: 'image/png',
    width: 300,
    margin: 2,
  })
}

/**
 * F301-F303統合: POSカートからチェックアウトQRまで一気通貫
 */
export async function createQuickCheckout(): Promise<CheckoutData> {
  // F301: POSカート取得
  const cartItems = await fetchPOSCart()

  // F302: Checkout URL生成
  const checkoutUrl = await createCheckoutURL(cartItems)

  // F303: QRコード生成
  const qrCode = await generateCheckoutQRCode(checkoutUrl)

  // セッションID（F304の通知追跡用）
  const sessionId = `session-${Date.now()}`

  return {
    items: cartItems,
    checkoutUrl,
    qrCode,
    sessionId,
  }
}
