import { resolve } from "node:path";

import { defineConfig } from "@solidjs/start/config";

const root = resolve(__dirname, ".");

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(root, "src"),
    },
  },
});
