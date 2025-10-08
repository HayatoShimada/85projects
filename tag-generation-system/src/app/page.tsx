export default function Home() {
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">タグ生成・印刷システム</h1>
      <p className="mb-4">QRコード付き商品タグ自動生成 (F201-F205)</p>

      <div className="bg-gray-100 p-6 rounded">
        <h2 className="text-xl font-semibold mb-4">実装予定機能</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>F201: Shopify APIからデータ取得</li>
          <li>F202: QRコード自動生成（POS + 顧客閲覧用）</li>
          <li>F203: タグデザイン生成</li>
          <li>F204: ラベルプリンタ連携</li>
          <li>F205: 印刷プレビュー機能</li>
        </ul>
      </div>
    </main>
  )
}
