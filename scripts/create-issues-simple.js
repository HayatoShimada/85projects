#!/usr/bin/env node

const https = require('https');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO;

if (!GITHUB_TOKEN || !GITHUB_REPO) {
  console.error('❌ Error: GITHUB_TOKEN and GITHUB_REPO environment variables are required');
  process.exit(1);
}

const issues = [
  {
    title: '[Phase 1] 商品登録フォームUI実装 (F101)',
    body: '**見積**: 8時間\n**ファイル**: product-registration-tool/src/app/page.tsx\n\n商品情報入力フォームのUI実装。古着（一点物）と新品（複数在庫）の両方に対応。\n\n詳細はリポジトリの product-registration-tool/TODO.md を参照。',
    labels: ['Phase 1', 'product-registration-tool', 'UI', 'priority: high']
  },
  {
    title: '[Phase 1] Shopify Admin API連携 - 商品作成 (F104-F105)',
    body: '**見積**: 6時間\n**ファイル**: product-registration-tool/src/lib/shopify.ts\n\nShopify Admin APIを使用して商品をShopifyに登録する機能を実装。\n\n詳細はリポジトリの product-registration-tool/TODO.md を参照。',
    labels: ['Phase 1', 'product-registration-tool', 'API', 'priority: high']
  },
  {
    title: '[Phase 1] 画像アップロード機能実装 (F103)',
    body: '**見積**: 5時間\n**ファイル**: product-registration-tool/src/components/ImageUpload.tsx\n\n商品画像のアップロード機能。ドラッグ&ドロップ、プレビュー、複数画像対応。\n\n詳細はリポジトリの product-registration-tool/TODO.md を参照。',
    labels: ['Phase 1', 'product-registration-tool', 'UI', 'priority: medium']
  },
  {
    title: '[Phase 1] タグ生成システムへの遷移ボタン (F106)',
    body: '**見積**: 2時間\n**ファイル**: product-registration-tool/src/components/SuccessMessage.tsx\n\n商品登録完了後、タグ生成システムへワンクリックで遷移できるボタンを実装。\n\n詳細はリポジトリの product-registration-tool/TODO.md を参照。',
    labels: ['Phase 1', 'product-registration-tool', 'UI', 'priority: medium']
  },
  {
    title: '[Phase 1] タグ生成ページUI実装 (F201)',
    body: '**見積**: 6時間\n**ファイル**: tag-generation-system/src/app/page.tsx\n\nSKUまたは商品IDで商品情報を取得し、タグ生成画面を表示。\n\n詳細はリポジトリの tag-generation-system/TODO.md を参照。',
    labels: ['Phase 1', 'tag-generation-system', 'UI', 'priority: high']
  },
  {
    title: '[Phase 1] QRコード表示UI実装 (F202-F203)',
    body: '**見積**: 4時間\n**ファイル**: tag-generation-system/src/components/QRCodeDisplay.tsx\n\nPOS用と顧客閲覧用の2種類のQRコードを生成・表示。\n\n詳細はリポジトリの tag-generation-system/TODO.md を参照。',
    labels: ['Phase 1', 'tag-generation-system', 'UI', 'priority: high']
  },
  {
    title: '[Phase 1] 印刷プレビューUI実装 (F205)',
    body: '**見積**: 5時間\n**ファイル**: tag-generation-system/src/components/PrintPreview.tsx\n\n60mm x 90mm のタグデザインをプレビュー表示し、ブラウザから印刷可能にする。\n\n詳細はリポジトリの tag-generation-system/TODO.md を参照。',
    labels: ['Phase 1', 'tag-generation-system', 'UI', 'priority: high']
  },
  {
    title: '[Phase 2] オンラインカート生成UI実装 (F301-F303)',
    body: '**見積**: 8時間\n**ファイル**: online-cart-tool/src/app/page.tsx\n\nPOSカート情報を取得し、チェックアウトQRコードを生成・表示するUI。\n\n詳細はリポジトリの online-cart-tool/TODO.md を参照。',
    labels: ['Phase 2', 'online-cart-tool', 'UI', 'priority: high']
  },
  {
    title: '[Phase 2] Shopify Storefront API連携 - Checkout作成 (F302)',
    body: '**見積**: 6時間\n**ファイル**: online-cart-tool/src/lib/checkout.ts\n\nShopify Storefront APIを使用してチェックアウトセッションを作成。\n\n詳細はリポジトリの online-cart-tool/TODO.md を参照。',
    labels: ['Phase 2', 'online-cart-tool', 'API', 'priority: high']
  },
  {
    title: '[Phase 2] WebSocket通知システム実装 (F304)',
    body: '**見積**: 8時間\n**ファイル**: online-cart-tool/src/lib/websocket.ts\n\n顧客の決済完了時に、スタッフ側にリアルタイムで通知するWebSocketシステム。\n\n詳細はリポジトリの online-cart-tool/TODO.md を参照。',
    labels: ['Phase 2', 'online-cart-tool', 'WebSocket', 'priority: high']
  },
  {
    title: '[Phase 2] POS記録ガイドUI実装 (F305)',
    body: '**見積**: 3時間\n**ファイル**: online-cart-tool/src/components/POSGuide.tsx\n\n注文完了後、スタッフがPOSで決済を記録するためのステップバイステップガイド。\n\n詳細はリポジトリの online-cart-tool/TODO.md を参照。',
    labels: ['Phase 2', 'online-cart-tool', 'UI', 'priority: medium']
  },
  {
    title: '[Phase 2] E2Eテスト実行・修正',
    body: '**見積**: 10時間\n**ファイル**: e2e-tests/tests/*.spec.js\n\nPlaywrightによる全E2Eテストの実行と修正。\n\n詳細はリポジトリの TODO.md を参照。',
    labels: ['Phase 2', 'testing', 'E2E', 'priority: medium']
  },
  {
    title: '[Phase 3] ラベルプリンタ連携実装 (F204)',
    body: '**見積**: 12時間\n**ファイル**: tag-generation-system/src/lib/printer.ts\n\nESC/POSコマンドによるラベルプリンタへのネットワーク印刷機能。\n\n詳細はリポジトリの tag-generation-system/TODO.md を参照。',
    labels: ['Phase 3', 'tag-generation-system', 'hardware', 'priority: low']
  },
  {
    title: '[Phase 3] POSカート情報取得実装 (F301)',
    body: '**見積**: 10時間\n**ファイル**: online-cart-tool/src/lib/checkout.ts\n\n実機Shopify POSからカート情報をリアルタイムで取得する機能。\n\n詳細はリポジトリの online-cart-tool/TODO.md を参照。',
    labels: ['Phase 3', 'online-cart-tool', 'hardware', 'POS', 'priority: low']
  },
  {
    title: '[Phase 3] Shopify POS仕様調整 (QRフォーマット)',
    body: '**見積**: 4時間\n**ファイル**: tag-generation-system/src/lib/qrcode-generator.ts\n\nShopify POSでスキャン可能なQRコード形式への調整。\n\n詳細はリポジトリの tag-generation-system/TODO.md を参照。',
    labels: ['Phase 3', 'tag-generation-system', 'POS', 'priority: low']
  },
  {
    title: '[Phase 4] エラーハンドリング・バリデーション強化',
    body: '**見積**: 8時間\n\n全プロジェクトのエラーハンドリングとバリデーションを強化。\n\n詳細はリポジトリの TODO.md を参照。',
    labels: ['Phase 4', 'quality', 'priority: medium']
  },
  {
    title: '[Phase 4] 本番Shopify環境接続テスト',
    body: '**見積**: 6時間\n\n本番Shopify環境での動作確認とテスト。\n\n詳細はリポジトリの TODO.md を参照。',
    labels: ['Phase 4', 'deployment', 'priority: high']
  },
  {
    title: '[Phase 4] パフォーマンス最適化',
    body: '**見積**: 8時間\n\n全プロジェクトのパフォーマンス最適化。Lighthouse スコア 90以上を目標。\n\n詳細はリポジトリの TODO.md を参照。',
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
