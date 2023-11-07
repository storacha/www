/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['shiki', 'vscode-oniguruma']
  }
}

module.exports = nextConfig
