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

import type { TileSymbols, SVGComponent } from "../types/TileProps";

export function loadTileSymbols(): TileSymbols{
  // Vite's glob import for SVG files in the tiles directory
  // This will return an object where keys are file paths and values are React components
  // representing those SVGs.
  // The `?react` query parameter is used to ensure that the SVGs are treated
  // as React components rather than URLs.
  //  // Load all SVG files as React components
  // The <SVGComponent> generic ensures proper typing of the imported components
  const symbolModules = import.meta.glob<SVGComponent>("../assets/tiles/*.svg?react", {
    eager: true, //loads all SVGs immediately at build time,
    import: "default", //unwraps the SVG so you get the React component directly instead of { default: Component }.
  });

  // Convert the loaded modules into our standardized TileSymbol format
  const tileSymbolArray = Object.entries(symbolModules).map(([path, Component]) => {
    // Extract name from path (e.g., "Man1" from "/src/assets/tiles/Man1.svg")
    const name = path.split('/').pop()?.replace('.svg', '') || '';
    
    return {
      name,    // The clean name (e.g., "Man1")
      path,    // Full path to the SVG
      Component // The React component
    };
  });

  // Return both access methods as defined in TileSymbols interface
  return {
    byPath: symbolModules,    // Original format for direct path access
    asArray: tileSymbolArray  // Array format for iteration/filtering
  };
}