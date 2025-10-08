export default function Home() {
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">オンラインカート生成ツール</h1>
      <p className="mb-4">カード決済代替フロー (F301-F305)</p>

      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
        <p className="font-semibold">特殊要件対応ツール</p>
        <p className="text-sm">外部決済端末の与信制約により、店頭カード決済をShopify Paymentsオンライン決済へ誘導します。</p>
      </div>

      <div className="bg-gray-100 p-6 rounded">
        <h2 className="text-xl font-semibold mb-4">実装予定機能</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>F301: POSカート情報取得（リアルタイム連携）</li>
          <li>F302: チェックアウトURL生成</li>
          <li>F303: QRコード表示（レジ端末用）</li>
          <li>F304: オンライン注文完了通知</li>
          <li>F305: POS決済記録ガイド</li>
        </ul>
      </div>
    </main>
  )
}
