import type { MetadataRoute } from "next";

// ponytail: SVG icons (Octopus mascot on blue) — modern Chrome/Safari rasterize, no PNG needed.
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
    ],
  };
}
