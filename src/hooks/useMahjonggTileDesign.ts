// useMahjonggTile.ts is a custom hook for dynamically generating SVG designs for tiles
// by pulling the svg folder

export function useMahjonggTileDesign() {

    // Imports all SVGs from the tiles folder as React components

    // Vite-specific feature, not standard JavaScript/TypeScript
    // It basically tells Vite to look at the specific files inside a specific folder and create
    // a way to import it
    //
    // [import.meta.glob] - runs at build time, so the compiler knows all the files
    // [eager: true] - lets the app treat them immediately as React components without extra imports
    // [as: "component"] - tells Vite to convert each SVG file into a React component automatically 
    // [IMPORTANT: without `as: "component"` it would just return a URL] 
    // 
    const tileDesigns = import.meta.glob("../assets/tiles/*.svg", {eager: true, as: "component"});

    return tileDesigns;
    }