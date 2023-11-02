import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'web3 storage',
  description: 'The simple file storage service for IPFS & Filecoin',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className='bg-zinc-950 text-white'>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
