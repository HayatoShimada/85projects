import { NextRequest, NextResponse } from 'next/server'
import { createQuickCheckout } from '@/lib/checkout'

/**
 * F301-F303: POSカート取得 → Checkout URL生成 → QRコード生成
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'カートアイテムは必須です' },
        { status: 400 }
      )
    }

    // F301-F303統合処理
    const checkoutData = await createQuickCheckout(items)

    return NextResponse.json(checkoutData)
  } catch (error) {
    console.error('Checkout creation error:', error)
    return NextResponse.json(
      { error: 'チェックアウトURLの生成に失敗しました' },
      { status: 500 }
    )
  }
}
