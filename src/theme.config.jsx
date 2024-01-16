import { useConfig } from 'nextra-theme-docs'
import { DocsLogo } from './components/brand'

/**
 * @type {import('nextra-theme-docs').DocsThemeConfig}
 */
export default {
  logo: <DocsLogo>web3.storage/<span className='font-bold'>docs</span></DocsLogo>,
  primaryHue: {
    dark: 192,
    light: 200
  },
  primarySaturation: 100,
  project: {
    link: 'https://github.com/web3-storage/w3up'
  },
  docsRepositoryBase: 'https://github.com/web3-storage/www/tree/main',
  footer: {
    component: <footer className='py-6 text-center text-lg'></footer>
  },
  head: <></>,
  useNextSeoProps() {
    const { frontMatter } = useConfig()
    return {
      titleTemplate: '%s ⁂ web3.storage',
      description: frontMatter.description || 'Learn how to use web3.storage to decentralize your data storage',
      additionalMetaTags: [
        { content: 'en', httpEquiv: 'Content-Language' },
        { name: 'apple-mobile-web-app-title', content: 'web3.storage/docs' },
        { name: 'msapplication-TileColor', content: '#fff' },
        { name: 'msapplication-TileImage', content: '/app-icon.svg' }
      ],
      openGraph: {
        // set when we have a nice preview image. No image more chill tho, so dont rush./
        // images: [
        //   { url: frontMatter.image || 'https://web3.storage/social-card-web3storage.jpg' }
        // ]
      },
      twitter: {
        cardType: 'summary',
        site: '@web3_storage'
      },
      additionalLinkTags: [
        {
          href: '/apple-touch-icon.png',
          rel: 'apple-touch-icon',
          sizes: '180x180'
        },
        {
          href: '/android-chrome-192x192.png',
          rel: 'icon',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          href: '/android-chrome-512x512.png',
          rel: 'icon',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          href: '/favicon-32x32.png',
          rel: 'icon',
          sizes: '32x32',
          type: 'image/png'
        },
        {
          href: '/favicon-16x16.png',
          rel: 'icon',
          sizes: '16x16',
          type: 'image/png'
        }
      ],
    }
  }
}

