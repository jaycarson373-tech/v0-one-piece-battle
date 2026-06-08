import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Geist, Geist_Mono, Baloo_2, Anton } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const baloo = Baloo_2({
  variable: '--font-baloo',
  subsets: ['latin'],
  weight: ['600', '700', '800'],
})
const anton = Anton({
  variable: '--font-anton',
  subsets: ['latin'],
  weight: ['400'],
})

export const metadata: Metadata = {
  title: 'King of the Pirates — Live Solana pirate duel arena & treasury card vault.',
  description:
    'Enter $10 pirate duels, prove the randomness in the Proof Terminal, and watch treasury fees turn into real graded card airdrops for holders.',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${baloo.variable} ${anton.variable} bg-background`}>
      <body className="font-sans antialiased">{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body>
    </html>
  )
}
