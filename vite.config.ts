/// <reference types="vitest" />
//The triple-slash /// <reference types="vitest" /> tells TypeScript
// about the Vitest types, including test. Must be at the very top of the
// file, before any imports. It tells TypeScript: “Include the types from
// this package when checking this file.”
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), // React support
    svgr(), // Importing SVGs as React components (needed for tile design)
    tailwindcss(), // TailwindCSS Support
  ],
  preview: {
    allowedHosts: true,
  },
  test: {
    globals: true, // allows describe/it/expect globally
    environment: "jsdom", // Ssimulate browser DOM in Node
    setupFiles: ["./src/setupTests.ts"], // setup file for jest-dom, global configs
    coverage: {
      reporter: ["text", "json", "html"], // optional coverage reporting
    },
    include: ["src/**/*.test.{ts,tsx}"], //This tells Vitest which files to treat as test files.
    //src/**/*.test.{ts,tsx} means:
    //Look in src/ and all subfolders (**/)
    //Match files ending in .test.ts or .test.tsx
  },
});
