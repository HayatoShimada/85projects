/**
 * F204: ラベルプリンタ連携
 * 紐付きタグサイズを想定したテンプレート
 */

import type { TagDesign } from './qrcode-generator'

/**
 * 印刷ジョブ送信
 * TODO: 実際のプリンタドライバ/APIと連携
 */
export async function printTag(tagDesign: TagDesign): Promise<boolean> {
  // TODO: ラベルプリンタへの実際の印刷ジョブ送信
  // - ESC/POSコマンド生成
  // - ネットワーク経由でプリンタへ送信
  // - または印刷サーバー経由

  console.log('Printing tag:', tagDesign)

  return true
}

/**
 * F205: 印刷プレビュー用HTMLテンプレート生成
 */
export function generatePreviewHTML(tagDesign: TagDesign): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: sans-serif;
          margin: 0;
          padding: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }
        .tag {
          width: 60mm;
          height: 90mm;
          border: 1px dashed #ccc;
          padding: 10mm;
          box-sizing: border-box;
          background: white;
        }
        .product-name {
          font-size: 14pt;
          font-weight: bold;
          margin-bottom: 5mm;
        }
        .price {
          font-size: 20pt;
          font-weight: bold;
          color: #d00;
          margin-bottom: 5mm;
        }
        .sku {
          font-size: 10pt;
          color: #666;
          margin-bottom: 5mm;
        }
        .qr-codes {
          display: flex;
          gap: 5mm;
          justify-content: space-between;
        }
        .qr-section {
          text-align: center;
        }
        .qr-section img {
          width: 20mm;
          height: 20mm;
        }
        .qr-label {
          font-size: 8pt;
          margin-top: 2mm;
        }
      </style>
    </head>
    <body>
      <div class="tag">
        <div class="product-name">${tagDesign.productName}</div>
        <div class="price">¥${tagDesign.price}</div>
        <div class="sku">SKU: ${tagDesign.sku}</div>
        <div class="qr-codes">
          <div class="qr-section">
            <img src="${tagDesign.posQRCode}" alt="POS QR" />
            <div class="qr-label">POS用</div>
          </div>
          <div class="qr-section">
            <img src="${tagDesign.customerQRCode}" alt="Customer QR" />
            <div class="qr-label">詳細閲覧</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}
