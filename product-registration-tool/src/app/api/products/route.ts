import { NextRequest, NextResponse } from 'next/server'
import { createShopifyProduct, ProductData } from '@/lib/shopify'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // バリデーション
    if (!body.title || !body.price) {
      return NextResponse.json(
        { error: '商品名と価格は必須です' },
        { status: 400 }
      )
    }

    // ProductDataオブジェクトを構築
    const productData: ProductData = {
      title: body.title,
      price: body.price,
      category: body.category,
      description: body.description,
      isVintage: body.isVintage,
      measurements: body.measurements,
      material: body.material,
      origin: body.origin,
      images: body.images,
    }

    // Shopify APIで商品作成
    const result = await createShopifyProduct(productData)

    return NextResponse.json({
      success: true,
      productId: result.productId,
      sku: result.sku,
    })
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: '商品登録に失敗しました' },
      { status: 500 }
    )
  }
}
