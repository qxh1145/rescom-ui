import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans, Kalam, Patrick_Hand } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin", "vietnamese"],
  variable: '--font-inter',
  display: 'swap',
})

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin", "vietnamese"],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

const kalam = Kalam({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-kalam',
  display: 'swap',
})

const patrickHand = Patrick_Hand({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-patrick-hand',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Rescom - Khảo sát & Kiếm điểm',
  description: 'Nền tảng micro-task cho sinh viên Việt Nam. Kiếm điểm từ khảo sát hoặc tìm người trả lời khảo sát của bạn.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#1e293b' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={`${inter.variable} ${plusJakarta.variable} ${kalam.variable} ${patrickHand.variable}`}>
      <body className="font-sans antialiased bg-background">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
