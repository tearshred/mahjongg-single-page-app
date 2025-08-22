// See hooks-explained.md for more detailed explanation

import { useMemo } from "react";
import type { Tile, TileName } from "../types/Tile";
import type { FC } from "react";
import { loadTileSymbols } from "../utils/tileSymbolLoader";

// Imports all SVGs from the tiles folder as React components
const tileData = loadTileSymbols();

export function generateTileData(tileData: Tile[]): TileName[] {
  // Extract tile names and put them inside the TileName array of strings
  const tileNames: TileName[] = tileData.map((tile) => tile.name);

  return tileNames;
}

export function useMahjonggTileData(): Tile[] {
  const tileCache: Tile[] = useMemo(() => {
    // Convert the tileData object into an array of Tile objects
    return Object.entries(tileData).map(([fullPath, Component]) => {
      const fileName = fullPath.split("/").pop()!.replace(".svg", "");

      return { name: fileName, Component: Component as FC };
    });
  }, [tileData]);

  generateTileData(tileCache);

  console.log('useMahjonggTileData returning:', tileCache);

  return tileCache;
}
