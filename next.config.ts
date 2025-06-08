import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // webpack: (config) => {
  //   config.resolve.alias.canvas = false;
  //   return config;
  // },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
