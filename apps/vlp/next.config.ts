import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@vlp/member-ui'],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
    ]
  },
}

export default nextConfig
