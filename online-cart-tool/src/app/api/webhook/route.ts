/**
 * F304: Shopify Webhook受信エンドポイント
 * orders/create webhookを受け取り、スタッフに通知
 */

import { NextRequest, NextResponse } from 'next/server'
import { handleOrderCompleted, generatePOSRecordingGuide } from '@/lib/notification'

export async function POST(request: NextRequest) {
  try {
    const webhookData = await request.json()

    // F304: 注文完了イベント処理
    const event = await handleOrderCompleted(webhookData)

    // F305: POS記録ガイド生成
    const guide = generatePOSRecordingGuide(event)

    // TODO: WebSocket経由でスタッフ端末に通知
    // または別のリアルタイム通知機構

    return NextResponse.json({
      success: true,
      message: guide,
    })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
