import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { build } from "vite";

const root = resolve(import.meta.dirname, "..");
const output = resolve(root, "dist");

await build({
  root,
  plugins: [react()],
  build: {
    outDir: output,
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: resolve(root, "options.html"),
      output: {
        entryFileNames: "assets/options.js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
});

for (const entry of ["background", "content"]) {
  await build({
    root,
    publicDir: false,
    build: {
      outDir: output,
      emptyOutDir: false,
      sourcemap: true,
      lib: {
        entry: resolve(root, `src/${entry}/index.ts`),
        formats: ["es"],
        fileName: () => `assets/${entry}.js`,
      },
    },
  });
}
