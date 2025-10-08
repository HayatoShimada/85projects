'use client'

import { useState } from 'react'
import ProductForm from '@/components/ProductForm'
import SuccessMessage from '@/components/SuccessMessage'

export default function Home() {
  const [success, setSuccess] = useState<{
    productId: string
    sku: string
    title: string
  } | null>(null)

  const handleSuccess = (productId: string, sku: string, title = '商品') => {
    setSuccess({ productId, sku, title })
  }

  const handleContinue = () => {
    setSuccess(null)
  }

  return (
    <main className="container mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">商品登録ツール</h1>
        <p className="text-gray-600">Shopify商品登録システム (F101-F106)</p>
      </header>

      {success ? (
        <SuccessMessage
          productId={success.productId}
          sku={success.sku}
          title={success.title}
          onContinue={handleContinue}
        />
      ) : (
        <ProductForm onSuccess={handleSuccess} />
      )}
    </main>
  )
}
