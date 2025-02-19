import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Desabilita o ESLint durante o build de produção
  },
}

export default nextConfig
