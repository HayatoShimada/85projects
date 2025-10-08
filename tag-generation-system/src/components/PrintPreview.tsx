'use client'

import { TagDesign } from '@/lib/qrcode-generator'

interface PrintPreviewProps {
  tagData: TagDesign
  onClose: () => void
}

export default function PrintPreview({ tagData, onClose }: PrintPreviewProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 no-print">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">印刷プレビュー</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* タグデザインプレビュー (60mm x 90mm) */}
          <div className="bg-gray-100 p-8 rounded-lg flex justify-center">
            <div
              className="bg-white border-2 border-dashed border-gray-400 overflow-hidden"
              style={{ width: '60mm', height: '90mm' }}
            >
              {/* タグコンテンツ */}
              <div className="h-full flex flex-col p-2">
                {/* 商品名 */}
                <div className="text-center mb-1">
                  <h3 className="font-bold text-sm">{tagData.productName}</h3>
                </div>

                {/* 価格 */}
                <div className="text-center mb-2">
                  <p className="text-3xl font-bold text-red-600">¥{tagData.price}</p>
                </div>

                {/* 状態ランク（古着の場合） */}
                {tagData.condition && (
                  <div className="text-center mb-2">
                    <span className="inline-block bg-amber-100 border-2 border-amber-500 px-3 py-1 rounded font-bold text-lg">
                      状態: {tagData.condition}
                    </span>
                  </div>
                )}

                {/* QRコード2つ */}
                <div className="flex-1 flex space-x-1">
                  <div className="flex-1 flex flex-col items-center">
                    <img
                      src={tagData.posQRCode}
                      alt="POS用QR"
                      className="w-full h-auto"
                    />
                    <p className="text-xs text-center mt-1">POS用</p>
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <img
                      src={tagData.customerQRCode}
                      alt="顧客用QR"
                      className="w-full h-auto"
                    />
                    <p className="text-xs text-center mt-1">詳細</p>
                  </div>
                </div>

                {/* SKU */}
                <div className="text-center mt-auto">
                  <p className="text-xs text-gray-600 font-mono">{tagData.sku}</p>
                </div>
              </div>
            </div>
          </div>

          {/* PDF保存の案内 */}
          <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4">
            <p className="font-semibold text-blue-800 mb-2">💡 PDF保存の方法</p>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>「印刷」ボタンをクリック</li>
              <li>印刷ダイアログで「送信先」または「プリンター」を「PDFに保存」に変更</li>
              <li>「保存」または「印刷」ボタンをクリック</li>
              <li>保存先を選択してPDFファイルを保存</li>
            </ol>
            <p className="text-xs text-blue-600 mt-2">
              ※ ラベルプリンターをお持ちの場合は、通常通り印刷先を選択してください
            </p>
          </div>

          {/* アクションボタン */}
          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => window.print()}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              🖨️ 印刷 / PDF保存
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
