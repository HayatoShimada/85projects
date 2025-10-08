import { NextRequest, NextResponse } from 'next/server'
import { getProduct, updateShopifyProduct, deleteShopifyProduct } from '@/lib/shopify'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await getProduct(params.id)
    return NextResponse.json(product)
  } catch (error) {
    console.error('Product fetch error:', error)
    return NextResponse.json(
      { error: '商品情報の取得に失敗しました' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const result = await updateShopifyProduct(params.id, body)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Product update error:', error)
    return NextResponse.json(
      { error: '商品の更新に失敗しました' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await deleteShopifyProduct(params.id)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Product delete error:', error)
    return NextResponse.json(
      { error: '商品の削除に失敗しました' },
      { status: 500 }
    )
  }
}
