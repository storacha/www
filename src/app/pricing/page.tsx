import { Header } from "@/components/nav"
import { Metadata } from "next"
import fs from 'node:fs/promises'
import path from 'node:path'

export const metadata: Metadata = {
  title: 'Pricing'
}

async function findLogoUrls () {
  const dir = path.join(process.cwd(), '/public/images/pricing/logos')
  const files = await fs.readdir(dir)
  return files.map(file => `/images/pricing/logos/${file}`)
}

function logoAlt (url: string) {
  const name = path.basename(url, path.extname(url))
  return `${name}`
}

function Logos ({ urls = [] }: { urls: string[] }) {
  return (
    <div className="overflow-x-auto whitespace-nowrap">
      { urls.map(src => <LogoCard src={src} key={src} /> )}
    </div>
  )
}

function LogoCard ({src}: {src: string}) {
  return (
    <div className="align-middle m-4 p-3 inline-block opacity-80 hover:opacity-90">
      <img alt={logoAlt(src)} src={src} key={src} width='150' />
    </div>
  )
}

export default async function PricingPage () {
  const logos = await findLogoUrls()
  return (
    <div>
      <div className="bg-grad">
        <Header />
        <section className='max-w-6xl mx-auto pt-20 md:pt-28 px-3'>
          <h1 className="font-bold text-4xl text-zinc-900">As much as you need, verifiably</h1>
          <p className="pt-12 max-w-3xl text-xl text-zinc-900">web3.storage is designed for scale and simplicity. Utilize our elastic, hosted data platform that integrates decentralized data and authentication protocols. No need to worry about performance or reliability.</p>
        </section>
        <section>
          <div className="max-w-6xl mx-auto pt-12 px-3">
            <h2 className="font-semibold text-xl text-zinc-950/40">TRUSTED BY</h2>
          </div>
          <Logos urls={logos} />
        </section>
        {/* <section className='max-w-6xl mx-auto pt-20 md:pt-28 px-3'>
          <div className="flex">
            <div className='w-1/3 bg-zinc-200/60 rounded-md'>
              Free
            </div>
            <div className='w-1/3'>Lite</div>
            <div className='w-1/3'>Pro</div>
          </div>
        </section> */}
      </div>
    </div>
  )
}
