/**
 * E2E Test: 商品登録フロー (F101-F106)
 *
 * テストシナリオ:
 * 1. 商品登録ページを開く
 * 2. 古着（一点物）の情報を入力
 * 3. SKUが自動生成されることを確認
 * 4. 商品登録を実行
 * 5. タグ生成システムへの遷移ボタンが表示されることを確認
 */

const { test, expect } = require('@playwright/test')

test.describe('商品登録フロー (F101-F106)', () => {
  test.beforeEach(async ({ page }) => {
    // Mock APIのリセット
    await fetch('http://localhost:4000/dev/reset', { method: 'POST' })

    await page.goto('http://localhost:3000')
  })

  test('古着（一点物）の商品登録', async ({ page }) => {
    // F101: 商品情報入力フォーム
    await page.fill('[name="title"]', 'ヴィンテージデニムジャケット')
    await page.fill('[name="price"]', '8900')
    await page.selectOption('[name="category"]', 'アウター')

    // 古着フラグをON
    await page.check('[name="isVintage"]')

    // 採寸データ入力
    await page.fill('[name="measurements.shoulder"]', '45cm')
    await page.fill('[name="measurements.chest"]', '55cm')
    await page.fill('[name="measurements.sleeve"]', '60cm')
    await page.fill('[name="measurements.length"]', '65cm')

    await page.fill('[name="material"]', 'コットン100%')
    await page.fill('[name="origin"]', 'USA')

    // F102: SKU自動生成確認（VTGプレフィックス）
    const skuField = page.locator('[name="sku"]')
    await expect(skuField).toHaveValue(/^VTG-/)

    // F105: 登録実行
    await page.click('button[type="submit"]')

    // 成功メッセージ
    await expect(page.locator('.success-message')).toBeVisible()

    // F106: タグ生成システムへの遷移ボタン
    const tagSystemButton = page.locator('a[href*="localhost:3001"]')
    await expect(tagSystemButton).toBeVisible()
    await expect(tagSystemButton).toContainText('タグを生成')
  })

  test('新品（複数在庫）の商品登録', async ({ page }) => {
    await page.fill('[name="title"]', 'ベーシックTシャツ')
    await page.fill('[name="price"]', '2900')

    // 古着フラグをOFF
    await page.uncheck('[name="isVintage"]')

    // サイズ・カラー選択
    await page.selectOption('[name="size"]', 'M')
    await page.selectOption('[name="color"]', 'ホワイト')
    await page.fill('[name="stock"]', '10')

    // F102: SKU自動生成確認（NEWプレフィックス）
    const skuField = page.locator('[name="sku"]')
    await expect(skuField).toHaveValue(/^NEW-/)

    // 登録実行
    await page.click('button[type="submit"]')

    await expect(page.locator('.success-message')).toBeVisible()
  })

  test('必須項目バリデーション', async ({ page }) => {
    // 何も入力せずに送信
    await page.click('button[type="submit"]')

    // エラーメッセージ表示
    await expect(page.locator('.error-message')).toBeVisible()
  })
})
