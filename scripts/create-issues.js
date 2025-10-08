#!/usr/bin/env node

/**
 * GitHub Issues作成スクリプト
 *
 * 使い方:
 * 1. GitHubで Personal Access Token を作成
 *    Settings > Developer settings > Personal access tokens > Tokens (classic)
 *    Scopes: repo
 *
 * 2. 環境変数設定
 *    export GITHUB_TOKEN=your_token_here
 *    export GITHUB_REPO=owner/repo
 *
 * 3. 実行
 *    node scripts/create-issues.js
 */

const https = require('https');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO;

if (!GITHUB_TOKEN || !GITHUB_REPO) {
  console.error('❌ Error: GITHUB_TOKEN and GITHUB_REPO environment variables are required');
  console.error('');
  console.error('Usage:');
  console.error('  export GITHUB_TOKEN=your_token_here');
  console.error('  export GITHUB_REPO=owner/repo');
  console.error('  node scripts/create-issues.js');
  process.exit(1);
}

const issues = [
  // Phase 1: 基礎実装
  {
    title: '[Phase 1] 商品登録フォームUI実装 (F101)',
    body: `## 概要
商品情報入力フォームのUI実装。古着（一点物）と新品（複数在庫）の両方に対応。

## タスク
- [ ] フォームコンポーネント作成
  - [ ] 商品名、価格、カテゴリー、詳細説明
  - [ ] 古着/新品トグル
- [ ] 古着専用フィールド（条件表示）
  - [ ] 採寸データ入力（肩幅、胸囲、袖丈、着丈）
  - [ ] 素材、原産国
- [ ] 新品専用フィールド（条件表示）
  - [ ] サイズ、カラー選択
  - [ ] 在庫数入力
- [ ] SKU自動生成プレビュー表示
- [ ] バリデーション実装（クライアント・サーバー）
- [ ] レスポンシブデザイン

## 見積
8時間

## ファイル
- \`product-registration-tool/src/app/page.tsx\`
- \`product-registration-tool/src/components/ProductForm.tsx\`

## 依存
なし

## 完了条件
フォーム送信で\`ProductData\`型のデータが生成される
`,
    labels: ['Phase 1', 'product-registration-tool', 'UI', 'priority: high']
  },
  {
    title: '[Phase 1] Shopify Admin API連携 - 商品作成 (F104-F105)',
    body: `## 概要
Shopify Admin APIを使用して商品をShopifyに登録する機能を実装。

## タスク
- [ ] Shopify Admin API SDK設定
  - [ ] \`@shopify/shopify-api\` 初期化
  - [ ] 環境変数から認証情報取得
- [ ] \`createShopifyProduct()\` 実装
  - [ ] Point of Saleチャネル自動有効化
  - [ ] バリアント作成（新品の場合）
  - [ ] メタフィールド設定（採寸データ）
- [ ] Next.js APIルート作成 (\`POST /api/products\`)
- [ ] エラーハンドリング
- [ ] Mock/本番切り替え設定

## 見積
6時間

## ファイル
- \`product-registration-tool/src/lib/shopify.ts\`
- \`product-registration-tool/src/app/api/products/route.ts\`

## 依存
#1 (商品登録フォームUI)

## 完了条件
Mock/本番両方で商品登録が成功する
`,
    labels: ['Phase 1', 'product-registration-tool', 'API', 'priority: high']
  },
  {
    title: '[Phase 1] 画像アップロード機能実装 (F103)',
    body: `## 概要
商品画像のアップロード機能。ドラッグ&ドロップ、プレビュー、複数画像対応。

## タスク
- [ ] ImageUploadコンポーネント
  - [ ] ドラッグ&ドロップ対応
  - [ ] プレビュー表示（サムネイル）
  - [ ] 複数画像対応（最大5枚）
  - [ ] 画像削除・並び替え
- [ ] クライアント側処理
  - [ ] 画像圧縮・リサイズ（最大1200px、5MB）
  - [ ] ファイル形式チェック（JPEG, PNG, WebP）
- [ ] アップロードAPI
  - [ ] Shopifyへのアップロード
  - [ ] または一時ストレージ保存
- [ ] フォーム統合

## 見積
5時間

## ファイル
- \`product-registration-tool/src/components/ImageUpload.tsx\`
- \`product-registration-tool/src/app/api/upload/route.ts\`

## 依存
#1 (商品登録フォームUI)

## 完了条件
画像がShopify商品に紐づけられる
`,
    labels: ['Phase 1', 'product-registration-tool', 'UI', 'priority: medium']
  },
  {
    title: '[Phase 1] タグ生成システムへの遷移ボタン (F106)',
    body: `## 概要
商品登録完了後、タグ生成システムへワンクリックで遷移できるボタンを実装。

## タスク
- [ ] 成功メッセージコンポーネント
  - [ ] 商品登録成功メッセージ
  - [ ] 作成された商品情報表示（商品名、SKU、商品ID）
- [ ] タグ生成システムへのリンク
  - [ ] URLパラメータ付き (\`?sku={sku}\`)
  - [ ] 新しいタブで開く
- [ ] 連続登録機能
  - [ ] 「続けて登録」ボタン
  - [ ] フォームリセット

## 見積
2時間

## ファイル
- \`product-registration-tool/src/components/SuccessMessage.tsx\`

## 依存
#2 (Shopify Admin API連携)

## 完了条件
登録後、ワンクリックでタグ生成画面に遷移できる
`,
    labels: ['Phase 1', 'product-registration-tool', 'UI', 'priority: medium']
  },
  {
    title: '[Phase 1] タグ生成ページUI実装 (F201)',
    body: `## 概要
SKUまたは商品IDで商品情報を取得し、タグ生成画面を表示。

## タスク
- [ ] URLパラメータ処理（sku取得）
- [ ] 商品検索フォーム（オプション）
- [ ] Shopify APIから商品情報取得
  - [ ] Mock API対応
  - [ ] ローディング状態管理
- [ ] 商品詳細表示
  - [ ] 商品画像、商品名、価格、SKU
  - [ ] 採寸データ（古着の場合）
- [ ] エラー処理
  - [ ] 商品が見つからない（404）
  - [ ] API接続エラー

## 見積
6時間

## ファイル
- \`tag-generation-system/src/app/page.tsx\`
- \`tag-generation-system/src/components/TagGenerator.tsx\`

## 依存
なし（商品登録と並行可）

## 完了条件
SKUで商品情報が取得・表示される
`,
    labels: ['Phase 1', 'tag-generation-system', 'UI', 'priority: high']
  },
  {
    title: '[Phase 1] QRコード表示UI実装 (F202-F203)',
    body: `## 概要
POS用と顧客閲覧用の2種類のQRコードを生成・表示。

## タスク
- [ ] QRCodeDisplayコンポーネント
  - [ ] 2カラムレイアウト（POS用 / 顧客用）
  - [ ] ラベル付き表示
  - [ ] QRコードサイズ 200x200px
- [ ] QRコード生成トリガー
  - [ ] 商品情報取得後に自動生成
- [ ] QRコード内容
  - [ ] POS用: SKU文字列
  - [ ] 顧客用: 商品詳細ページURL
- [ ] ダウンロード機能
  - [ ] PNG形式でダウンロード
  - [ ] ファイル名: \`tag-pos-{sku}.png\`, \`tag-customer-{sku}.png\`

## 見積
4時間

## ファイル
- \`tag-generation-system/src/components/QRCodeDisplay.tsx\`

## 依存
#5 (タグ生成ページUI)

## 完了条件
2種類のQRコードが表示される
`,
    labels: ['Phase 1', 'tag-generation-system', 'UI', 'priority: high']
  },
  {
    title: '[Phase 1] 印刷プレビューUI実装 (F205)',
    body: `## 概要
60mm x 90mm のタグデザインをプレビュー表示し、ブラウザから印刷可能にする。

## タスク
- [ ] PrintPreviewコンポーネント
  - [ ] タグデザインレイアウト（60mm x 90mm）
  - [ ] デザイン要素配置（商品名、価格、SKU、QRコード×2）
- [ ] プレビューモーダル
  - [ ] 「プレビュー」ボタンでモーダル開く
  - [ ] 実寸表示オプション
- [ ] CSS印刷対応
  - [ ] \`@media print\` スタイル
  - [ ] 余白削除、カラー印刷設定
- [ ] 印刷ボタン
  - [ ] \`window.print()\` 呼び出し

## 見積
5時間

## ファイル
- \`tag-generation-system/src/components/PrintPreview.tsx\`

## 依存
#6 (QRコード表示UI)

## 完了条件
タグデザインがプレビュー・印刷できる
`,
    labels: ['Phase 1', 'tag-generation-system', 'UI', 'priority: high']
  },
  // Phase 2: コア機能
  {
    title: '[Phase 2] オンラインカート生成UI実装 (F301-F303)',
    body: `## 概要
POSカート情報を取得し、チェックアウトQRコードを生成・表示するUI。

## タスク
- [ ] 3カラムレイアウト
  - [ ] 左: POSカート情報
  - [ ] 中央: チェックアウトQRコード
  - [ ] 右: 通知・ガイド表示
- [ ] POSカート取得セクション
  - [ ] 「POSカート取得」ボタン
  - [ ] ローディング状態
  - [ ] Mock POSカート注入（開発用）
- [ ] カート内容表示
  - [ ] 商品リストテーブル（SKU、商品名、数量、単価、小計）
  - [ ] 合計金額
- [ ] チェックアウト生成セクション
  - [ ] 「チェックアウト生成」ボタン
  - [ ] QRコード表示（300x300px）
  - [ ] チェックアウトURL表示
- [ ] セッション管理表示
  - [ ] セッションID、タイムアウトカウントダウン（10分）

## 見積
8時間

## ファイル
- \`online-cart-tool/src/app/page.tsx\`
- \`online-cart-tool/src/components/CartDisplay.tsx\`

## 依存
なし（並行開発可）

## 完了条件
Mock POSカートでQRコードが表示される
`,
    labels: ['Phase 2', 'online-cart-tool', 'UI', 'priority: high']
  },
  {
    title: '[Phase 2] Shopify Storefront API連携 - Checkout作成 (F302)',
    body: `## 概要
Shopify Storefront APIを使用してチェックアウトセッションを作成。

## タスク
- [ ] Storefront API SDK設定
  - [ ] GraphQLクライアント初期化
  - [ ] Storefront Access Token設定
- [ ] Checkout作成mutation
  - [ ] \`checkoutCreate\` GraphQLクエリ作成
  - [ ] lineItems構築
  - [ ] カスタム属性設定（セッションID）
- [ ] Checkout URL取得
  - [ ] \`webUrl\` 抽出
  - [ ] QRコード生成に渡す
  - [ ] セッション情報保存（Redis）
- [ ] エラーハンドリング
- [ ] Next.js APIルート (\`POST /api/checkout\`)
- [ ] Mock/本番切り替え

## 見積
6時間

## ファイル
- \`online-cart-tool/src/lib/checkout.ts\`
- \`online-cart-tool/src/app/api/checkout/route.ts\`

## 依存
#8 (オンラインカートUI)

## 完了条件
実際のShopifyチェックアウトURLが生成される
`,
    labels: ['Phase 2', 'online-cart-tool', 'API', 'priority: high']
  },
  {
    title: '[Phase 2] WebSocket通知システム実装 (F304)',
    body: `## 概要
顧客の決済完了時に、スタッフ側にリアルタイムで通知するWebSocketシステム。

## タスク
- [ ] Socket.IO サーバー設定
  - [ ] Next.js カスタムサーバー作成
  - [ ] CORS設定
  - [ ] クライアント接続管理
- [ ] Shopify Webhook受信
  - [ ] \`POST /api/webhook/orders-create\`
  - [ ] HMAC署名検証
  - [ ] 注文データパース
  - [ ] セッションID照合（Redis）
- [ ] リアルタイム通知
  - [ ] WebSocket経由で通知送信
  - [ ] 通知データ構造（注文番号、金額、注文ID）
- [ ] クライアント側実装
  - [ ] \`useSocket\` カスタムフック
  - [ ] WebSocket接続・再接続ロジック
  - [ ] 通知受信ハンドラー
- [ ] 通知UI（トースト通知、音声通知）

## 見積
8時間

## ファイル
- \`online-cart-tool/src/lib/websocket.ts\`
- \`online-cart-tool/src/app/api/webhook/route.ts\`
- \`online-cart-tool/server.js\`

## 依存
#9 (Storefront API連携)

## 完了条件
決済完了時にスタッフ側に通知が届く
`,
    labels: ['Phase 2', 'online-cart-tool', 'WebSocket', 'priority: high']
  },
  {
    title: '[Phase 2] POS記録ガイドUI実装 (F305)',
    body: `## 概要
注文完了後、スタッフがPOSで決済を記録するためのステップバイステップガイド。

## タスク
- [ ] POSGuideコンポーネント
  - [ ] モーダル形式、フルスクリーンオーバーレイ
- [ ] ガイド内容
  - [ ] 注文完了メッセージ
  - [ ] 注文情報表示（注文番号、金額、日時）
  - [ ] ステップバイステップ手順
    1. Shopify POSアプリを開く
    2. カスタム決済タイプ選択
    3. 金額入力
    4. 決済完了記録
  - [ ] 注意事項
- [ ] アクション
  - [ ] 「記録完了」ボタン
  - [ ] セッションクローズ
- [ ] 自動表示（注文完了通知受信時）

## 見積
3時間

## ファイル
- \`online-cart-tool/src/components/POSGuide.tsx\`

## 依存
#10 (WebSocket通知システム)

## 完了条件
通知後、明確なガイドが表示される
`,
    labels: ['Phase 2', 'online-cart-tool', 'UI', 'priority: medium']
  },
  {
    title: '[Phase 2] E2Eテスト実行・修正',
    body: `## 概要
Playwrightによる全E2Eテストの実行と修正。

## タスク
- [ ] 商品登録フローテスト
  - [ ] セレクタ修正
  - [ ] 実際のUIに合わせて調整
- [ ] タグ生成フローテスト
  - [ ] QRコード表示確認
  - [ ] プレビュー機能テスト
- [ ] オンラインカートフローテスト
  - [ ] WebSocket通知テスト
  - [ ] タイムアウト処理テスト
- [ ] 統合業務フローテスト
  - [ ] Stage 1-3の完全フロー
  - [ ] データ整合性確認
- [ ] CI/CD統合
  - [ ] GitHub Actions設定
  - [ ] 自動テスト実行

## 見積
10時間

## ファイル
- \`e2e-tests/tests/*.spec.js\`

## 依存
#1-11 (全Phase 1-2タスク)

## 完了条件
全E2Eテストがパスする
`,
    labels: ['Phase 2', 'testing', 'E2E', 'priority: medium']
  },
  // Phase 3: ハードウェア連携
  {
    title: '[Phase 3] ラベルプリンタ連携実装 (F204)',
    body: `## 概要
ESC/POSコマンドによるラベルプリンタへのネットワーク印刷機能。

## タスク
- [ ] プリンタ機種調査
  - [ ] 型番確認、ドライバ/SDK確認
- [ ] ESC/POS コマンド生成
  - [ ] タグデザインをコマンドに変換
  - [ ] QRコード印刷コマンド
- [ ] ネットワーク印刷実装
  - [ ] TCP/IP経由でプリンタに送信
  - [ ] IPアドレス設定（環境変数）
- [ ] 印刷ジョブ管理
  - [ ] キュー実装（Redis）
  - [ ] エラーリトライ
  - [ ] 印刷履歴記録（PostgreSQL）
- [ ] 印刷API (\`POST /api/print\`)
- [ ] UI統合

## 見積
12時間

## ファイル
- \`tag-generation-system/src/lib/printer.ts\`
- \`tag-generation-system/src/app/api/print/route.ts\`

## 依存
#7 (印刷プレビューUI)

## 完了条件
実機プリンタでタグが印刷される
`,
    labels: ['Phase 3', 'tag-generation-system', 'hardware', 'priority: low']
  },
  {
    title: '[Phase 3] POSカート情報取得実装 (F301)',
    body: `## 概要
実機Shopify POSからカート情報をリアルタイムで取得する機能。

## タスク
- [ ] Shopify POS API調査
  - [ ] POS API仕様確認
  - [ ] 認証方法、エンドポイント確認
- [ ] POS API連携（案1）
  - [ ] 現在のカート状態取得
  - [ ] 商品SKU、数量、価格取得
- [ ] ローカルネットワーク連携（案2）
  - [ ] POS端末とのローカル通信
  - [ ] WebSocketまたはHTTP POST
- [ ] QRコード連携（案3）
  - [ ] POS側でカート内容をQRコード化
  - [ ] 本ツールでQRデコード
- [ ] 実装選択
  - [ ] 最も実現可能な方法を選択
  - [ ] 実機テスト
- [ ] UI統合

## 見積
10時間

## ファイル
- \`online-cart-tool/src/lib/checkout.ts\`
- \`online-cart-tool/src/app/api/pos-cart/route.ts\`

## 依存
#8 (オンラインカートUI)

## 完了条件
実機POSからカート情報が取得できる
`,
    labels: ['Phase 3', 'online-cart-tool', 'hardware', 'POS', 'priority: low']
  },
  {
    title: '[Phase 3] Shopify POS仕様調整 (QRフォーマット)',
    body: `## 概要
Shopify POSでスキャン可能なQRコード形式への調整。

## タスク
- [ ] Shopify POS仕様調査
  - [ ] POSでスキャン可能なQRコードフォーマット
  - [ ] SKU形式 vs 商品URL形式
  - [ ] バーコード形式（CODE128等）オプション
- [ ] QRコード内容調整
  - [ ] \`generatePOSQRCode()\` 修正
  - [ ] Shopify POS仕様に準拠
- [ ] 実機テスト
  - [ ] Shopify POSアプリ（iOS/Android）
  - [ ] QRコードスキャン
  - [ ] 商品がカートに追加されるか確認
- [ ] フォールバック実装
  - [ ] QRコードとバーコード両方印刷

## 見積
4時間

## ファイル
- \`tag-generation-system/src/lib/qrcode-generator.ts\`

## 依存
#6 (QRコード表示UI), 実機POS環境

## 完了条件
POSでQRスキャンして商品追加できる
`,
    labels: ['Phase 3', 'tag-generation-system', 'POS', 'priority: low']
  },
  // Phase 4: 本番準備
  {
    title: '[Phase 4] エラーハンドリング・バリデーション強化',
    body: `## 概要
全プロジェクトのエラーハンドリングとバリデーションを強化。

## タスク
- [ ] フロントエンドバリデーション
  - [ ] 全フォーム項目
  - [ ] リアルタイムエラー表示
- [ ] APIエラーハンドリング
  - [ ] Shopify APIエラー
  - [ ] ネットワークエラー
  - [ ] タイムアウト処理
- [ ] ユーザーフィードバック
  - [ ] トースト通知
  - [ ] エラーメッセージ日本語化
- [ ] ロギング
  - [ ] エラーログ記録
  - [ ] デバッグ情報

## 見積
8時間

## プロジェクト
全プロジェクト

## 依存
#1-15 (全Phase 1-3タスク)

## 完了条件
全エラーケースで適切なメッセージが表示される
`,
    labels: ['Phase 4', 'quality', 'priority: medium']
  },
  {
    title: '[Phase 4] 本番Shopify環境接続テスト',
    body: `## 概要
本番Shopify環境での動作確認とテスト。

## タスク
- [ ] 本番Shopify設定
  - [ ] カスタムアプリ作成
  - [ ] API権限設定（Admin API, Storefront API）
  - [ ] Webhook設定（orders/create）
- [ ] 環境変数設定
  - [ ] 本番認証情報
  - [ ] Mock APIを無効化
- [ ] 接続テスト
  - [ ] 商品作成テスト
  - [ ] Checkoutテスト
  - [ ] Webhook受信テスト
- [ ] データクリーンアップ
  - [ ] テストデータ削除

## 見積
6時間

## プロジェクト
全プロジェクト

## 依存
#1-16 (全Phase 1-3 + エラーハンドリング)

## 完了条件
本番Shopifyで全機能が動作する
`,
    labels: ['Phase 4', 'deployment', 'priority: high']
  },
  {
    title: '[Phase 4] パフォーマンス最適化',
    body: `## 概要
全プロジェクトのパフォーマンス最適化。

## タスク
- [ ] 画像最適化
  - [ ] Next.js Image コンポーネント使用
  - [ ] Lazy loading
- [ ] API呼び出し最適化
  - [ ] キャッシング
  - [ ] 不要なリクエスト削減
- [ ] バンドルサイズ削減
  - [ ] Tree shaking
  - [ ] Code splitting
- [ ] レスポンス速度改善
  - [ ] SSR/ISR活用
  - [ ] Redis キャッシュ
- [ ] Lighthouse監査
  - [ ] スコア 90以上目標

## 見積
8時間

## プロジェクト
全プロジェクト

## 依存
#1-17 (全前提タスク)

## 完了条件
Lighthouse スコア 90以上
`,
    labels: ['Phase 4', 'performance', 'priority: medium']
  }
];

function createIssue(issue, index) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      title: issue.title,
      body: issue.body,
      labels: issue.labels
    });

    const [owner, repo] = GITHUB_REPO.split('/');

    const options = {
      hostname: 'api.github.com',
      port: 443,
      path: `/repos/${owner}/${repo}/issues`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Authorization': `token ${GITHUB_TOKEN}`,
        'User-Agent': '85projects-issue-creator',
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 201) {
          const response = JSON.parse(body);
          console.log(`✅ Issue #${index + 1} created: ${issue.title} (#${response.number})`);
          resolve(response);
        } else {
          console.error(`❌ Failed to create issue #${index + 1}: ${issue.title}`);
          console.error(`Status: ${res.statusCode}`);
          console.error(`Body: ${body}`);
          reject(new Error(`Failed to create issue: ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error(`❌ Error creating issue #${index + 1}:`, error);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function main() {
  console.log(`🚀 Creating ${issues.length} issues in ${GITHUB_REPO}...\n`);

  for (let i = 0; i < issues.length; i++) {
    try {
      await createIssue(issues[i], i);
      // Rate limiting: wait 1 second between requests
      if (i < issues.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`Failed to create issue ${i + 1}:`, error.message);
      process.exit(1);
    }
  }

  console.log(`\n✅ Successfully created ${issues.length} issues!`);
  console.log(`\nView issues at: https://github.com/${GITHUB_REPO}/issues`);
}

main();
