import { DocsLogo } from './components/brand'

const config = {
  logo: <DocsLogo>web3.storage/<span className='font-bold'>docs</span></DocsLogo>,
  project: {
    link: 'https://github.com/web3-storage/w3up'
  },
  docsRepositoryBase: 'https://github.com/web3-storage/www/tree/main',
  useNextSeoProps() {
    return {
      titleTemplate: '%s ⁂ web3.storage'
    }
  },
  footer: {
    component: (
      <footer className='py-6 text-center text-lg'>
        
      </footer>
    )
  },
  primaryHue: {
    dark: 192,
    light: 200
  },
  primarySaturation: 100,
}

export default config
