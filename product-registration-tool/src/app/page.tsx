export default function Home() {
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">商品登録ツール</h1>
      <p className="mb-4">Shopify商品登録/編集システム (F101-F106)</p>

      <div className="bg-gray-100 p-6 rounded">
        <h2 className="text-xl font-semibold mb-4">実装予定機能</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>F101: 商品情報入力フォーム</li>
          <li>F102: 在庫タイプ判定とSKU自動生成</li>
          <li>F103: 画像パス入力/アップロード</li>
          <li>F104: 販売チャネル自動設定</li>
          <li>F105: 登録・更新実行</li>
          <li>F106: タグ生成システムへの自動遷移</li>
        </ul>
      </div>
    </main>
  )
}
