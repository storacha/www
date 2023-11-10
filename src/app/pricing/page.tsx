import Tick from '@/../public/images/pricing/circle-check.svg'
import { ButtonLink, Header } from "@/components/nav"
import Image from 'next/image'
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

type PlanCardProps = {
  name: string
  price: string
  storage: string
  egress?: string
  storageExcess: string
  egressExcess?: string
  banner?: string
}

function PlanCard ({ name, price, storage, egress = storage, storageExcess, egressExcess = storageExcess, banner }: PlanCardProps) {
  return (
    <div className=' bg-white/30 rounded-lg shadow-md border-white/10 overflow-hidden'>
      {banner ? <p className="bg-grad-2 text-white font-bold px-3 py-2">{banner}</p> : null}
      <div className="px-6 py-8">
        <h2 className="font-semibold text-3xl flex">
          <span className="flex-auto">{name}</span>
          <span className="font-bold">{price}<span className="text-zinc-500 font-normal">/mo</span></span>
        </h2>
        <div className="flex items-start pt-8">
          <Image src={Tick} alt='yep' className='pt-1'/>
          <div className='pl-4'>
            <p className="font-semibold text-lg">{storage} storage</p>
            <p className="text-sm">Additional at {storageExcess} per month</p>
          </div>
        </div>
        <div className="flex items-start pt-4">
          <Image src={Tick} alt='yep' className='pt-1'/>
          <div className='pl-4'>
            <p className="font-semibold text-lg">{egress} egress per month</p>
            <p className="text-sm">Additional at {egressExcess} per month</p>
          </div>
        </div>
        <p className="text-2xl font-bold text-center pt-16 pb-6">{storage}</p>
        <p className='text-center'>
          <ButtonLink href='https://console.web3.storage'>Get started</ButtonLink>
        </p>
      </div>
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
        <section className='max-w-6xl mx-auto pt-20 md:pt-28 px-3 pb-20'>
          <div className="flex text-zinc-950 gap-7 items-end">
            <div className='w-1/3'>
              <PlanCard name='Free' price='$0' storage='5GB' storageExcess='$0.15/GB' />
            </div>
            <div className='w-1/3'>
              <PlanCard name='Lite' price='$10' storage='100GB' storageExcess='$0.05/GB' />
            </div>
            <div className='w-1/3'>
              <PlanCard name='Business' price='$100' storage='2TB' storageExcess='$0.03/GB' banner='Cheapest per GB' />
            </div>
          </div>
          {/* <div className='mt-8 bg-white/30 rounded-lg shadow-md border-white/10 overflow-hidden text-zinc-950'>
            <div className="px-6 py-8">
              <h2 className="font-semibold text-3xl">Custom</h2>
              <p className='pt-4'>
                Looking for way more? Anticipate having a complex integration? Just tell us more about what you're building and we can figure it out.
              </p>
            </div>
          </div> */}
        </section>
        <section>
          <div className="max-w-6xl mx-auto pt-12 px-3">
            <h2 className="font-semibold text-xl text-zinc-950/40">TRUSTED BY</h2>
          </div>
          <Logos urls={logos} />
        </section>
      </div>
    </div>
  )
}
