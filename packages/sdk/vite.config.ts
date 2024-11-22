import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config.js";

export default defineConfig({
  plugins: [tsconfigPaths() as any],
});
