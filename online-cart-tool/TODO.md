# オンラインカート生成ツール - 開発TODO

## 進捗: 25%

---

## 🟡 Phase 2: コア機能

### ✅ Task 8: オンラインカート生成UI実装 (F301-F303)
**優先度**: 🟡 高
**見積**: 8時間
**ファイル**: `src/app/page.tsx`, `src/components/CartDisplay.tsx`

#### チェックリスト
- [ ] レイアウト設計
  - [ ] 3カラムレイアウト
    - [ ] 左: POSカート情報
    - [ ] 中央: チェックアウトQRコード
    - [ ] 右: 通知・ガイド表示エリア

- [ ] POSカート取得セクション
  - [ ] 「POSカート取得」ボタン
  - [ ] ローディング状態
    - [ ] スピナー表示
    - [ ] ボタン無効化
  - [ ] Mock POSカート注入（開発用）
    - [ ] テストデータボタン
    - [ ] サンプルカート表示

- [ ] カート内容表示
  - [ ] 商品リストテーブル
    - [ ] SKU列
    - [ ] 商品名列
    - [ ] 数量列
    - [ ] 単価列
    - [ ] 小計列
  - [ ] 合計金額（大きく表示）
  - [ ] 商品数カウント

- [ ] チェックアウト生成セクション
  - [ ] 「チェックアウト生成」ボタン
    - [ ] カートが空の場合は無効化
  - [ ] 生成中ローディング
  - [ ] QRコード表示エリア
    - [ ] 大きいサイズ（300x300px）
    - [ ] チェックアウトURL表示（クリックでコピー）
    - [ ] QRコード説明テキスト
      - [ ] 「お客様にスマホでスキャンしてもらってください」

- [ ] セッション管理表示
  - [ ] セッションID表示
  - [ ] 生成日時表示
  - [ ] タイムアウトカウントダウン
    - [ ] 残り時間表示（10分）
    - [ ] 1分切ったら警告色

- [ ] リセット機能
  - [ ] 「キャンセル」ボタン
  - [ ] セッションクリア
  - [ ] 初期状態に戻す

---

### ✅ Task 9: Shopify Storefront API連携 (F302)
**優先度**: 🟡 高
**見積**: 6時間
**ファイル**: `src/lib/checkout.ts`, `src/app/api/checkout/route.ts`

#### チェックリスト
- [ ] Storefront API SDK設定
  - [ ] `@shopify/storefront-api-client` インストール
  - [ ] GraphQLクライアント初期化
  - [ ] Storefront Access Token設定
    - [ ] 環境変数 SHOPIFY_STOREFRONT_TOKEN

- [ ] Checkout作成mutation
  - [ ] GraphQLクエリ作成
```graphql
mutation checkoutCreate($input: CheckoutCreateInput!) {
  checkoutCreate(input: $input) {
    checkout {
      id
      webUrl
      lineItems(first: 10) {
        edges {
          node {
            title
            quantity
          }
        }
      }
    }
    checkoutUserErrors {
      message
      field
    }
  }
}
```
  - [ ] `createCheckoutURL()` 実装
  - [ ] lineItems構築
    - [ ] variantId (SKUから取得)
    - [ ] quantity
  - [ ] カスタム属性設定
    - [ ] セッションID
    - [ ] 店頭注文フラグ

- [ ] Checkout URL取得
  - [ ] `webUrl` 抽出
  - [ ] QRコード生成に渡す
  - [ ] セッション情報保存（Redis）

- [ ] エラーハンドリング
  - [ ] GraphQLエラー
  - [ ] checkoutUserErrors処理
  - [ ] 在庫切れ対応

- [ ] Next.js APIルート
  - [ ] `POST /api/checkout`
  - [ ] リクエストボディ
```typescript
{
  cartItems: CartItem[]
}
```
  - [ ] レスポンス
```typescript
{
  checkoutUrl: string
  sessionId: string
  qrCode: string
}
```

- [ ] Mock/本番切り替え
  - [ ] Mock Shopify API使用
  - [ ] 本番Storefront API使用

---

### ✅ Task 10: WebSocket通知システム実装 (F304)
**優先度**: 🟡 高
**見積**: 8時間
**ファイル**: `src/lib/websocket.ts`, `src/app/api/webhook/route.ts`, `server.js`

#### チェックリスト
- [ ] Socket.IO サーバー設定
  - [ ] Socket.IO インストール
  - [ ] Next.js カスタムサーバー作成
    - [ ] `server.js` ファイル
    - [ ] package.json の dev/start スクリプト変更
  - [ ] CORS設定
  - [ ] クライアント接続管理
    - [ ] セッションID とSocket IDの紐付け

- [ ] Shopify Webhook受信
  - [ ] `POST /api/webhook/orders-create`
  - [ ] HMAC署名検証
```javascript
const hmac = req.headers['x-shopify-hmac-sha256']
const verified = verifyHmac(req.body, hmac)
```
  - [ ] 注文データパース
  - [ ] セッションID照合
    - [ ] note_attributes から取得
    - [ ] Redisでセッション確認

- [ ] リアルタイム通知
  - [ ] WebSocket経由で通知送信
```javascript
io.to(sessionId).emit('order-completed', {
  orderNumber: order.order_number,
  totalPrice: order.total_price,
  orderId: order.id
})
```
  - [ ] 通知データ構造
    - [ ] 注文番号
    - [ ] 金額
    - [ ] 注文ID
    - [ ] 完了日時

- [ ] クライアント側実装
  - [ ] `useSocket` カスタムフック
  - [ ] WebSocket接続
```javascript
const socket = io('http://localhost:3002')
socket.emit('register-session', sessionId)
```
  - [ ] 通知受信ハンドラー
```javascript
socket.on('order-completed', (data) => {
  // UI更新
})
```
  - [ ] 接続状態管理
  - [ ] 再接続ロジック

- [ ] 通知UI
  - [ ] トースト通知
  - [ ] 音声通知（オプション）
  - [ ] POS記録ガイドへ自動遷移

---

### ✅ Task 11: POS記録ガイドUI実装 (F305)
**優先度**: 🟡 高
**見積**: 3時間
**ファイル**: `src/components/POSGuide.tsx`

#### チェックリスト
- [ ] POSGuideコンポーネント
  - [ ] モーダル形式
  - [ ] フルスクリーンオーバーレイ
  - [ ] 大きく見やすいデザイン

- [ ] ガイド内容
  - [ ] 注文完了メッセージ
  - [ ] 注文情報表示
    - [ ] 注文番号（大きく）
    - [ ] 合計金額（大きく）
    - [ ] 注文日時
  - [ ] ステップバイステップ手順
```
1. Shopify POSアプリを開く
2. カスタム決済タイプを選択
   「オンラインカード決済（店頭注文）」
3. 金額を入力: ¥{totalPrice}
4. 決済完了を記録
```
  - [ ] 注意事項
    - [ ] 「これにより、POSとオンライン注文のデータが同期されます」

- [ ] アクション
  - [ ] 「記録完了」ボタン
    - [ ] クリックでモーダル閉じる
    - [ ] セッションクローズ
    - [ ] 初期状態に戻す
  - [ ] 「印刷」ボタン（オプション）
    - [ ] レシート印刷

- [ ] 自動表示
  - [ ] 注文完了通知受信時に自動表示
  - [ ] `useEffect` で監視

---

## 🟢 Phase 3: ハードウェア連携

### ✅ Task 14: POSカート情報取得実装 (F301)
**優先度**: 🟢 低（POS環境依存）
**見積**: 10時間
**ファイル**: `src/lib/checkout.ts`, `src/app/api/pos-cart/route.ts`

#### チェックリスト
- [ ] Shopify POS API調査
  - [ ] POS API仕様確認
  - [ ] 利用可能なエンドポイント
  - [ ] 認証方法
  - [ ] カート情報取得方法

- [ ] POS API連携（案1）
  - [ ] Shopify POS API呼び出し
  - [ ] 現在のカート状態取得
  - [ ] 商品SKU、数量、価格取得
  - [ ] リアルタイム同期

- [ ] ローカルネットワーク連携（案2）
  - [ ] POS端末とのローカル通信
    - [ ] WebSocket
    - [ ] または HTTP POST
  - [ ] QRコードスキャンでカート情報送信
    - [ ] POS端末から本ツールへデータ送信
  - [ ] カート情報受信API
    - [ ] `POST /api/pos-cart/receive`

- [ ] QRコード連携（案3）
  - [ ] POS側でカート内容をQRコード化
  - [ ] スタッフがスキャン
  - [ ] 本ツールでQRデコード

- [ ] 実装選択
  - [ ] 最も実現可能な方法を選択
  - [ ] Shopify POS環境で実機テスト

- [ ] UI統合
  - [ ] 「POSカート取得」ボタン実装
  - [ ] 取得方法に応じたUIフロー

---

## 📊 進捗トラッキング

### Phase 2
- [ ] Task 8: オンラインカートUI (8h) - 0%
- [ ] Task 9: Storefront API連携 (6h) - 0%
- [ ] Task 10: WebSocket通知 (8h) - 0%
- [ ] Task 11: POS記録ガイド (3h) - 0%

**Phase 2 合計**: 25時間 / 0時間完了

### Phase 3
- [ ] Task 14: POSカート取得 (10h) - 0%

**Phase 3 合計**: 10時間 / 0時間完了

---

## 🎯 完成定義

Phase 2完了時、以下が可能になる：

1. ✅ Mockカートを表示
   - テストデータでUI確認
   - カート内容一覧表示

2. ✅ チェックアウトURL生成
   - Shopify Storefront API連携
   - QRコード表示

3. ✅ 顧客がスマホで決済
   - QRスキャン → Shopify Payments
   - オンライン注文として記録

4. ✅ スタッフに通知
   - WebSocketリアルタイム通知
   - 注文完了メッセージ表示

5. ✅ POS記録ガイド表示
   - ステップバイステップ手順
   - カスタム決済タイプ記録

Phase 3完了時、以下が追加される：

6. ✅ 実機POSからカート取得
   - Shopify POS連携
   - リアルタイムカート同期

---

## 🚀 開発開始コマンド

```bash
cd online-cart-tool
npm install
npm run dev
# → http://localhost:3002
```

商品登録・タグ生成と並行で開発できます。
まずはTask 8（オンラインカートUI）から着手してください。

Mock POSカートのテストデータを先に用意すると開発がスムーズです。
