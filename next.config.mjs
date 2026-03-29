/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/sign-in',
        permanent: true,
      },
      {
        source: '/registro',
        destination: '/sign-up',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
