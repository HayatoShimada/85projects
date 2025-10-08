'use client'

import { useState } from 'react'
import ProductForm from '@/components/ProductForm'
import SuccessMessage from '@/components/SuccessMessage'

export default function Home() {
  const [success, setSuccess] = useState<{
    productId: string
    sku: string
    title: string
    price?: string
    condition?: string
  } | null>(null)

  const handleSuccess = (productId: string, sku: string, title = '商品', price?: string, condition?: string) => {
    setSuccess({ productId, sku, title, price, condition })
  }

  const handleContinue = () => {
    setSuccess(null)
  }

  return (
    <main className="container mx-auto p-8">
      <header className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">商品登録ツール</h1>
            <p className="text-gray-600">Shopify商品登録システム (F101-F106)</p>
          </div>
          <a
            href="/products"
            className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700"
          >
            📋 商品一覧
          </a>
        </div>
      </header>

      {success ? (
        <SuccessMessage
          productId={success.productId}
          sku={success.sku}
          title={success.title}
          price={success.price}
          condition={success.condition}
          onContinue={handleContinue}
        />
      ) : (
        <ProductForm onSuccess={handleSuccess} />
      )}
    </main>
  )
}
