import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Outta Control Volleyball",
    short_name: "OC Volleyball",
    description:
      "Find and register for volleyball tournaments and open gym sessions.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#001D3D",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
