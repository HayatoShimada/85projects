'use client'

interface SuccessMessageProps {
  productId: string
  sku: string
  title: string
  onContinue: () => void
}

export default function SuccessMessage({ productId, sku, title, onContinue }: SuccessMessageProps) {
  const tagSystemUrl = `http://localhost:3001?sku=${encodeURIComponent(sku)}`

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-green-800 mb-2">商品登録が完了しました！</h2>

            <div className="bg-white rounded p-4 mb-4 space-y-2">
              <div>
                <span className="font-semibold">商品名:</span>
                <span className="ml-2">{title}</span>
              </div>
              <div>
                <span className="font-semibold">商品ID:</span>
                <span className="ml-2 font-mono text-sm">{productId}</span>
              </div>
              <div>
                <span className="font-semibold">SKU:</span>
                <span className="ml-2 font-mono text-sm font-bold text-blue-600">{sku}</span>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href={tagSystemUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-blue-600 text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                📋 タグ生成システムで印刷する（新しいタブ）
              </a>

              <button
                onClick={onContinue}
                className="block w-full bg-white border-2 border-blue-600 text-blue-600 text-center px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                ✚ 続けて商品を登録
              </button>
            </div>

            <p className="text-sm text-gray-600 mt-4">
              💡 ヒント: タグ生成システムでQRコード付きタグを印刷できます
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
