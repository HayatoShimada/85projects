-- 85store開発用データベース初期化スクリプト

-- 商品ログテーブル（デバッグ用）
CREATE TABLE IF NOT EXISTS product_logs (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(255),
    sku VARCHAR(255),
    title TEXT,
    action VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 印刷ジョブログ（F204デバッグ用）
CREATE TABLE IF NOT EXISTS print_jobs (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(255),
    sku VARCHAR(255),
    status VARCHAR(50),
    qr_code_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- チェックアウトセッション（F301-F305デバッグ用）
CREATE TABLE IF NOT EXISTS checkout_sessions (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) UNIQUE,
    cart_items JSONB,
    checkout_url TEXT,
    qr_code TEXT,
    order_id VARCHAR(255),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_product_logs_sku ON product_logs(sku);
CREATE INDEX IF NOT EXISTS idx_print_jobs_sku ON print_jobs(sku);
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_session_id ON checkout_sessions(session_id);

-- サンプルデータ投入
INSERT INTO product_logs (product_id, sku, title, action)
VALUES
    ('1001', 'VTG-TEST-001', 'サンプル古着ジャケット', 'created'),
    ('1002', 'NEW-TEST-001', 'サンプル新品Tシャツ', 'created');

-- 完了メッセージ
DO $$
BEGIN
    RAISE NOTICE '✅ Database initialized successfully';
END $$;
