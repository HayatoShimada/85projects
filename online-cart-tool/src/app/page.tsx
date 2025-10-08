'use client'

import { useState } from 'react'
import { CheckoutData } from '@/lib/checkout'

interface CartItem {
  sku: string
  variantId: string
  quantity: number
}

export default function Home() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [currentItem, setCurrentItem] = useState({ sku: '', variantId: '', quantity: 1 })
  const [loading, setLoading] = useState(false)
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null)
  const [orderCompleted, setOrderCompleted] = useState(false)

  const addItem = () => {
    if (!currentItem.sku || !currentItem.variantId) {
      alert('SKUとバリアントIDを入力してください')
      return
    }

    setCartItems([...cartItems, { ...currentItem }])
    setCurrentItem({ sku: '', variantId: '', quantity: 1 })
  }

  const removeItem = (index: number) => {
    setCartItems(cartItems.filter((_, i) => i !== index))
  }

  const generateCheckout = async () => {
    if (cartItems.length === 0) {
      alert('カートにアイテムを追加してください')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cartItems }),
      })

      if (!response.ok) {
        throw new Error('チェックアウトURLの生成に失敗しました')
      }

      const data = await response.json()
      setCheckoutData(data)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const simulateOrderComplete = () => {
    setOrderCompleted(true)
    setTimeout(() => {
      alert('注文が完了しました！POSで決済を記録してください。')
    }, 500)
  }

  const resetCheckout = () => {
    setCartItems([])
    setCheckoutData(null)
    setOrderCompleted(false)
  }

  return (
    <main className="container mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">オンラインカート生成ツール</h1>
        <p className="text-gray-600">カード決済代替フロー (F301-F305)</p>
      </header>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
        <p className="font-semibold">💳 特殊要件対応ツール</p>
        <p className="text-sm text-gray-700">
          外部決済端末の与信制約により、店頭カード決済をShopify Paymentsオンライン決済へ誘導します。
        </p>
      </div>

      {!checkoutData ? (
        // F301: カート情報入力UI
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">F301: POSカート情報入力</h2>
            <p className="text-sm text-gray-600 mb-4">
              POSでスキャンした商品情報を入力してください（本番環境ではPOS連携で自動取得）
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="md:col-span-2">
                <label className="block font-medium mb-1">SKU</label>
                <input
                  type="text"
                  value={currentItem.sku}
                  onChange={(e) => setCurrentItem({ ...currentItem, sku: e.target.value })}
                  placeholder="例: VTG-lm3k4p-AB12C"
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Variant ID</label>
                <input
                  type="text"
                  value={currentItem.variantId}
                  onChange={(e) => setCurrentItem({ ...currentItem, variantId: e.target.value })}
                  placeholder="例: 12345"
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">数量</label>
                <input
                  type="number"
                  min="1"
                  value={currentItem.quantity}
                  onChange={(e) => setCurrentItem({ ...currentItem, quantity: parseInt(e.target.value) })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            <button
              onClick={addItem}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              ➕ アイテム追加
            </button>
          </div>

          {/* カート一覧 */}
          {cartItems.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4">カート内容 ({cartItems.length}点)</h3>
              <div className="space-y-2">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                    <div>
                      <span className="font-mono text-sm">{item.sku}</span>
                      <span className="text-gray-600 ml-4">Variant: {item.variantId}</span>
                      <span className="text-gray-600 ml-4">数量: {item.quantity}</span>
                    </div>
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      削除
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={generateCheckout}
                disabled={loading}
                className="mt-4 w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading ? '生成中...' : '🔗 チェックアウトURL生成 (F302)'}
              </button>
            </div>
          )}
        </div>
      ) : (
        // F303: QRコード表示
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">F303: QRコード表示（レジ端末用）</h2>
            <p className="text-sm text-gray-600 mb-4">
              お客様にこのQRコードをスキャンしていただき、スマートフォンで決済を完了してください。
            </p>

            <div className="flex justify-center mb-6">
              <div className="bg-white p-8 rounded-lg border-4 border-blue-600 shadow-lg">
                <img src={checkoutData.qrCode} alt="Checkout QR Code" className="w-64 h-64" />
                <p className="text-center mt-4 font-mono text-sm text-gray-600">
                  Session: {checkoutData.sessionId}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="font-semibold mb-2">📱 お客様への案内</p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>スマートフォンのカメラでQRコードをスキャンしてください</li>
                <li>Shopify決済ページが開きます</li>
                <li>カード情報を入力して決済を完了してください</li>
                <li>完了後、画面をスタッフにお見せください</li>
              </ol>
            </div>

            <div className="bg-gray-100 p-4 rounded mb-4">
              <p className="text-sm font-semibold mb-1">チェックアウトURL:</p>
              <a
                href={checkoutData.checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm break-all"
              >
                {checkoutData.checkoutUrl}
              </a>
            </div>

            {!orderCompleted ? (
              <button
                onClick={simulateOrderComplete}
                className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700"
              >
                ✅ 決済完了を確認（デモ用）
              </button>
            ) : (
              // F304: 決済完了通知 & F305: POS記録ガイド
              <div className="space-y-4">
                <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-green-800 mb-2">F304: 注文完了通知</h3>
                      <p className="text-green-700 mb-4">お客様のオンライン決済が完了しました！</p>

                      <div className="bg-white rounded p-4 mb-4">
                        <p className="text-sm text-gray-600">Session ID</p>
                        <p className="font-mono text-sm font-bold">{checkoutData.sessionId}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border-2 border-amber-500 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-amber-800 mb-4">F305: POS決済記録ガイド</h3>
                  <div className="space-y-3 text-sm">
                    <p className="font-semibold">📝 次のステップ（必須）</p>
                    <ol className="list-decimal list-inside space-y-2 bg-white p-4 rounded">
                      <li>Shopify POSアプリを開く</li>
                      <li>カスタム決済タイプ「オンラインカード決済(店頭注文)」を選択</li>
                      <li>金額を入力（オンライン注文金額と同額）</li>
                      <li>決済完了を記録</li>
                    </ol>
                    <p className="text-amber-700 font-semibold">
                      ⚠️ この手順により、POSとオンライン注文のデータが同期されます
                    </p>
                  </div>
                </div>

                <button
                  onClick={resetCheckout}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
                >
                  ✚ 新しいチェックアウトを開始
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
