/**
 * E2E Test: タグ生成・印刷フロー (F201-F205)
 *
 * テストシナリオ:
 * 1. 商品IDを指定してタグ生成ページを開く
 * 2. QRコードが生成されることを確認
 * 3. 印刷プレビューを表示
 * 4. タグデザインの要素を確認
 */

const { test, expect } = require('@playwright/test')

test.describe('タグ生成・印刷フロー (F201-F205)', () => {
  test.beforeEach(async ({ page }) => {
    // Mock APIにサンプルデータ投入
    await fetch('http://localhost:4000/dev/seed', { method: 'POST' })
  })

  test('古着商品のタグ生成', async ({ page }) => {
    // F201: 商品データ取得
    await page.goto('http://localhost:3001?sku=VTG-1001-ABC')

    // 商品情報表示確認
    await expect(page.locator('.product-title')).toContainText('ヴィンテージデニムジャケット')
    await expect(page.locator('.product-price')).toContainText('8900')
    await expect(page.locator('.product-sku')).toContainText('VTG-1001-ABC')

    // F202: QRコード生成確認
    const posQR = page.locator('.qr-code.pos')
    await expect(posQR).toBeVisible()

    const customerQR = page.locator('.qr-code.customer')
    await expect(customerQR).toBeVisible()

    // F205: 印刷プレビュー
    await page.click('button:has-text("プレビュー")')

    const preview = page.locator('.tag-preview')
    await expect(preview).toBeVisible()

    // F203: タグデザイン要素確認
    await expect(preview.locator('.product-name')).toBeVisible()
    await expect(preview.locator('.price')).toBeVisible()
    await expect(preview.locator('.sku')).toBeVisible()
    await expect(preview.locator('.qr-codes')).toBeVisible()
  })

  test('印刷ボタンクリック', async ({ page }) => {
    await page.goto('http://localhost:3001?sku=VTG-1001-ABC')

    // F204: 印刷実行
    const printButton = page.locator('button:has-text("印刷")')
    await expect(printButton).toBeVisible()

    await printButton.click()

    // 印刷ジョブ送信確認
    await expect(page.locator('.print-status')).toContainText('印刷ジョブを送信しました')
  })

  test('QRコードスキャンシミュレーション', async ({ page, context }) => {
    await page.goto('http://localhost:3001?sku=VTG-1001-ABC')

    // 顧客閲覧用QRコードのURLを取得
    const customerQRUrl = await page.getAttribute('.qr-code.customer', 'data-url')

    // 新しいタブで商品詳細ページを開く（QRスキャンをシミュレート）
    const newPage = await context.newPage()
    await newPage.goto(customerQRUrl)

    // 商品詳細ページが表示されることを確認
    await expect(newPage.locator('h1')).toContainText('ヴィンテージデニムジャケット')
  })
})
