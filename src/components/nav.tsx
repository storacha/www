import Link from "next/link"
import { Web3StorageLogo } from "./brand"

export function NavLink ({href, children}: {href:string, children: React.ReactNode}) {
  return <Link href={href} className='inline-block uppercase font-medium text-lg md:text-xl py-4 md:py-2 px-2 mx-2 hover:text-zinc-100'>{children}</Link>
}

export function ButtonLink ({href, className = '', children}: {href:string, className?: string, children: React.ReactNode}) {
  return (
    <Link className={`inline-block bg-zinc-950/90 hover:bg-black text-white hover:outline outline-white font-bold text-lg px-8 py-2 rounded-full whitespace-nowrap ${className}`} href={href}>
      {children}
    </Link>
  )
}

export function Header () {
  return (
    <header className='max-w-7xl mx-auto pt-4 md:pt-10 text-zinc-950'>
      <div className='md:flex items-center'>
        <div className='flex-1 px-3'>
          <Web3StorageLogo>web3.storage</Web3StorageLogo>
        </div>
        <nav className='hidden md:block bg-zinc-950/10 md:bg-transparent mt-4 md:mt-0 text-center md:text-left text-zinc-950'>
          <NavLink href='/products/web3storage'>Features</NavLink>
          <NavLink href='/pricing'>Pricing</NavLink>
          <NavLink href='/docs'>Docs</NavLink>
          <ButtonLink href='https://console.web3.storage' className='hidden sm:inline-block ml-4'>
            CONSOLE
          </ButtonLink>
        </nav>
      </div> 
    </header>
  )
}