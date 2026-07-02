import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.1.183",
    "192.168.208.1",
    "anthology-moodiness-degraded.ngrok-free.dev",
  ],
};

export default nextConfig;
