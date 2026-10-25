import type { NextConfig } from "next";

// Set NEXT_PUBLIC_BASE_PATH (e.g. "/eduplay") when the site is served from a
// sub-folder such as username.github.io/eduplay. Leave it empty for a custom
// domain or a <username>.github.io repository.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  // Static HTML export for GitHub Pages
  output: "export",
  trailingSlash: true,
  basePath,
  images: {
    // GitHub Pages has no image server, so photos are pre-sized by
    // `npm run images` and lib/image-loader.ts picks the right width.
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    deviceSizes: [480, 960, 1440, 2000],
    imageSizes: [160, 240, 320],
  },
  turbopack: {
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
