/**
 * F304: オンライン注文完了通知
 * WebSocketまたはShopify Webhookでリアルタイム通知
 */

export interface OrderCompletedEvent {
  sessionId: string
  orderId: string
  orderNumber: string
  totalPrice: string
  completedAt: string
}

/**
 * F304: Shopify Webhook受信処理
 * 顧客がオンライン決済完了時に呼ばれる
 */
export async function handleOrderCompleted(
  webhookData: any
): Promise<OrderCompletedEvent> {
  // TODO: Shopify Webhook検証
  // - HMAC署名検証
  // - セッションIDとの照合

  return {
    sessionId: webhookData.note_attributes?.sessionId || '',
    orderId: webhookData.id,
    orderNumber: webhookData.order_number,
    totalPrice: webhookData.total_price,
    completedAt: webhookData.created_at,
  }
}

/**
 * F305: POS決済記録ガイド生成
 * スタッフ向けの次のアクション指示
 */
export function generatePOSRecordingGuide(
  event: OrderCompletedEvent
): string {
  return `
注文完了しました！

注文番号: #${event.orderNumber}
金額: ¥${event.totalPrice}

【次のステップ】
1. Shopify POSアプリを開く
2. カスタム決済タイプ「オンラインカード決済(店頭注文)」を選択
3. 金額 ¥${event.totalPrice} を入力
4. 決済完了を記録

これにより、POSとオンライン注文のデータが同期されます。
  `.trim()
}
