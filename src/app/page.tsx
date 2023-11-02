import { PropsWithChildren } from 'react'
import { Web3StorageLogo } from '@/components/brand'
import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <section className='pb-36 relative grad-alt one-corn'>
        <div className='grad'></div>
        <header className='container mx-auto pt-10'>
          <div className='flex items-center'>
            <div className='flex-1'>
              <Web3StorageLogo>web3.storage</Web3StorageLogo>
            </div>
            <nav>
              <NavLink href='/features'>Features</NavLink>
              <NavLink href='/pricing'>Pricing</NavLink>
              <NavLink href='/faq'>FAQ</NavLink>
              <NavLink href='/blog'>Blog</NavLink>
              <NavLink href='/docs'>Docs</NavLink>
              <ButtonLink href='https://console.web3.storage'>CONSOLE</ButtonLink>
            </nav>
          </div> 
        </header>
        <div className='max-w-7xl mx-auto pt-60 flex justify-items-stretch items-start'>
          <div className='basis-1/2'>
            <p className='text-7xl text-white font-medium'>Say hello to <br/>the data layer.</p>
            <p className='pt-12'>
              <ButtonLink href='/start'>Start now</ButtonLink>
              <ButtonLink href='/faq'>What&apos;s the data layer?</ButtonLink>
            </p>
          </div>
          <div className='basis-1/2 text-2xl text-white'>
            <p>
              Use decentralized protocols like IPFS and UCAN to liberate your data using our easy-to-use developer platform.</p>
            <p className='pt-4'>We&apos;ll take care of the rest.</p>
          </div>
        </div>
      </section>
      <section className='bg-zinc-950 text-white pt-20 pb-20 leading-loose one-corn'>
        <div className='max-w-7xl mx-auto flex gap-8'>
          <div className='w-1/2 pl-2 pr-26'>
            <h2 className='font-bold text-2xl pb-8'>Connecting the web of data</h2>
            <p>Eliminate silos with web3.storage. Using IPFS and other decentralized protocols, create a true data layer that connects you, your users, and the Web, regardless of where content is stored - client-side, in the cloud, or elsewhere.</p>
            <p>Sounds hard? It isn’t. Our client libraries are super easy-to-use, abstracting the complexity of these decentralized protocols. And our hosted object storage provides best-in-class IPFS write and read performance and competitive pricing to web2 solutions, giving you the ability to write innovative applications without compromise.</p>
          </div>
        </div>
      </section>
      <section className='bg-blue-400 text-zinc-950 py-36 px-2 leading-loose grad-alt one-corn-top'>
        <div className='bg-zinc-100/80 shadow-md rounded-md max-w-7xl mx-auto px-8 pt-8 pb-16'>
          <h2 className='font-bold text-3xl pb-8'>web3.storage is built for scale</h2>
          <div className='flex'>
            <div className='w-1/2 text-center'>
              <h3 className='text-6xl font-bold'>
              <span className='grad-text'>200K+</span>
              <span className='block text-lg'>USERS</span></h3>
            </div>
            <div className='w-1/2 text-center'>
              <h3 className='text-6xl font-bold'>
              <span className='grad-text'>200M+</span>
              <span className='block text-lg'>STORED OBJECTS</span></h3>
            </div>
          </div>
          <div className='lg:flex pt-28 gap-8'>
            <div className='lg:w-1/2'>
              <h2 className='font-bold text-3xl pb-2'>Why web3.storage?</h2>
              <p>With web3.storage you get all the benefits of decentralized storage and other cutting-edge protocols with the frictionless experience you expect in a modern dev workflow. Check out our docs pages to learn more.</p>
              <p className='pt-4'>Sounds hard? It isn’t. Our client libraries are super easy-to-use, abstracting the complexity of these decentralized protocols. And our hosted object storage provides best-in-class IPFS write and read performance and competitive pricing to web2 solutions, giving you the ability to write innovative applications without compromise.</p>
              <p className='pt-4'><ButtonLink href='/docs'>Read docs</ButtonLink></p>
            </div>
            <div className='lg:w-1/2'>
              <h3 className='pt-12 lg:pt-0'><span className='text-2xl font-bold grad-text'>Open</span></h3>
              <p>All data is accessible via IPFS and backed by Filecoin storage, with service authentication using decentralized identity. No servers needed, no lock-in, no trust necessary.</p>
              <h3 className='pt-4'><span className='text-2xl font-bold grad-text'>Reliable</span></h3>
              <p>We take the best of web2 and web3 to provide infra you can rely on to scale with you. Frustration with decentralized storage is a thing of the past.</p>
              <h3 className='pt-4'><span className='text-2xl font-bold grad-text'>Simple</span></h3>
              <p>Start storing in minutes using w3up, our simple client library, to see how decentralized protocols can work together to unlock your data layer.</p>
            </div>
          </div>
        </div>
      </section>
      <section className='bg-zinc-100 text-zinc-950 pt-20 pb-20 leading-loose'>
        <div className='max-w-7xl mx-auto p-8'>
          <div className='max-w-lg'>
            <h2 className='font-bold text-4xl'>Get started with web3.storage</h2>
            <p className='pt-2 text-xl font-light'>Choose your own way to store and retrieve using Web3.Storage. Use your email address or GitHub to get x GiB storage for free, with paid plans starting at $10.</p>
            <p className='pt-4'><ButtonLink href='/start'>Create an account</ButtonLink></p>
            <p className='pt-4'>Sounds hard? It isn’t. Our client libraries are super easy-to-use, abstracting the complexity of these decentralized protocols. And our hosted object storage provides best-in-class IPFS write and read performance and competitive pricing to web2 solutions, giving you the ability to write innovative applications without compromise.</p>
          </div>
        </div>
      </section>
      <footer className='bg-zinc-950'>
        <p className='text-xl text-white text-center py-8'>⁂</p>
      </footer>
    </main>
  )
}

export function NavLink ({href, children}: {href:string, children: React.ReactNode}) {
  return <Link href={href} className='uppercase font-medium text-xl p-2 mx-2'>{children}</Link>
}

export function ButtonLink ({href, children}: {href:string, children: React.ReactNode}) {
  return (
    <Link className='bg-zinc-950 text-white font-bold text-lg px-8 py-2 rounded-full ml-4 whitespace-nowrap' href={href}>
      {children}
    </Link>
  )
}
