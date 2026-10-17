import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/all", destination: "/learn", permanent: false },
      { source: "/pyqs", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
