import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Writer submissions post the full manuscript via a Server Action; Word/Docs paste
  // can exceed the default 1MB multipart limit and surface as a generic load error.
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
