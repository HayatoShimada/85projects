'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Product {
  id: string
  title: string
  price: string
  sku: string
  condition?: string
  category?: string
  isVintage: boolean
  stock?: number
  createdAt: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'vintage' | 'new'>('all')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/products')

      if (!response.ok) {
        throw new Error('商品一覧の取得に失敗しました')
      }

      const data = await response.json()
      setProducts(data.products)
    } catch (err) {
      setError(err instanceof Error ? err.message : '商品一覧の取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId: string, productTitle: string) => {
    if (!confirm(`「${productTitle}」を削除してもよろしいですか？`)) {
      return
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('商品の削除に失敗しました')
      }

      // リストから削除
      setProducts(products.filter(p => p.id !== productId))
      alert('商品を削除しました')
    } catch (err) {
      alert(err instanceof Error ? err.message : '商品の削除に失敗しました')
    }
  }

  // フィルタリング処理
  const filteredProducts = products.filter(product => {
    // 検索テキストフィルター
    const matchesSearch = searchTerm === '' ||
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())

    // カテゴリーフィルター
    const matchesCategory = categoryFilter === '' || product.category === categoryFilter

    // タイプフィルター
    const matchesType = typeFilter === 'all' ||
      (typeFilter === 'vintage' && product.isVintage) ||
      (typeFilter === 'new' && !product.isVintage)

    return matchesSearch && matchesCategory && matchesType
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">商品一覧を読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <main className="container mx-auto p-8">
        <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-800 mb-2">エラー</h2>
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchProducts}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            再試行
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto p-8">
      <header className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">商品一覧</h1>
            <p className="text-gray-600">登録済み商品の管理 (F107)</p>
          </div>
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            ✚ 新規登録
          </Link>
        </div>

        {/* 検索・フィルター */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 検索 */}
            <div>
              <label className="block font-medium mb-1">検索</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="商品名またはSKUで検索"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* カテゴリーフィルター */}
            <div>
              <label className="block font-medium mb-1">カテゴリー</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">すべて</option>
                <option value="アウター">アウター</option>
                <option value="トップス">トップス</option>
                <option value="ボトムス">ボトムス</option>
                <option value="アクセサリー">アクセサリー</option>
                <option value="その他">その他</option>
              </select>
            </div>

            {/* タイプフィルター */}
            <div>
              <label className="block font-medium mb-1">商品タイプ</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as 'all' | 'vintage' | 'new')}
                className="w-full border rounded px-3 py-2"
              >
                <option value="all">すべて</option>
                <option value="vintage">古着（一点物）</option>
                <option value="new">新品</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            {filteredProducts.length}件の商品が見つかりました（全{products.length}件中）
          </div>
        </div>
      </header>

      {/* 商品一覧テーブル */}
      {filteredProducts.length === 0 ? (
        <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg">商品が見つかりませんでした</p>
          {searchTerm || categoryFilter || typeFilter !== 'all' ? (
            <button
              onClick={() => {
                setSearchTerm('')
                setCategoryFilter('')
                setTypeFilter('all')
              }}
              className="mt-4 text-blue-600 hover:underline"
            >
              フィルターをクリア
            </button>
          ) : null}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  商品名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  価格
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  タイプ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  カテゴリー
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div>
                        <div className="font-medium text-gray-900">{product.title}</div>
                        {product.condition && (
                          <span className="inline-block bg-amber-100 border border-amber-400 px-2 py-0.5 rounded text-xs font-semibold mt-1">
                            状態: {product.condition}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">{product.sku}</code>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-red-600">¥{product.price}</span>
                  </td>
                  <td className="px-6 py-4">
                    {product.isVintage ? (
                      <span className="inline-block bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-semibold">
                        古着
                      </span>
                    ) : (
                      <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                        新品 (在庫: {product.stock || 0})
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {product.category || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Link
                        href={`/products/${product.id}/edit`}
                        className="text-blue-600 hover:underline text-sm font-medium"
                      >
                        編集
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.title)}
                        className="text-red-600 hover:underline text-sm font-medium"
                      >
                        削除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
