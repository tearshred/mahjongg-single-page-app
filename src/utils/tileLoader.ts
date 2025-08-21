// Vite-specific feature, not standard JavaScript/TypeScript
// It basically tells Vite to look at the specific files inside a specific folder and create
// a way to import it
//
// [import.meta.glob] - runs at build time, so the compiler knows all the files

// [eager: true] - lets the app treat them immediately as React components without extra imports
// [as: "component"] - tells Vite to convert each SVG file into a React component automatically *** OUTDATED v5+
// [IMPORTANT: without `as: "component"` it would just return a URL]
// ?react tells Vite (with @vitejs/plugin-react-swc or vite-plugin-svgr) to transform SVGs into React components.
// const tileData = import.meta.glob("../assets/tiles/*.svg", {
//   eager: true
// });

export function loadTiles(): Record<string, any> {
  return import.meta.glob("../assets/tiles/*.svg", {
    eager: true, //loads all SVGs immediately at build time,
    import: "default", //unwraps the SVG so you get the React component directly instead of { default: Component }.
  });
}

export function loadSharedTiles() : Record<string, any> {
  return import.meta.glob("../assets/shared/*.svg", {
    eager: true,
    import: "default",
  });
}