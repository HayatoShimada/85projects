'use client'

import { useState, useEffect } from 'react'
import { generateTagDesign, TagDesign } from '@/lib/qrcode-generator'
import QRCodeDisplay from './QRCodeDisplay'
import PrintPreview from './PrintPreview'

interface TagGeneratorProps {
  sku: string
}

export default function TagGenerator({ sku }: TagGeneratorProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tagData, setTagData] = useState<TagDesign | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [sku])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError(null)

      // Mock商品データ取得
      const response = await fetch(`/api/products/${sku}`)

      if (!response.ok) {
        throw new Error('商品が見つかりません')
      }

      const productData = await response.json()

      // タグデザイン生成
      const design = await generateTagDesign({
        name: productData.title,
        price: productData.price,
        sku: productData.sku,
        productId: productData.id,
      })

      setTagData(design)
    } catch (err) {
      setError(err instanceof Error ? err.message : '商品情報の取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">商品情報を読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-800 mb-2">エラー</h2>
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchProduct}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            再試行
          </button>
        </div>
      </div>
    )
  }

  if (!tagData) return null

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 商品情報表示 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">商品情報</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-semibold">商品名:</span>
            <span className="ml-2">{tagData.productName}</span>
          </div>
          <div>
            <span className="font-semibold">価格:</span>
            <span className="ml-2 text-2xl font-bold text-red-600">¥{tagData.price}</span>
          </div>
          <div className="col-span-2">
            <span className="font-semibold">SKU:</span>
            <span className="ml-2 font-mono text-sm text-blue-600">{tagData.sku}</span>
          </div>
        </div>
      </div>

      {/* QRコード表示 */}
      <QRCodeDisplay
        posQRCode={tagData.posQRCode}
        customerQRCode={tagData.customerQRCode}
        sku={tagData.sku}
      />

      {/* アクションボタン */}
      <div className="flex space-x-4 no-print">
        <button
          onClick={() => setShowPreview(true)}
          className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
        >
          📋 印刷プレビュー
        </button>
        <button
          onClick={() => window.print()}
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          🖨️ 印刷
        </button>
      </div>

      {/* 印刷プレビューモーダル */}
      {showPreview && (
        <PrintPreview tagData={tagData} onClose={() => setShowPreview(false)} />
      )}
    </div>
  )
}
