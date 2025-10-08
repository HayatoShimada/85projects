# 開発環境ガイド

85store統合開発環境の完全ガイド。

## 📋 目次

1. [環境構築](#環境構築)
2. [開発サーバー起動](#開発サーバー起動)
3. [開発ツール](#開発ツール)
4. [テスト実行](#テスト実行)
5. [トラブルシューティング](#トラブルシューティング)

---

## 環境構築

### 必要なソフトウェア

- **Docker Desktop** 20.10以上
- **Docker Compose** 2.0以上
- **Node.js** 20以上（ローカル開発時）
- **make** コマンド（オプション）

### 初回セットアップ

```bash
# 1. リポジトリクローン
git clone <repository-url>
cd 85projects

# 2. 環境変数設定
cp .env.example .env
# .envファイルを編集してShopify認証情報を設定

# 3. 全プロジェクトの依存関係インストール（オプション）
make install-all

# 4. Dockerイメージビルド
make build

# 5. サービス起動
make up
```

### 環境変数

`.env`ファイルで以下を設定：

```bash
# 本番Shopify設定
SHOPIFY_STORE_URL=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_xxxxxxxxxxxxx
SHOPIFY_STOREFRONT_TOKEN=xxxxxxxxxxxxx

# ハードウェア
PRINTER_IP_ADDRESS=192.168.1.100
```

**開発時の注意**: Docker環境ではモックサーバーを使用するため、実際のShopify認証情報は不要です。

---

## 開発サーバー起動

### Docker Composeで全サービス起動

```bash
# バックグラウンドで起動
make up

# フォアグラウンドで起動（ログ表示）
make up-logs
```

起動後、以下のURLでアクセス可能：

| サービス | URL | ポート |
|---------|-----|--------|
| 商品登録ツール | http://localhost:3000 | 3000 |
| タグ生成システム | http://localhost:3001 | 3001 |
| オンラインカートツール | http://localhost:3002 | 3002 |
| Shopify Mock API | http://localhost:4000 | 4000 |
| PostgreSQL | localhost:5432 | 5432 |
| Redis | localhost:6379 | 6379 |
| Mailhog (UI) | http://localhost:8025 | 8025 |

### 個別サービス操作

```bash
# 特定サービスのログ確認
make logs-product     # 商品登録ツール
make logs-tag         # タグ生成
make logs-cart        # オンラインカート
make logs-mock        # Mock API

# 特定サービスの再起動
make restart-product
make restart-tag
make restart-cart

# サービス一覧確認
make ps

# 全サービス停止
make down
```

### ローカル開発（Docker不使用）

各プロジェクトを個別に起動する場合：

```bash
# ターミナル1: Mock API
cd dev-tools/shopify-mock
npm install
npm run dev

# ターミナル2: 商品登録
cd product-registration-tool
npm install
npm run dev

# ターミナル3: タグ生成
cd tag-generation-system
npm install
npm run dev

# ターミナル4: オンラインカート
cd online-cart-tool
npm install
npm run dev
```

---

## 開発ツール

### Shopify Mock Server

開発用のShopify APIモックサーバー。実際のShopify APIなしで開発可能。

```bash
# ヘルスチェック
make health

# サンプルデータ投入
make seed

# 全データリセット
make reset
```

#### Mock APIエンドポイント

| エンドポイント | メソッド | 説明 |
|---------------|---------|------|
| `/admin/api/2024-01/products.json` | POST | 商品作成 |
| `/admin/api/2024-01/products/:id.json` | GET | 商品取得 |
| `/api/2024-01/graphql.json` | POST | Storefront API (Checkout作成) |
| `/health` | GET | ヘルスチェック |
| `/dev/seed` | POST | サンプルデータ投入 |
| `/dev/reset` | POST | 全データリセット |

### データベース

開発用PostgreSQLデータベース。

```bash
# PostgreSQL接続
make db-shell

# 接続情報
# Host: localhost
# Port: 5432
# User: 85store
# Password: dev-password
# Database: 85store_dev
```

### Redis

セッション管理・キャッシュ用。

```bash
# Redis CLI接続
make redis-cli
```

### Mailhog

開発用メールサーバー。送信されたメールをWeb UIで確認可能。

- Web UI: http://localhost:8025
- SMTP: localhost:1025

---

## テスト実行

### E2Eテスト (Playwright)

```bash
# 全テスト実行
make test

# UI モードで実行
make test-ui

# デバッグモード
cd e2e-tests
npm run test:debug

# ブラウザ表示モード
npm run test:headed

# テストレポート表示
npm run report
```

### テストファイル

| ファイル | 内容 |
|---------|------|
| `01-product-registration.spec.js` | 商品登録フロー (F101-F106) |
| `02-tag-generation.spec.js` | タグ生成・印刷 (F201-F205) |
| `03-online-cart.spec.js` | オンラインカート (F301-F305) |
| `04-integration.spec.js` | 統合テスト（業務フロー全体） |

### コードジェネレーター

Playwrightのコードジェネレーターで新しいテストを簡単に作成：

```bash
cd e2e-tests
npm run codegen
```

---

## トラブルシューティング

### ポート競合

```bash
# ポート使用状況確認
lsof -i :3000
lsof -i :3001
lsof -i :3002
lsof -i :4000

# プロセス停止
kill -9 <PID>
```

### Docker関連

```bash
# コンテナ再ビルド（キャッシュクリア）
docker-compose build --no-cache

# 未使用コンテナ削除
docker system prune

# ボリューム含めて完全削除
make clean
```

### Hot Reload が効かない

Dockerボリュームマウントの問題の可能性：

```bash
# サービス再起動
make restart

# それでも直らない場合は再ビルド
make down
make build
make up
```

### Mock APIにデータが残っている

```bash
# 全データリセット
make reset
```

### PostgreSQL接続エラー

```bash
# コンテナログ確認
docker-compose logs postgres

# データベース再作成
make down
docker volume rm 85projects_postgres-data
make up
```

### E2Eテスト失敗

```bash
# サービスが起動しているか確認
make ps

# ヘルスチェック
make health

# スクリーンショット確認
ls e2e-tests/test-results/

# 詳細レポート
cd e2e-tests
npm run report
```

---

## コマンド一覧

全コマンドはMakefileに定義されています：

```bash
make help
```

主要コマンド：

```bash
make build         # Dockerイメージビルド
make up            # 全サービス起動
make down          # 全サービス停止
make logs          # 全ログ表示
make restart       # 全サービス再起動
make clean         # 完全クリーンアップ
make ps            # コンテナ一覧
make seed          # サンプルデータ投入
make reset         # データリセット
make test          # E2Eテスト実行
make health        # ヘルスチェック
```

---

## ベストプラクティス

### 開発フロー

1. **機能開発前**
   ```bash
   make up
   make seed    # サンプルデータ投入
   ```

2. **開発中**
   - ホットリロード有効（ファイル保存で自動反映）
   - `make logs-<service>` でログ確認

3. **テスト**
   ```bash
   make test
   ```

4. **開発終了**
   ```bash
   make down
   ```

### デバッグ

- **ブラウザDevTools**: 通常のWeb開発と同様
- **コンテナシェル**: `make shell-product` 等でコンテナ内に入る
- **ログ監視**: `make logs-<service>` でリアルタイムログ確認
- **Mock API**: http://localhost:4000/health でデータ状況確認

### データ管理

- **定期的にリセット**: `make reset` で開発データをクリーンな状態に
- **サンプルデータ**: `make seed` で一貫したテストデータを投入

---

## 次のステップ

1. 各プロジェクトの詳細は個別のREADMEを参照
   - `product-registration-tool/README.md`
   - `tag-generation-system/README.md`
   - `online-cart-tool/README.md`

2. システムアーキテクチャは `CLAUDE.md` を参照

3. 本番デプロイは別途ドキュメント参照
