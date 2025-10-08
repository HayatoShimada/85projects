'use client'

interface QRCodeDisplayProps {
  posQRCode: string
  customerQRCode: string
  sku: string
}

export default function QRCodeDisplay({ posQRCode, customerQRCode, sku }: QRCodeDisplayProps) {
  const downloadQRCode = (dataUrl: string, filename: string) => {
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = filename
    link.click()
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">QRコード</h2>

      <div className="grid grid-cols-2 gap-6">
        {/* POS用QRコード */}
        <div className="text-center">
          <div className="bg-gray-50 p-4 rounded-lg">
            <img src={posQRCode} alt="POS用QRコード" className="w-48 h-48 mx-auto" />
          </div>
          <h3 className="font-semibold mt-3 mb-2">📱 POS用</h3>
          <p className="text-sm text-gray-600 mb-3">
            Shopify POSでスキャンして商品をカートに追加
          </p>
          <button
            onClick={() => downloadQRCode(posQRCode, `tag-pos-${sku}.png`)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm no-print"
          >
            ダウンロード
          </button>
        </div>

        {/* 顧客閲覧用QRコード */}
        <div className="text-center">
          <div className="bg-gray-50 p-4 rounded-lg">
            <img src={customerQRCode} alt="顧客閲覧用QRコード" className="w-48 h-48 mx-auto" />
          </div>
          <h3 className="font-semibold mt-3 mb-2">👤 顧客閲覧用</h3>
          <p className="text-sm text-gray-600 mb-3">
            顧客がスキャンして商品詳細ページを表示
          </p>
          <button
            onClick={() => downloadQRCode(customerQRCode, `tag-customer-${sku}.png`)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm no-print"
          >
            ダウンロード
          </button>
        </div>
      </div>
    </div>
  )
}
