import { useMemo } from "react";
import type { Tile } from "../types/Tile";
import type { FC } from "react";

// useMahjonggTileData.ts is a custom hook for dynamically generating SVG designs for tiles
// by pulling the svg folder and properly storing all of the necessary tile data.
// It is acting as a "parent" hook for useMahjonggTileDesign.ts and useMahjonggTileState.ts
// Reason: speed, maintenability and scalability
// `useMahjonggTileDesign` → can just return { [name]: Component } for easy rendering
// `useMahjonggTileState` → builds full tile objects ({ id, value, Component, isSelected, isMatched }) from tile data

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
const tileData = import.meta.glob("../assets/tiles/*.svg", {
  eager: true,
  as: "?component",
});

export function useMahjonggTileData(): Tile[] {
  // Object.entries(tileData) converts an object into an array of [key, value] pairs - ["../assets/tiles/Front.svg", FrontComponent],
  // Use Object.keys() if you only need keys; use Object.entries() if you need both keys and values.
  // The .map creates a new array on every render, even though tile data never changes.
  // Wrapping it in useMemo(() => ..., []) ensures the tiles array is only built once,
  // and React will reuse the cached result instead of recalculating each render.
  const tileCache: Tile[] = useMemo(() => {
   
    // fullPath = "../assets/tiles/Front.svg"
    // Component = imported SVG as React component
    // ([fullPath, Component]) in the map parameter is just unpacking each [key, value] pair from Object.entries
    return Object.entries(tileData).map(([fullPath, Component]) => {

      // .split() - divides a string into an array of substrings based on separator, in this case "/"
      // .pop() - array method that removes the last element from the array and returns it 
      // *** TypeScript Note *** .pop()! - The `!` tells TypeScript that the value from pop() is definitely not empty
      // so it is safe to call .replace() on it.
      // .replace() - replaces ".svg" with an empty string in order to get the tile name 
      // Flow - "../assets/tiles/Front.svg" → split → ["..", "assets", "tiles", "Front.svg"]
      //        "..", "assets", "tiles", "Front.svg"] → pop → "Front.svg"
      //        "Front.svg" → "Front"
      const fileName = fullPath.split("/").pop()!.replace(".svg", "");

      // return - creates and returns a new object
      // name: fileName - name is a property of the object and fileName is the string extracted, e.g. "Front"
      // Component: Component as FC - it tells TypeScript to treat this value as React Function Component
      // ensuring the object matches the `Tile` type
      // The `as FC` is TypeScript-specific; it tells TS to treat this value as a React Function Component
      // Explanation - `import.meta.glob` returns values that TS might not automatically recognize as FC.
      // Without as FC, TypeScript could throw an error that the type doesn’t match Tile.
      return { name: fileName, Component: Component as FC };
    });
    // The [] (dependency array) tells React to recompute the memoized value only when tileData changes; 
    // otherwise it reuses the cached result.
  }, [tileData]);
  //   // Pick a random index
  //   const randomIndex = Math.floor(Math.random() * filenames.length);
  //   const randomTileName = filenames[randomIndex];

  //   console.log(randomTileName); // logs only one tile name

  return tileCache;

}
