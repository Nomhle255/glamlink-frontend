import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // Required for Docker production builds
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        // Use host.docker.internal to access host machine from Docker
        destination:
          process.env.BACKEND_URL || "http://host.docker.internal:8080/:path*",
      },
    ];
  },
};

export default nextConfig;
