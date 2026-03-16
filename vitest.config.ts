import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    include: ["**/*.test.ts"],
    exclude: ["node_modules", "dist"],
    setupFiles: ["vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      reportsDirectory: "./coverage",
      include: ["**/src/**/*.ts"],
      exclude: ["**/index.ts"],
    },
  },
  plugins: [tsconfigPaths()],
});
