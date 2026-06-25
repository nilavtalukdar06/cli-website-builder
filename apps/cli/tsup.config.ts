import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.tsx"],
  format: ["esm"],
  clean: true,
  sourcemap: true,
  splitting: false,
  dts: false,
  external: [],
  noExternal: ["@opentui/react", "react-reconciler", "react", "react-dom"],
  banner: {
    js: "#!/usr/bin/env node",
  },
});
