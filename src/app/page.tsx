import Image from 'next/image'
import ImageIconCluster from '@/../public/images/index/cluster-1.png'
import { W3UPClientExample } from '@/components/code'
import { NavLink, ButtonLink, Header } from '@/components/nav'

export default function HomePage () {
  return (
    <main>
      <section className='md:pb-48 bg-grad md:one-corn'>
        <Header />
        <div className='max-w-6xl mx-auto pt-20 md:pt-28 md:flex justify-items-stretch items-start'>
          <div className='basis-1/2 text-left md:text-left px-3'>
            <p className='text-5xl md:text-7xl text-white font-medium'>Say <span className=''>hello</span> to <br/>the <span className='underline  font-bold'>data layer</span></p>
            <p className='pt-12 text-center md:text-left'>
              <ButtonLink href='https://console.web3.storage'>Start now</ButtonLink>
              <ButtonLink href='/docs/faq' className='hidden sm:inline-block ml-6'>What&apos;s the data layer?</ButtonLink>
            </p>
          </div>
          <div className='basis-1/2 text-2xl text-white pt-12 md:pt-0 px-3'>
            <p>
              Use decentralized protocols like <abbr className='font-semibold'>IPFS</abbr> and <abbr className='font-semibold'>UCAN</abbr> to liberate your data.</p>
            <p className='pt-4'>We&apos;ll take care of the rest.</p>
          </div>
        </div>
        <nav className='md:hidden border-b-4 border-zinc-100 bg-zinc-100/10 md:bg-transparent mt-16 md:mt-0 text-center md:text-left text-blue-950'>
          <NavLink href='/products/web3storage'>Features</NavLink>
          <NavLink href='/docs'>Docs</NavLink>
          <NavLink href='/pricing'>Pricing</NavLink>
        </nav>
      </section>
      <section className='bg-zinc-950 text-white pt-20 pb-20 leading-loose md:one-corn'>
        <div className='max-w-6xl mx-auto lg:flex px-3 gap-8'>
          <div className='lg:w-1/2'>
            <h2 className='font-bold text-2xl pb-8'>Connecting the web of data</h2>
            <p>Eliminate silos with web3.storage. Using IPFS and other decentralized protocols, create a true data layer that connects you, your users, and the Web, regardless of where content is stored - client-side, in the cloud, or elsewhere.</p>
            <p className='pt-4'>Sounds hard? It isn&apos;t. Our client libraries are super easy-to-use, abstracting the complexity of these decentralized protocols. And our hosted object storage provides best-in-class IPFS write and read performance and competitive pricing to web2 solutions, giving you the ability to write innovative applications without compromise.</p>
          </div>
          <div className='pt-8 lg:pt-0 lg:w-1/2'>
            <W3UPClientExample />
          </div>
        </div>
      </section>
      <section className='bg-blue-400 text-zinc-950 py-36 px-2 leading-loose bg-grad one-corn-top'>
        <div className='bg-zinc-100/80 shadow-md rounded-md max-w-6xl mx-auto px-8 pt-8 pb-16'>
          <h2 className='font-bold text-3xl pb-8'>web3.storage is built for scale</h2>
          <div className='md:flex'>
            <div className='md:w-1/2 text-center pt-8'>
              <h3 className='text-6xl font-bold'>
              <span className='text-grad'>200K+</span>
              <span className='block text-lg'>USERS</span></h3>
            </div>
            <div className='md:w-1/2 text-center pt-8'>
              <h3 className='text-6xl font-bold'>
              <span className='text-grad'>200M+</span>
              <span className='block text-lg'>STORED OBJECTS</span></h3>
            </div>
          </div>
          <div className='lg:flex pt-20 gap-8'>
            <div className='lg:w-1/2'>
              <h2 className='font-bold text-3xl pb-2'>Why web3.storage?</h2>
              <p>With web3.storage you get all the benefits of decentralized storage and other cutting-edge protocols with the frictionless experience you expect in a modern dev workflow. Check out our docs pages to learn more.</p>
              <p className='pt-4'><ButtonLink href='/docs'>Read docs</ButtonLink></p>
            </div>
            <div className='lg:w-1/2'>
              <h3 className='pt-12 lg:pt-0'><span className='text-2xl font-bold text-grad'>Open</span></h3>
              <p>All data is accessible via IPFS and backed by Filecoin storage, with service authentication using decentralized identity. No servers needed, no lock-in, no trust necessary.</p>
              <h3 className='pt-4'><span className='text-2xl font-bold text-grad'>Reliable</span></h3>
              <p>We take the best of web2 and web3 to provide infra you can rely on to scale with you. Frustration with decentralized storage is a thing of the past.</p>
              <h3 className='pt-4'><span className='text-2xl font-bold text-grad'>Simple</span></h3>
              <p>Start storing in minutes using w3up, our simple client library, to see how decentralized protocols can work together to unlock your data layer.</p>
            </div>
          </div>
        </div>
      </section>
      <section className='bg-zinc-100 text-zinc-950 pt-20 pb-20'>
        <div className='max-w-6xl mx-auto p-8 lg:flex items-center justify-items-stretch'>
          <div className='max-w-lg'>
            <h2 className='font-bold text-4xl leading-relaxed'>Get started with web3.storage</h2>
            <p className='pt-8 text-xl font-light leading-loose'>Choose your own way to store and retrieve using Web3.Storage. Use your email address to get 5 GiB storage for free, with paid plans starting at $10.</p>
            <p className='pt-8'><ButtonLink href='https://console.web3.storage'>Create an account</ButtonLink></p>
          </div>
          <div className='text-center flex-auto'>
            <Image alt="Cluster of logos for the technologies that make web3.storage work" src={ImageIconCluster} className='hidden lg:inline-block lg:w-full lg:max-w-md opacity-80' />
          </div>
        </div>
        <div className='md:flex gap-8 max-w-6xl mx-auto'>
          <div className='md:w-1/3 p-6'>
            <h3 className='font-bold text-2xl'>JS Client</h3>
            <a href='https://github.com/web3-storage/w3up/tree/main/packages/w3up-client#readme'>
              <code className='shadow-md block text-sm p-4 rounded-md font-bold mt-2 mb-4 bg-white'>
                <span className='text-grad'>$ npm i @web3-storage/w3up-client</span>
              </code>
            </a>
            <p className='px-4 font-light'>Import the library into your project, and enjoy a simple and familiar way to store and retrieve.</p>
          </div>
          <div className='md:w-1/3 p-6'>
            <h3 className='font-bold text-2xl'>Command Line</h3>
            <a href='https://github.com/web3-storage/w3cli'>
              <code className='shadow-md block text-sm p-4 rounded-md font-bold mt-2 mb-4 bg-white'>
                <span className='text-grad'>$ w3 up ./anything</span>
              </code>
            </a>
            <p className='px-4 font-light'>Install <a className='text-blue-400 font-medium' href='https://github.com/web3-storage/w3cli'>w3cli</a> to store data from your command line for the fastest way to programmatically upload data.</p>
          </div>
          <div className='md:w-1/3 p-6'>
          <h3 className='font-bold text-2xl'>Web App</h3>
            <a href='https://console.web3.storage'>
              <span className='shadow-sm hover:shadow-md block text-sm p-4 rounded-md bg-white mt-2 mb-4 border-dashed border-2 border-zinc-300 text-center font-bold'>
                <span className='text-grad'>Drop file to upload</span>
              </span>
            </a>
            <p className='px-4 font-light'>Keep it simple? Upload your files directly through the <a className='font-semibold text-blue-400' href='https://console.web3.storage' >console</a> Web UI to try out web3.storage now.</p>
          </div>
        </div>
      </section>

    </main>
  )
}
