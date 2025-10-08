import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'タグ生成システム',
  description: '自動タグ生成・印刷システム',
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
