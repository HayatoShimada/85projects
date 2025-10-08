# 本番環境テストガイド

## 事前準備

### 1. 環境変数の設定

各プロジェクトに`.env.local`ファイルを作成し、本番環境のAPIキーを設定してください。

#### product-registration-tool/.env.local
```env
SHOPIFY_STORE_URL=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=your-admin-api-token
SHOPIFY_API_VERSION=2024-01
NEXT_PUBLIC_TAG_SYSTEM_URL=http://localhost:3001
```

#### tag-generation-system/.env.local
```env
SHOPIFY_STORE_URL=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=your-admin-api-token
SHOPIFY_API_VERSION=2024-01
NEXT_PUBLIC_STORE_DOMAIN=your-store.myshopify.com
```

#### online-cart-tool/.env.local
```env
SHOPIFY_STORE_URL=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=your-admin-api-token
SHOPIFY_API_VERSION=2024-01
SHOPIFY_STOREFRONT_TOKEN=your-storefront-api-token
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:3002
```

### 2. 依存関係のインストール

```bash
# 商品登録ツール
cd product-registration-tool
npm install

# タグ生成システム
cd ../tag-generation-system
npm install

# オンラインカート生成ツール
cd ../online-cart-tool
npm install
```

## 起動方法

### 開発環境での起動

各ツールを別々のターミナルで起動してください。

```bash
# ターミナル1: 商品登録ツール (http://localhost:3000)
cd product-registration-tool
npm run dev

# ターミナル2: タグ生成システム (http://localhost:3001)
cd tag-generation-system
npm run dev

# ターミナル3: オンラインカート生成ツール (http://localhost:3002)
cd online-cart-tool
npm run dev
```

### 本番ビルドでの起動

```bash
# 各プロジェクトでビルド
cd product-registration-tool && npm run build
cd ../tag-generation-system && npm run build
cd ../online-cart-tool && npm run build

# 各プロジェクトで起動
cd product-registration-tool && npm start  # http://localhost:3000
cd tag-generation-system && npm start       # http://localhost:3001
cd online-cart-tool && npm start            # http://localhost:3002
```

## テストシナリオ

### Phase 1: 商品登録・タグ生成システム (F101-F205)

#### テスト1: 古着商品の登録
1. http://localhost:3000 にアクセス
2. 「古着（一点物）」にチェックを入れる
3. 以下の情報を入力：
   - 商品名: 「ヴィンテージデニムジャケット」
   - 価格: 「8900」
   - カテゴリー: 「アウター」
   - 商品説明: 任意
   - 状態ランク: 「A」
   - 採寸データ: 肩幅45、胸囲50、袖丈60、着丈65
   - 素材: 「コットン100%」
   - 原産国: 「USA」
4. 「商品を登録」ボタンをクリック
5. **期待結果**:
   - Shopify Admin APIで商品が作成される
   - SKUが自動生成される（VTG-xxxxx-xxxxx形式）
   - タグ生成システムへの遷移リンクが表示される

#### テスト2: タグ生成・PDF保存
1. 商品登録後の画面で「タグ生成システムで印刷する」リンクをクリック
2. **期待結果**:
   - http://localhost:3001 が開く
   - 商品情報（商品名、価格、状態ランク）が表示される
   - 2つのQRコードが表示される（POS用、顧客閲覧用）
3. 「📋 印刷プレビュー（PDF保存推奨）」ボタンをクリック
4. プレビュー画面で「🖨️ 印刷 / PDF保存」ボタンをクリック
5. 印刷ダイアログで「PDFに保存」を選択
6. **期待結果**:
   - 60mm x 90mm サイズのタグPDFが生成される
   - 商品名、価格、状態ランク、QRコード、SKUが含まれる

#### テスト3: 新品商品の登録
1. http://localhost:3000 にアクセス
2. 「古着（一点物）」のチェックを外す
3. 以下の情報を入力：
   - 商品名: 「新品Tシャツ」
   - 価格: 「3500」
   - カテゴリー: 「トップス」
   - サイズ: 「M」
   - カラー: 「ブラック」
   - 在庫数: 「10」
4. 「商品を登録」ボタンをクリック
5. **期待結果**:
   - SKUが自動生成される（NEW-xxxxx-xxxxx形式）
   - 商品がShopifyに登録される

### Phase 1.5: 在庫管理機能 (F107-F110)

#### テスト4: 商品一覧表示
1. http://localhost:3000 にアクセス
2. 右上の「📋 商品一覧」ボタンをクリック
3. **期待結果**:
   - 登録済み商品が一覧表示される
   - 商品名、SKU、価格、タイプ（古着/新品）、カテゴリーが表示される
   - 状態ランクが表示される（古着の場合）

#### テスト5: 商品検索・フィルター
1. 商品一覧ページで検索ボックスに「デニム」と入力
2. **期待結果**: デニムを含む商品のみ表示される
3. カテゴリーフィルターで「アウター」を選択
4. **期待結果**: アウターカテゴリーの商品のみ表示される
5. 商品タイプフィルターで「古着（一点物）」を選択
6. **期待結果**: 古着商品のみ表示される

#### テスト6: 商品編集
1. 商品一覧で任意の商品の「編集」リンクをクリック
2. 価格を変更（例: 8900 → 7900）
3. 「更新する」ボタンをクリック
4. **期待結果**:
   - 商品情報が更新される
   - 商品一覧ページに戻る
   - 価格が更新されている

#### テスト7: 商品削除
1. 商品一覧でテスト用商品の「削除」ボタンをクリック
2. 確認ダイアログで「OK」をクリック
3. **期待結果**:
   - 商品が一覧から削除される
   - Shopifyからも削除される

### Phase 2: オンラインカート生成ツール (F301-F305)

#### テスト8: チェックアウトURL生成（デモモード）
1. http://localhost:3002 にアクセス
2. カート情報を入力：
   - SKU: 登録した商品のSKU
   - Variant ID: 任意の数値（例: 12345）
   - 数量: 1
3. 「➕ アイテム追加」ボタンをクリック
4. 「🔗 チェックアウトURL生成」ボタンをクリック
5. **期待結果**:
   - QRコードが表示される
   - チェックアウトURLが表示される
   - Session IDが表示される

#### テスト9: 決済完了フロー（デモ）
1. QRコード表示画面で「✅ 決済完了を確認（デモ用）」ボタンをクリック
2. **期待結果**:
   - 注文完了通知が表示される（緑色）
   - POS決済記録ガイドが表示される（黄色）
   - 4ステップの手順が表示される

## トラブルシューティング

### 商品が登録されない
- `.env.local`のAPIキーが正しいか確認
- `SHOPIFY_STORE_URL`の形式が正しいか確認（例: your-store.myshopify.com）
- Shopify Admin APIのアクセス権限を確認

### タグ生成システムで商品情報が表示されない
- URLパラメータ（sku, title, price, condition）が正しく渡されているか確認
- ブラウザのコンソールでエラーを確認

### PDF保存ができない
- ブラウザの印刷機能が使えるか確認
- 印刷ダイアログで「PDFに保存」オプションを選択

## 既知の制限事項

### Mock環境
現在の実装はMock環境での動作を想定しています：
- **商品登録**: Shopify API連携は実装済みですが、Mock APIも利用可能
- **タグ生成**: URLパラメータで商品情報を受け渡し
- **オンラインカート**: チェックアウトURL生成はMock実装

### 本番環境への移行時の対応
1. **product-registration-tool**:
   - `.env.local`で本番APIキーを設定
   - `SHOPIFY_API_ENDPOINT`を削除または本番URLに変更

2. **tag-generation-system**:
   - `.env.local`で本番APIキーを設定
   - `NEXT_PUBLIC_STORE_DOMAIN`を本番ドメインに設定

3. **online-cart-tool**:
   - Shopify Storefront API実装が必要
   - WebSocket/Webhook実装が必要（F304リアルタイム通知用）

## 次のステップ

本番環境テストが完了したら、以下のPhaseに進むことができます：

- **Phase 3**: ハードウェア連携（ラベルプリンター、POS統合）
- **Phase 4**: 本番環境準備（エラーハンドリング、パフォーマンス最適化）
- **Phase 5**: デプロイ・運用（Vercel/本番サーバーへのデプロイ）

## サポート

問題が発生した場合は、以下を確認してください：
1. ブラウザのコンソールログ
2. サーバーのログ（ターミナル出力）
3. Shopify管理画面でのAPI呼び出しログ
