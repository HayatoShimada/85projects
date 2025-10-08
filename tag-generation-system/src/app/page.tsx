'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import TagGenerator from '@/components/TagGenerator'

function TagContent() {
  const searchParams = useSearchParams()
  const sku = searchParams.get('sku')
  const title = searchParams.get('title')
  const price = searchParams.get('price')
  const condition = searchParams.get('condition')

  if (!sku) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-yellow-50 border-2 border-yellow-500 rounded-lg p-6">
          <h2 className="text-xl font-bold text-yellow-800 mb-2">SKUパラメータが必要です</h2>
          <p className="text-yellow-700">
            商品登録ツールからこのページに遷移してください。
          </p>
          <p className="text-sm text-gray-600 mt-2">
            または、URLに <code className="bg-white px-2 py-1 rounded">?sku=商品SKU</code> を追加してください。
          </p>
        </div>
      </div>
    )
  }

  return <TagGenerator sku={sku} title={title} price={price} condition={condition} />
}

export default function Home() {
  return (
    <main className="container mx-auto p-8">
      <header className="mb-8 no-print">
        <h1 className="text-4xl font-bold mb-2">タグ生成・印刷システム</h1>
        <p className="text-gray-600">QRコード付き商品タグ自動生成 (F201-F205)</p>
      </header>

      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">読み込み中...</p>
          </div>
        </div>
      }>
        <TagContent />
      </Suspense>
    </main>
  )
}
