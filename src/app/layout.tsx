import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Noto_Serif_JP } from 'next/font/google'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Hachi_Maru_Pop } from 'next/font/google'

import '@/app/globals.css'
import { Providers } from './providers'

const hachiMaruPop = Hachi_Maru_Pop({ variable: '--font-hachi-maru-pop', subsets: ['latin'], weight: "400"})
const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })
const notoSerifJP = Noto_Serif_JP({
  subsets: ['latin'],
  variable: '--font-noto-serif-jp',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'TangoDojo',
  description: 'Dein Vokabeltrainer für Japanisch',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
  <html lang="de" className={`${hachiMaruPop.variable} ${geistSans.variable} ${geistMono.variable} ${notoSerifJP.variable} antialiased`}>
    <body>
    <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
        </div>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
