import type { MetadataRoute } from "next";

// ponytail: PNG icons for iOS (SVG ignored on home screen). sharp generates from icon.svg.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "จดตัง — Jodtang",
    short_name: "จดตัง",
    description: "Mobile-first personal finance tracker",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#3b82f6",
    lang: "th",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
