/* eslint-env node */
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@restaurant/core"],

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
};

export default nextConfig;
