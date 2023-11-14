import type { Metadata } from 'next'
import '../globals.css'
import { Web3StorageLogo } from '@/components/brand'

export const metadata: Metadata = {
  title: {
    template: '%s ⁂ web3.storage',
    default: 'web3.storage ⁂ The simple file storage service for IPFS & Filecoin'
  },
  description: 'With web3.storage you get all the benefits of decentralized storage and content addressing with the frictionless experience you expect in a modern storage solution. It\’s fast, it\'s open and it\'s verifiable.',
  keywords: ['IPFS', 'UCAN', 'storage', 'web3', 'Filecoin'],
}

export default function RootLayout({children}: { children: React.ReactNode}) {
  return (
    <html lang="en" className='bg-zinc-950 text-white'>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="msapplication-TileColor" content="#3a0839" />
        <meta name="theme-color" content="#5bbad5" />
      </head>
      <body>
        {children}
        <Footer />
      </body>
    </html>
  )
}

function Footer () {
  return (
    <footer className='bg-zinc-950 text-white py-16'>
      <div className='max-w-6xl mx-auto p-8 md:flex'>
        <div className='md:w-1/2 pt-8'>
          <Web3StorageLogo>web3.storage</Web3StorageLogo>
          <p className='pt-6 pr-24 font-light text-lg'>Sign up for free using your email address.</p>
          <a className='shadow-md border bg-zinc-200 rounded-full inline-block px-4 py-2 bg-grad font-light uppercase mt-8' href='https://console.web3.storage'>Sign up</a>
        </div>
        <div className='md:w-1/4'>
          <h2 className='font-semibold pb-2 pt-16 md:pt-0'>Resources</h2>
          <nav>
            <a className='block py-2 hover:text-blue-400' href="/docs/quickstart">Quickstart guide</a>
            <a className='block py-2 hover:text-blue-400' href="/faq">FAQ</a>
            <a className='block py-2 hover:text-blue-400' href="/contact">Contact us</a>
            <a className='block py-2 hover:text-blue-400' href="/docs/terms">Terms of use</a>
            <a className='block py-2 hover:text-blue-400' href="/docs/privacy">Privacy Policy</a>
            <a className='block py-2 hover:text-blue-400' href="https://status.web3.storage/">Status</a>
          </nav>
        </div>
        <div className='md:w-1/4'>
          <h2 className='font-semibold pb-2 pt-8 md:pt-0'>Get started</h2>
          <nav>
            <a className='block py-2 hover:text-blue-400' href="https://github.com/web3-storage/w3up/tree/main/packages/w3up-client#readme">Javascript client</a>
            <a className='block py-2 hover:text-blue-400' href="/docs/w3cli">CLI</a>
            <a className='block py-2 hover:text-blue-400' href="https://console.web3.storage">Web UI</a>
            <a className='block py-2 hover:text-blue-400' href="https://github.com/web3-storage/web3.storage/issues/new/choose">Open an issue</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
