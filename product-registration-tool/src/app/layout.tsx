import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '商品登録ツール',
  description: 'Shopify商品登録/編集システム',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
