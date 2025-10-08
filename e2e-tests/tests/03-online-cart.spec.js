/**
 * E2E Test: オンラインカート生成フロー (F301-F305)
 *
 * テストシナリオ:
 * 1. POSカート情報を取得
 * 2. チェックアウトURLを生成
 * 3. QRコードを表示
 * 4. 決済完了通知を受信
 * 5. POS記録ガイドを表示
 */

const { test, expect } = require('@playwright/test')

test.describe('オンラインカート生成フロー (F301-F305)', () => {
  test.beforeEach(async ({ page }) => {
    await fetch('http://localhost:4000/dev/seed', { method: 'POST' })
  })

  test('カード決済代替フロー（完全フロー）', async ({ page, context }) => {
    // F301: POSカート情報取得画面
    await page.goto('http://localhost:3002')

    await page.click('button:has-text("POSカート取得")')

    // カート内容表示
    await expect(page.locator('.cart-items')).toBeVisible()

    // F302: チェックアウトURL生成
    await page.click('button:has-text("チェックアウト生成")')

    // F303: QRコード表示
    const qrCode = page.locator('.checkout-qr-code')
    await expect(qrCode).toBeVisible()

    const checkoutUrl = await page.getAttribute('.checkout-qr-code', 'data-url')
    expect(checkoutUrl).toContain('checkouts')

    // 顧客側: チェックアウトページにアクセス（QRスキャンをシミュレート）
    const customerPage = await context.newPage()
    await customerPage.goto(checkoutUrl)

    // 決済情報入力（モック）
    await customerPage.fill('[name="email"]', 'customer@example.com')
    await customerPage.fill('[name="card_number"]', '4242424242424242')
    await customerPage.click('button:has-text("支払う")')

    // F304: スタッフ側に注文完了通知が届く
    await page.waitForSelector('.order-completed-notification', { timeout: 10000 })

    const notification = page.locator('.order-completed-notification')
    await expect(notification).toBeVisible()
    await expect(notification).toContainText('注文完了')

    // F305: POS記録ガイド表示
    const guide = page.locator('.pos-recording-guide')
    await expect(guide).toBeVisible()
    await expect(guide).toContainText('Shopify POS')
    await expect(guide).toContainText('オンラインカード決済(店頭注文)')
  })

  test('複数商品のカート処理', async ({ page }) => {
    await page.goto('http://localhost:3002')

    // 複数商品をカートに追加（モック）
    await page.evaluate(() => {
      window.mockCart = [
        { sku: 'VTG-1001-ABC', quantity: 1 },
        { sku: 'NEW-TS-WHT-M', quantity: 2 }
      ]
    })

    await page.click('button:has-text("POSカート取得")')

    // 商品数確認
    const cartItems = page.locator('.cart-item')
    await expect(cartItems).toHaveCount(2)

    // チェックアウト生成
    await page.click('button:has-text("チェックアウト生成")')

    await expect(page.locator('.checkout-qr-code')).toBeVisible()
  })

  test('セッションタイムアウト処理', async ({ page }) => {
    await page.goto('http://localhost:3002')

    await page.click('button:has-text("POSカート取得")')
    await page.click('button:has-text("チェックアウト生成")')

    // 10分待機（セッションタイムアウト）
    await page.waitForTimeout(10 * 60 * 1000)

    // タイムアウトメッセージ表示
    await expect(page.locator('.timeout-message')).toBeVisible()
  })
})
