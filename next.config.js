/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['shiki', 'vscode-oniguruma']
  }
}

const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './src/theme.config.jsx'
})

module.exports = withNextra(nextConfig)
