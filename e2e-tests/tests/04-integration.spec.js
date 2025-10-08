/**
 * E2E Test: 統合テスト（業務フロー全体）
 *
 * テストシナリオ:
 * Stage 1: 入荷・商品準備
 * Stage 2: 店舗販売・決済
 * Stage 3: 在庫確認
 */

const { test, expect } = require('@playwright/test')

test.describe('業務フロー統合テスト', () => {
  test('完全業務フロー: 商品登録 → タグ生成 → 店頭販売', async ({ page, context }) => {
    // データリセット
    await fetch('http://localhost:4000/dev/reset', { method: 'POST' })

    // ========== Stage 1: 入荷・商品準備 ==========

    // 1. 商品登録
    await page.goto('http://localhost:3000')

    await page.fill('[name="title"]', 'テスト古着ジャケット')
    await page.fill('[name="price"]', '9800')
    await page.check('[name="isVintage"]')
    await page.fill('[name="measurements.shoulder"]', '46cm')
    await page.fill('[name="measurements.chest"]', '56cm')

    await page.click('button[type="submit"]')

    await expect(page.locator('.success-message')).toBeVisible()

    // 生成されたSKUを取得
    const sku = await page.locator('[data-testid="generated-sku"]').textContent()

    // 2. タグ生成システムへ遷移
    await page.click('a:has-text("タグを生成")')

    // URLが変わることを確認
    await expect(page).toHaveURL(/localhost:3001/)

    // SKUがクエリパラメータに含まれることを確認
    await expect(page).toHaveURL(new RegExp(`sku=${sku}`))

    // QRコード生成確認
    await expect(page.locator('.qr-code.pos')).toBeVisible()
    await expect(page.locator('.qr-code.customer')).toBeVisible()

    // 印刷プレビュー
    await page.click('button:has-text("プレビュー")')
    await expect(page.locator('.tag-preview')).toBeVisible()

    // 印刷実行
    await page.click('button:has-text("印刷")')
    await expect(page.locator('.print-status')).toContainText('成功')

    // ========== Stage 2: 店舗販売・決済 ==========

    // 3. 顧客がQRコードスキャン（商品詳細閲覧）
    const customerQRUrl = await page.getAttribute('.qr-code.customer', 'data-url')

    const customerPage = await context.newPage()
    await customerPage.goto(customerQRUrl)

    // 商品詳細ページで採寸データ等を確認
    await expect(customerPage.locator('.measurements')).toBeVisible()
    await expect(customerPage.locator('.measurements')).toContainText('46cm')

    await customerPage.close()

    // 4. スタッフがPOSで商品スキャン → カード決済選択 → オンラインカート生成
    const staffPage = await context.newPage()
    await staffPage.goto('http://localhost:3002')

    // POSカート取得（商品がスキャンされた状態をシミュレート）
    await staffPage.evaluate((testSku) => {
      window.mockCart = [{ sku: testSku, quantity: 1 }]
    }, sku)

    await staffPage.click('button:has-text("POSカート取得")')

    // カートに商品が表示される
    await expect(staffPage.locator('.cart-items')).toContainText(sku)

    // チェックアウトURL生成
    await staffPage.click('button:has-text("チェックアウト生成")')

    // QRコード表示
    const checkoutQR = staffPage.locator('.checkout-qr-code')
    await expect(checkoutQR).toBeVisible()

    const checkoutUrl = await staffPage.getAttribute('.checkout-qr-code', 'data-url')

    // 5. 顧客がスマホでQRスキャン → 決済
    const customerPaymentPage = await context.newPage()
    await customerPaymentPage.goto(checkoutUrl)

    await customerPaymentPage.fill('[name="email"]', 'test@example.com')
    await customerPaymentPage.fill('[name="card_number"]', '4242424242424242')
    await customerPaymentPage.click('button:has-text("支払う")')

    // 決済完了
    await expect(customerPaymentPage.locator('.order-confirmation')).toBeVisible()

    // 6. スタッフ側に通知
    await staffPage.waitForSelector('.order-completed-notification')

    await expect(staffPage.locator('.order-completed-notification')).toBeVisible()
    await expect(staffPage.locator('.pos-recording-guide')).toBeVisible()

    // ========== Stage 3: 在庫確認 ==========

    // 7. Mock APIで在庫が減っていることを確認
    const response = await fetch(`http://localhost:4000/admin/api/2024-01/products.json`)
    const data = await response.json()

    const product = data.products.find(p => p.variants[0].sku === sku)
    expect(product.variants[0].inventory_quantity).toBe(0)

    console.log('✅ 完全業務フローテスト成功!')
  })
})
