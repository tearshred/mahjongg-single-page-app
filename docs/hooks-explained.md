# `useMahjonggTileData` Hook Explained

The `useMahjonggTileData.ts` file is a **custom hook** responsible for dynamically generating SVG designs for Mahjongg tiles by pulling all `.svg` files from the `tiles/` folder and storing them as usable tile objects.

This hook acts as the **parent** for:
- `useMahjonggTileDesign.ts` → returns a dictionary like `{ [name]: Component }` for easy rendering.
- // Object.entries(tileData) converts an object into an array of [key, value] pairs - ["../assets/tiles/Front.svg", FrontComponent],
  // Use Object.keys() if you only need keys; use Object.entries() if you need both keys and values.
  // The .map creates a new array on every render, even though tile data never changes.
  // Wrapping it in useMemo(() => ..., []) ensures the tiles array is only built once,
  // and React will reuse the cached result instead of recalculating each render.
- `useMahjonggTileState.ts` → builds full tile objects (`{ id, value, Component, isSelected, isMatched }`) from the tile data.

Code explanatuion - 

export function useMahjonggTileData(): Tile[] {
  // Object.entries(tileData) → turns the object into an array of [key, value] pairs
  // Example: ["../assets/tiles/Front.svg", FrontComponent]

  // Note:
  // - Object.keys() → if you only need keys
  // - Object.entries() → if you need both keys and values

  // .map would create a new array on *every render*, even though tile data never changes.
  // Wrapping with useMemo ensures it only builds once.
  // React will then reuse the cached result instead of recalculating.

  const tileCache: Tile[] = useMemo(() => {
    // Inside map, we unpack [fullPath, Component] from Object.entries
    // Example fullPath: "../assets/tiles/Front.svg"
    // Example Component: imported SVG as a React component

    return Object.entries(tileData).map(([fullPath, Component]) => {
      // --- Extract file name from path ---
      // .split("/") → splits into ["..", "assets", "tiles", "Front.svg"]
      // .pop() → takes "Front.svg"
      // .replace(".svg", "") → leaves "Front"
      //
      // TypeScript note:
      // .pop()! → the `!` tells TS it’s definitely not null or undefined
      // so it is safe to call .replace() on it.

      const fileName = fullPath.split("/").pop()!.replace(".svg", "");

      // --- Return new tile object ---
      // name: fileName → string like "Front"
      // Component: Component as FC
      //
      // Why `as FC`?
      // `import.meta.glob` returns values TS might not automatically recognize as React components.
      // Casting with `as FC` ensures type safety and avoids TS errors.

      return { name: fileName, Component: Component as FC };
    });

    // [] dependency array → React only recomputes if tileData changes
  }, [tileData]);

  // Example usage of generateTileData:
  // const tileNames = generateTileData(tileCache);
  // console.log(tileNames);

  return tileCache;
}

**Why structure it this way?**
- ✅ Speed — tile data is cached with `useMemo`
- ✅ Maintainability — logic is split into smaller, focused hooks
- ✅ Scalability — easy to extend with more tiles or states later

---

## Helper: `generateTileData`

// `(tileData: Tile[]): TileName[]`
// - Function parameter tileData must be an array of Tile objects
// - Return type is TileName[], i.e., an array of strings
//   (TypeScript expects strings, not full Tile objects)

export function generateTileData(tileData: Tile[]): TileName[] {
  // Extract tile names and put them inside a TileName array of strings
  const tileNames: TileName[] = tileData.map((tile) => tile.name);

  return tileNames;
}

