import { Header } from "@/components/nav"
import { Metadata } from "next"
import Image from "next/image"
import Ring from '@/../public/images/illustrations/ring.png'

export const metadata: Metadata = {
  title: 'Features'
}

export default async function FeaturesPage () {
  return (
    <div>
      <div className="bg-grad">
        <Header />
        <section className='max-w-6xl mx-auto pt-20 md:pt-28 px-3 pb-8'>
          <div className="md:flex flex-row-reverse">
            <div className="md:w-2/3">
              <h1 className="font-bold text-4xl text-zinc-950">What is web3.storage</h1>
              <p className="leading-relaxed pt-8 max-w-3xl text-xl text-zinc-950">At the core of web3.storage is a storage service to safely secure and make your data available - giving developers the power of decentralized storage and content addressing via simple client libraries or an HTTP API.</p>
            </div>
            <div className="hidden md:block w-1/3">
              <Image src={Ring} alt='Ring' className="rotate-45" />
            </div>
          </div>
        </section>
      </div>
      <section className="lg:-mt-36 bg-zinc-950 text-zinc-200">
        <div className='max-w-6xl mx-auto py-24 px-3 md:flex flex-row-reverse items-end'>
          <div className="md:w-2/3">
            <p className="text-md leading-relaxed">
              Content uploaded to web3.storage is stored on our instance of <a href="https://github.com/elastic-ipfs/elastic-ipfs">Elastic IPFS</a>, a cloud-native implementation of IPFS that our team wrote to stay reliable and performant with the scale of uploads we were seeing. Elastic IPFS ensures your data is continuously and quickly available over the IPFS network once your data is uploaded.
            </p>
            <p className="text-md leading-relaxed pt-8">
              Before data is uploaded, it is locally converted into a CAR file, which contains your data transformed into a format that IPFS can consume (a directed acyclic graph, or <a href='https://dag.ipfs.tech/'>DAG</a>). This is very powerful - in this process, a  <a href="https://docs.ipfs.tech/concepts/content-addressing/">content address</a> is locally generated for your data, giving you a guarantee of your data&apos;s fingerprint. Further, you can construct the DAG in useful ways, like making individual files within your folders or key-value pairs in your JSON have their own content addresses.
            </p>
            <p className='font-bold text-lg leading-relaxed pt-8'>
              Once the CAR file is uploaded, a queue of geographically distributed Filecoin storage providers, selected for performance and availability, bid for the right to store these deals.
            </p>
            <p className="text-md leading-relaxed pt-8">
              The Filecoin storage network provides a global network of storage providers who bid against each other to store data. web3.storage makes a minimum of 5 deals with the various storage providers.
            </p>
            <p className="text-md leading-relaxed pt-8">
              These storage providers generate cryptographic proofs that they are continuously storing your data. The additional redundancy provided by these storage providers is very powerful. You can use the Filecoin blockchain to directly validate that your data is actually physically being stored - without having to take web3.storage’s word for it!
            </p>
            <p className="text-md leading-relaxed pt-8">
            Our aim today is to provide a user-friendly experience that massively reduces the burden for onboarding new use cases into the web3 ecosystem today - while providing an upgrade path for the future.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-zinc-100 text-zinc-950">
        <div className="max-w-6xl mx-auto py-24 px-3">
          <div className="md:flex gap-16">
            <div className="md:w-1/2">
              <h2 className='font-bold text-4xl leading-relaxed'>How does web3.storage work?</h2>
              <p className='pt-8 text-md font-light leading-loose'>
                <a className='text-indigo-700 font-semibold' href="https://web3.storage/docs/#quickstart">Developers can start building in a matter of minutes</a> - allowing them to take advantage of all the power and openness of the decentralized web with none of the infrastructure complexity.
              </p>
              <p className='pt-8 text-md font-light leading-loose'>
                Behind the scenes, web3.storage is backed by Filecoin and makes content available via IPFS leveraging the unique properties of each network.
              </p>
            </div>
            <div className="md:w-1/2">
              <h3 className="pt-8 text-xl font-bold text-grad">About Filecoin</h3>
              <p className='pt-4 text-md font-light leading-loose'>
                Filecoin offers persistent, decentralized storage - guaranteeing the integrity of the underlying data through a robust economic model while also providing cryptographic proofs for verifiability.
              </p>
              <h3 className="text-xl font-bold text-grad pt-8">About Filecoin</h3>
              <p className='pt-4 text-md font-light leading-loose'>
                IPFS offers content addressing - enabling developers to create immutable links to their content, and flexibility for developers in how they’d like to retrieve their data (whether it be running personal nodes, relying on public infrastructure, or paying for hosted options).
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}