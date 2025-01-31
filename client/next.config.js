/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'via.placeholder.com',
      'm.media-amazon.com',
      'images.amazon.com',
      'images-na.ssl-images-amazon.com',
      'media.walmart.com',
      'i.ebayimg.com'
    ],
  },
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3002/api/:path*',
      },
    ]
  }
}

module.exports = nextConfig 