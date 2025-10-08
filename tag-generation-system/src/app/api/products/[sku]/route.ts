import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { sku: string } }
) {
  const { sku } = params

  try {
    // Mock実装 - 実際の実装ではShopify APIから取得
    const apiEndpoint = process.env.SHOPIFY_API_ENDPOINT || 'http://shopify-mock:4000'
    const useMock = apiEndpoint.includes('shopify-mock')

    if (useMock) {
      // Mockデータ返却
      return NextResponse.json({
        id: `mock-product-${sku}`,
        title: `商品 ${sku}`,
        price: '8900',
        sku: sku,
        images: [],
      })
    }

    // 実際のShopify Admin API実装
    const shopifyUrl = process.env.SHOPIFY_STORE_URL
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN

    if (!shopifyUrl || !accessToken) {
      throw new Error('Shopify credentials not configured')
    }

    // Shopify APIでSKUから商品を検索
    const response = await fetch(
      `${shopifyUrl}/admin/api/2024-01/products.json?fields=id,title,variants&limit=1`,
      {
        headers: {
          'X-Shopify-Access-Token': accessToken,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch product from Shopify')
    }

    const data = await response.json()

    // SKUに一致するバリアントを検索
    const product = data.products.find((p: any) =>
      p.variants.some((v: any) => v.sku === sku)
    )

    if (!product) {
      return NextResponse.json(
        { error: '商品が見つかりません' },
        { status: 404 }
      )
    }

    const variant = product.variants.find((v: any) => v.sku === sku)

    return NextResponse.json({
      id: product.id,
      title: product.title,
      price: variant.price,
      sku: variant.sku,
      images: product.images || [],
    })
  } catch (error) {
    console.error('Product fetch error:', error)
    return NextResponse.json(
      { error: '商品情報の取得に失敗しました' },
      { status: 500 }
    )
  }
}
