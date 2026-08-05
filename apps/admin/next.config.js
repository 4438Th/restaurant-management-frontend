/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@restaurant/core",
    "@restaurant/ui",
    "@restaurant/shared-features",
    "@repo/tailwind-config",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/chef",
        destination: `${process.env.CHEF_APP_URL}/chef`,
      },
      {
        source: "/chef/:path*",
        destination: `${process.env.CHEF_APP_URL}/chef/:path*`,
      },
      {
        source: "/waiter",
        destination: `${process.env.WAITER_APP_URL}/waiter`,
      },
      {
        source: "/waiter/:path*",
        destination: `${process.env.WAITER_APP_URL}/waiter/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/logout",
        destination: "/login",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
