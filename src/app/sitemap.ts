import type { MetadataRoute } from "next";
import { site } from "@/lib/content";

const paths = [
  "",
  "/speisekarte",
  "/monatskarte",
  "/mittagsmenus",
  "/menuevorschlaege",
  "/news",
  "/galerie",
  "/kontakt",
  "/reservierungen",
  "/impressum",
  "/datenschutz",
  "/agb",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return paths.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: path === "" || path === "/speisekarte" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/reservierungen" || path === "/speisekarte" ? 0.9 : 0.7,
  }));
}
