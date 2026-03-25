// @ts-check
import { defineConfig } from "astro/config";
import { execSync } from "child_process";

import react from "@astrojs/react";
import node from "@astrojs/node";
import keystatic from "@keystatic/astro";

import tailwindcss from "@tailwindcss/vite";

// Auto-inject the current git branch into process.env for the dev server.
// This makes it available to SSR frontmatter via process.env.SITE_BRANCH.
// For Coolify: set SITE_BRANCH manually in each branch application's env vars.
if (!process.env.SITE_BRANCH) {
  try {
    process.env.SITE_BRANCH = execSync("git rev-parse --abbrev-ref HEAD", {
      stdio: ["pipe", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    // Not a git repo or git not available — leave unset
  }
}
// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),
  integrations: [react(), keystatic()],
  server: {
    host: true,
    port: process.env.PORT ? parseInt(process.env.PORT) : 4321,
  },
  security: {
    checkOrigin: false,
  },

  i18n: {
    defaultLocale: "de",
    locales: ["de", "en", "tr", "hy"],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ["dev.paranomad.de", "localhost", ".paranomad.de"],
    },
  },
});
