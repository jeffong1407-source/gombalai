import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GombalAI — Jago Chat, Jago Dapetin Hati',
  description: 'Bingung mau bales apa? Biar AI yang aturin.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
