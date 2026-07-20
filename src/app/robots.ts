import type { MetadataRoute } from "next";

// ponytail: proxy.ts redirects all app routes to /login for unauthed users.
// Googlebot only sees /login + /signup. Allow everything, proxy handles the rest.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://jodtang-app.vercel.app/sitemap.xml",
  };
}
