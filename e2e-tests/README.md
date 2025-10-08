# E2E Testing

Playwright による85storeシステムのEnd-to-Endテスト。

## セットアップ

```bash
npm install
npx playwright install  # ブラウザインストール
```

## テスト実行

```bash
# 全テスト実行
npm test

# UI モード（推奨）
npm run test:ui

# 特定のテストファイルのみ
npx playwright test tests/01-product-registration.spec.js

# デバッグモード
npm run test:debug

# ヘッドレスブラウザ表示
npm run test:headed

# 特定のブラウザのみ
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## テストレポート

```bash
# HTMLレポート表示
npm run report
```

## コードジェネレーター

新しいテストケースを簡単に作成：

```bash
npm run codegen
```

ブラウザが起動し、操作を記録してPlaywrightコードを自動生成します。

## テスト構成

### 01-product-registration.spec.js
**商品登録フロー (F101-F106)**

- 古着（一点物）の登録
- 新品（複数在庫）の登録
- SKU自動生成確認
- バリデーションテスト

### 02-tag-generation.spec.js
**タグ生成・印刷フロー (F201-F205)**

- QRコード生成（POS用・顧客用）
- 印刷プレビュー
- タグデザイン確認
- QRコードスキャンシミュレーション

### 03-online-cart.spec.js
**オンラインカート生成フロー (F301-F305)**

- POSカート取得
- チェックアウトURL生成
- QRコード表示
- 決済完了通知
- POS記録ガイド

### 04-integration.spec.js
**統合テスト（業務フロー全体）**

- Stage 1: 入荷・商品準備
- Stage 2: 店舗販売・決済
- Stage 3: 在庫確認

完全な業務フローをEnd-to-Endでテストします。

## ベストプラクティス

### データクリーンアップ

各テストの`beforeEach`でデータをリセット：

```javascript
test.beforeEach(async ({ page }) => {
  await fetch('http://localhost:4000/dev/reset', { method: 'POST' })
})
```

### スクリーンショット

失敗時に自動でスクリーンショット・動画を保存：

```bash
ls test-results/
```

### 並列実行

複数ブラウザで並列実行（CI環境では1ワーカー）：

```javascript
workers: process.env.CI ? 1 : undefined,
```

## CI/CD統合

GitLab CI/GitHub Actionsでの実行例：

```yaml
test:
  script:
    - docker-compose up -d
    - cd e2e-tests
    - npm install
    - npx playwright install --with-deps
    - npm test
  artifacts:
    when: always
    paths:
      - e2e-tests/playwright-report/
      - e2e-tests/test-results/
```

## トラブルシューティング

### テストがタイムアウトする

サービスが起動していない可能性：

```bash
# サービス確認
docker-compose ps

# ヘルスチェック
curl http://localhost:4000/health
```

### スクリーンショットを確認したい

```bash
ls test-results/
```

各テストケースごとにスクリーンショット・動画が保存されます。

### 特定の要素が見つからない

Playwright Inspectorでデバッグ：

```bash
npm run test:debug
```

ステップごとに実行を確認できます。
