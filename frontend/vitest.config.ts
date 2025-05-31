import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.?(*.)?(c|m)[jt]s?(x)"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Adjust if needed
    },
  },
});
