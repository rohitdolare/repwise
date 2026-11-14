import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "RepWise — Fitness Guide",
    short_name: "RepWise",
    description: "Today's workout, perfect form, and progressive overload tracking — your gym coach in your pocket.",
    start_url: "/today",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0f1115",
    theme_color: "#0f1115",
    categories: ["health", "fitness", "education"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Today's workout", url: "/today", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
      { name: "Exercise library", url: "/exercises", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
      { name: "My progress", url: "/progress", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
