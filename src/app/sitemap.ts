import type { MetadataRoute } from "next";

// ponytail: only login + signup are public. App routes redirect to /login.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://jodtang-app.vercel.app/login", lastModified: new Date(), changeFrequency: "yearly", priority: 1 },
    { url: "https://jodtang-app.vercel.app/signup", lastModified: new Date(), changeFrequency: "yearly", priority: 0.8 },
  ];
}
