import { resolve } from "node:path";
import Icons from "unplugin-icons/vite";

import { defineConfig } from "@solidjs/start/config";

const root = resolve(__dirname, ".");

export default defineConfig({
  plugins: [
    Icons({
      compiler: "solid",
    }),
  ],
  start: {
    ssr: false,
    server: {
      baseURL: process.env.BASE_PATH,
      preset: "static",
    },
  },
  resolve: {
    alias: {
      "@": resolve(root, "src"),
    },
  },
});
