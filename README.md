# 85projects - 衣類小売店 統合管理システム

古着・新品混在型の衣類小売店向け、商品登録からPOS販売まで一気通貫で管理できるカスタムツール群。

## 📋 プロジェクト概要

2名体制（エンジニア1名、販売スタッフ1名）での運用を前提とした、Shopify連携の統合管理システム。

### 主要機能

1. **商品登録/編集ツール** (F101-F106) - ポート 3000
   - 古着（一点物）と新品（複数在庫）の自動判別
   - SKU自動生成
   - Shopify API連携

2. **タグ生成・印刷システム** (F201-F205) - ポート 3001
   - QRコード自動生成（POS用・顧客閲覧用）
   - ラベルプリンタ連携
   - 印刷プレビュー

3. **オンラインカート生成ツール** (F301-F305) - ポート 3002
   - カード決済代替フロー
   - Shopify Payments連携
   - リアルタイム通知

## 🚀 クイックスタート

### 必要な環境

- Docker Desktop 20.10+
- Docker Compose 2.0+
- (オプション) Node.js 20+
- (オプション) make コマンド

### 起動手順

```bash
# 1. リポジトリクローン
git clone <repository-url>
cd 85projects

# 2. 環境変数設定（オプション、開発時はMock使用）
cp .env.example .env

# 3. Dockerイメージビルド
make build
# または: docker-compose build

# 4. 全サービス起動
make up
# または: docker-compose up -d

# 5. サンプルデータ投入
make seed
```

### アクセスURL

| サービス | URL |
|---------|-----|
| 商品登録ツール | http://localhost:3000 |
| タグ生成システム | http://localhost:3001 |
| オンラインカートツール | http://localhost:3002 |
| Shopify Mock API | http://localhost:4000 |
| Mailhog (開発用メール) | http://localhost:8025 |

## 📁 プロジェクト構成

```
85projects/
├── product-registration-tool/    # 商品登録ツール (F101-F106)
├── tag-generation-system/         # タグ生成システム (F201-F205)
├── online-cart-tool/              # オンラインカート (F301-F305)
├── dev-tools/
│   ├── shopify-mock/             # Shopify API Mock Server
│   ├── mock-data/                # サンプルデータ
│   └── db-init/                  # DB初期化スクリプト
├── e2e-tests/                    # Playwright E2Eテスト
├── docker-compose.yml            # Docker Compose設定
├── Makefile                      # 開発用コマンド
├── CLAUDE.md                     # システムアーキテクチャ
└── DEVELOPMENT.md                # 開発環境ガイド（詳細）
```

## 🛠️ 開発コマンド

### サービス管理

```bash
make up              # 全サービス起動
make down            # 全サービス停止
make restart         # 全サービス再起動
make ps              # コンテナ一覧表示
make logs            # 全ログ表示
```

### 個別サービス操作

```bash
make logs-product    # 商品登録ツールのログ
make logs-tag        # タグ生成システムのログ
make logs-cart       # オンラインカートのログ
make restart-product # 商品登録ツール再起動
```

### データ管理

```bash
make seed            # サンプルデータ投入
make reset           # 全データリセット
make health          # ヘルスチェック
```

### テスト

```bash
make test            # E2Eテスト実行
make test-ui         # テストUIモード
```

### その他

```bash
make help            # 全コマンド一覧
make clean           # 完全クリーンアップ
make shell-product   # 商品登録コンテナのシェル
make db-shell        # PostgreSQL接続
```

## 🧪 テスト

Playwrightによる包括的なE2Eテスト：

```bash
cd e2e-tests
npm install
npm test              # 全テスト実行
npm run test:ui       # UIモード（推奨）
npm run test:debug    # デバッグモード
```

テストカバレッジ：
- 商品登録フロー (F101-F106)
- タグ生成・印刷 (F201-F205)
- オンラインカート (F301-F305)
- 統合業務フロー（End-to-End）

詳細: [e2e-tests/README.md](./e2e-tests/README.md)

## 📚 ドキュメント

- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - 開発環境の詳細ガイド
- **[CLAUDE.md](./CLAUDE.md)** - システムアーキテクチャと仕様
- **各プロジェクトのREADME**
  - [product-registration-tool/README.md](./product-registration-tool/README.md)
  - [tag-generation-system/README.md](./tag-generation-system/README.md)
  - [online-cart-tool/README.md](./online-cart-tool/README.md)
- **[dev-tools/shopify-mock/README.md](./dev-tools/shopify-mock/README.md)** - Mock API仕様

## 🏗️ 技術スタック

- **Frontend/Backend**: Next.js 14 (App Router)
- **Language**: TypeScript
- **API**: Shopify Admin API, Storefront API
- **Testing**: Playwright
- **Infrastructure**: Docker Compose
- **Database**: PostgreSQL, Redis
- **QR Code**: qrcode.js
- **Real-time**: Socket.IO

## 🔧 本番環境への切り替え

開発環境（Mock API）から本番Shopifyへの切り替え：

```bash
# .envファイルを編集
SHOPIFY_STORE_URL=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_xxxxxxxxxxxxx
SHOPIFY_STOREFRONT_TOKEN=xxxxxxxxxxxxx

# SHOPIFY_API_ENDPOINTをコメントアウト
# SHOPIFY_API_ENDPOINT=http://shopify-mock:4000
```

## ⚠️ 重要な制約

1. **外部決済端末が使えない**: カード決済は必ずオンラインカートツールのフローを使用
2. **一点物と複数在庫の混在**: SKU生成ロジックで自動判別
3. **2名体制運用**: 非エンジニアスタッフでも操作できるシンプルなUI

## 🐛 トラブルシューティング

### ポート競合

```bash
lsof -i :3000  # ポート使用確認
make down      # サービス停止
```

### Dockerコンテナの問題

```bash
make clean     # 完全クリーンアップ
make build     # 再ビルド
make up        # 再起動
```

### データリセット

```bash
make reset     # Mock APIデータリセット
```

詳細: [DEVELOPMENT.md](./DEVELOPMENT.md#トラブルシューティング)

## 📄 ライセンス

Private - 85store専用システム

## 🤝 サポート

開発に関する質問や問題は、プロジェクトのIssueトラッカーに報告してください。
