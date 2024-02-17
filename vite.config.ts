import { defineConfig } from "@solidjs/start/config";

import { resolve } from "node:path";

const root = resolve(__dirname, ".");

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(root, "src"),
    },
  },
});
