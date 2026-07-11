import type { MetadataRoute } from "next";

// ponytail: SVG icon (Octopus on blue) — modern Chrome rasterizes, no PNG conversion needed.
// apple-icon.png in src/app/ covers iOS via Next.js auto-mount.
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
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
